#!/bin/bash

# the safe version that also can follow symbolic links
dir="$( dirname $( readlink -f $0 ) )"

read -p "Are you sending this transaction to the Devnet or the Mainnet? " MWM

if [[ $MWM =~ ^[mM] ]]
then
	echo "Setting minimum weight magnitude to 14."
	MWM=14
else
	echo "Setting minimum weight magnitude to 9."
	MWM=9
fi 

read -p "Please enter the slot number for a seed in the CryptoCore secure memory " slot

while [[ ! $slot =~ ^[0-7]{1}$ ]]; do
        read -p "Please enter a valid slot number between 0 and 7" slot
done

# This demo always uses security level 2
securityLevel=2

# Define a file to keep track of spent addresses
indexFile="../slot-$slot-security-level-$securityLevel-unspent-address-index.json"

# If the file does not exist, create it and set the index to 0
if [ ! -f $indexFile ]; then
    echo "Creating file to keep track of spent addresses by their key index"
    keyIndex=0
    echo -e "{\"index\":$keyIndex}" >  $indexFile
else
	# Read an existing index from the file
    keyIndex=$(tail -n 1 $indexFile | jq .index)
fi

# Make sure a directory exists in which you can save unfinished or pending transactions
saved_transaction_directory="$dir/../my-transactions"

if [ ! -d $saved_transaction_directory ]; then
    mkdir $saved_transaction_directory
fi

# Create a generateAddress API request, using the user's answer
template='{"command":"getAddress", "slot": %d, "keyIndex":%d, "number": 1, "security": %d}'

json_string=$(printf "$template" "$slot" "$keyIndex" "$securityLevel")

echo "Generating an address with index $keyIndex and security level $securityLevel"

# Open the serial terminal and enter the API request to generate the address 
input=$(node ../node-scripts/serial.js "$json_string" | jq ".trytes[]" | tr -d '"')

echo "If you haven't already done so, make sure that this address contains IOTA tokens: $input"

read -p "To which address would you like to send your IOTA tokens? " output

while [[ ! $output =~ ^[A-Z9]*{81}$ ]]; do
       echo "Address is invalid"
       read -p "Please enter an 81 tryte address (without a checksum)" output
done

# Execute the create-unsigned-bundle.js script to create an unsigned bundle from the user's input
unsigned_bundle_hash=$(node ../node-scripts/create-unsigned-bundle.js $MWM $input $output $securityLevel $saved_transaction_directory)

if [[ ! $unsigned_bundle_hash =~ [A-Z9]{81} ]]; then
	echo "$unsigned_bundle_hash"
	exit 0
fi

# Execute the generate-auth.js script to generate a valid auth parameter for the signBundleHash endpoint
auth=$(node ../node-scripts/generate-auth.js $slot $keyIndex $unsigned_bundle_hash)

# Create an API request, using the user's answers
sign_bundle_template='{"command":"signBundleHash", "slot": %d, "keyIndex":%d,"bundleHash":"%s","security":%d, "auth":"%s"}'

sign_bundle_json_string=$(printf "$sign_bundle_template" "$slot" "$keyIndex" "$unsigned_bundle_hash" "$securityLevel" "$auth")

echo "Signing transaction"

# Open the serial terminal and enter the API request to sign the bundle hash
signature=$(node ../node-scripts/serial.js "$sign_bundle_json_string" | jq ".trytes[]" | tr -d '"' | tr -d '\n')

result=$(node ../node-scripts/add-signature-to-bundle.js $MWM $signature $indexFile $saved_transaction_directory)

echo "$result"
