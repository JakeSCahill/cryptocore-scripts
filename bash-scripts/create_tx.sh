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

read -p "Would you like to send this zero-value transaction to a particular address? " answer

if [[ $answer =~ ^[yY] ]] 
then 
       read -s "Please enter the 81-tryte address: " address
    else
        address="999999999999999999999999999999999999999999999999999999999999999999999999999999999"
fi

#read -p "Please enter a trunk transaction hash: " trunk
#
#while [[ ! $trunk =~ ^[A-Z9]*{81}$ ]]; do
#        echo "Hash invalid. Transaction hashes much contain 81 trytes."
#	read -p "Please enter a trunk transaction hash: " trunk
#done
#
#
#read -p "Please enter a branch transaction hash: " branch
#
#while [[ ! $branch =~ ^[A-Z9]*{81}$ ]]; do
#        echo "Hash invalid. Transaction hashes much contain 81 trytes."
#        read -p "Please enter a branch transaction hash: " branch
#done


tips="$( node ../node-scripts/get-branch-and-trunk.js )"
trunk="$( jq '.trunkTransaction' <<< "$tips" | tr -d '"\n' )"
branch="$( jq '.branchTransaction' <<< "$tips" | tr -d '"\n' )"

echo "got trunk:$trunk branch:$branch"

# Get the current Unix epoch in seconds
timestamp=$(date +%s)

# Make sure a directory exists in which you can save unfinished or pending transactions
saved_transaction_directory="$dir/../my-transactions"

if [ ! -d $saved_transaction_directory ]; then
    mkdir $saved_transaction_directory
fi

echo "Creating transaction and doing proof of work"

# Create an API request, using the user's answers
template='{"command":"jsonDataTX","trunkTransaction":"%s","branchTransaction":"%s","minWeightMagnitude":%d,"tag":"CRYPTOCORE99999999999999999", "address":"%s","timestamp":%s,"data":{"message":"HELLO WORLD FROM CRYPTOCORE"}}'

json_string=$(printf "$template" "$trunk" "$branch" $MWM "$address" $timestamp)

# Open the serial terminal and enter the API request to create a zero-value transaction
node ../node-scripts/serial.js "$json_string" | jq ".trytes[]" | tr -d '"\n' > $saved_transaction_directory/zero_value_transaction_trytes.txt

echo "Attaching the transaction to the Tangle"

# Execute the send-tx.js script to attach the transaction to the Tangle
attached_trytes=$(node ../node-scripts/send-tx.js $MWM $saved_transaction_directory)

# Print the result of the send-tx.js script
echo "$attached_trytes"
