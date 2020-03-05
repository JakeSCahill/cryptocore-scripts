#!/bin/bash

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

# Create a generateAddress API request, using the user's answer
template='{"command":"getAddress", "slot": %s, "keyIndex":0, "number": 1, "security": 2}'

json_string=$(printf "$template" "$slot")

echo "Generating an address with index 0 and security level 2"

# Open the serial terminal and enter the API request to generate the address 
input=$(node ../node-scripts/serial.js "$json_string" | jq ".trytes[]" | tr -d '"')

echo "If you haven't already done so, make sure that this address contains IOTA tokens: $input"

read -p "To which address would you like to send your IOTA tokens? " output

while [[ ! $output =~ ^[A-Z9]*{81}$ ]]; do
       echo "Address is invalid"
       read -p "Please enter an 81 tryte address (without a checksum)" output
done

# Execute the create-unsigned-bundle.js script to create an unsigned bundle from the user's input
unsigned_bundle_hash=$(node ../node-scripts/create-unsigned-bundle.js $MWM $input $output)

if [[ ! $unsigned_bundle_hash =~ [A-Z9]*{81} ]]; then
	echo "$unsigned_bundle_hash"
	exit 0
fi

echo "$unsigned_bundle_hash"

# Execute the generate-auth.js script to generate a valid auth parameter for the signTransaction endpoint
auth=$(node ../node-scripts/generate-auth.js $slot $unsigned_bundle_hash)

# Create an API request, using the user's answers
sign_bundle_template='{"command":"signBundleHash", "slot": %s, "keyIndex":0,"bundleHash":"%s","security":2, "auth":"%s"}'

sign_bundle_json_string=$(printf "$sign_bundle_template" "$slot" "$unsigned_bundle_hash" "$auth")

echo "$sign_bundle_json_string"

echo "Signing transaction"

# Open the serial terminal and enter the API request to create a zero-value transaction
signature=$(node ../node-scripts/serial.js "$sign_bundle_json_string" | jq ".trytes[]" | tr -d '"' | rev | cut -c 2- | rev|tr -d '\n')

result=$(node ../node-scripts/add-signature-to-bundle.js $MWM $signature)

echo "$result"
