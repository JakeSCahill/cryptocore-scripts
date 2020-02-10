#!/bin/bash

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

trytes=$(node /home/pi/cryptocore-scripts/node-scripts/create-bundle.js $MWM)

echo "Getting tip transactions"

trunk_and_branch=$(node /home/pi/cryptocore-scripts/node-scripts/get-branch-and-trunk.js $MWM)

trunk=$(echo "$trunk_and_branch" | jq '.trunkTransaction')
branch=$(echo "$trunk_and_branch" | jq '.branchTransaction')

# Get the current Unix epoch in milliseconds for the `attachmentTimestamp` field
timestamp=$(date +%s%3N)

saved_transaction_directory="/home/pi/cryptocore-scripts/attached-transaction-trytes"

if [ ! -d $saved_transaction_directory ]; then
    mkdir $saved_transaction_directory
fi

echo "Doing proof of work on CryptoCore"

template='{"command":"attachToTangle","trunkTransaction": %s,"branchTransaction":%s,"minWeightMagnitude":%s,"timestamp":%s,"trytes":%s}'

json_string=$(printf "$template" $trunk $branch $MWM  $timestamp $trytes)

echo "$json_string" | sudo picocom --baud 115200 --echo --imap crcrlf --exit-after 6000 /dev/ttyS0  > $saved_transaction_directory/attached_trytes.txt

attached_trytes=$(node /home/pi/cryptocore-scripts/node-scripts/send-bundle.js $MWM)

echo "$attached_trytes"
