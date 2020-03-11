#!/bin/bash

# the safe version that also can follow symbolic links
dir="$( dirname $( readlink -f $0 ) )"

echo "Welcome to the spam bundle creator"

read -p "Are you sending transactions to the Devnet or the Mainnet? " MWM

if [[ $MWM =~ ^[mM] ]]
    then
            echo "Setting minimum weight magnitude to 14 for the Mainnet."
            MWM=14
    else
            echo "Setting minimum weight magnitude to 9 for the Devnet."
            MWM=9
fi

echo "Creating bundle"

# Execute the create-bundle.js script to create a bundle of 8 transactions
trytes=$(node ../node-scripts/create-bundle.js $MWM)

echo "Getting tip transactions"

# Execute the get-branch-and-trunk.js script to get two tip transactions
trunk_and_branch=$(node ../node-scripts/get-branch-and-trunk.js $MWM)

trunk=$(echo "$trunk_and_branch" | jq '.trunkTransaction')
branch=$(echo "$trunk_and_branch" | jq '.branchTransaction')

# Get the current Unix epoch in milliseconds for the `attachmentTimestamp` field
timestamp=$(date +%s%3N)

# Make sure a directory exists in which you can save unfinished or pending transactions
saved_transaction_directory="$dir/../my-transactions"

if [ ! -d $saved_transaction_directory ]; then
    mkdir $saved_transaction_directory
fi

echo "Doing proof of work on CryptoCore"

# Create an API request, using the user's answers
template='{"command":"attachToTangle","trunkTransaction": %s,"branchTransaction":%s,"minWeightMagnitude":%s,"timestamp":%s,"trytes":%s}'

json_string=$(printf "$template" $trunk $branch $MWM  $timestamp $trytes)

# Open a serial terminal and enter the API request to do proof of work on the bundle
node ../node-scripts/serial.js "$json_string" | jq ".trytes"  >  $saved_transaction_directory/attached_trytes.txt

# Execute the send-bundle.js script to attach the transaction trytes to the Tangle
attached_trytes=$(node ../node-scripts/send-bundle.js $MWM $saved_transaction_directory)

# Print the result of the send-bundle.js script
echo "$attached_trytes"
