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

read -p "Would you like to send this zero-value transaction to a particular address? " answer

if [[ $answer =~ ^[yY] ]] 
then 
       read -s "Please enter the 81-tryte address: " address
    else
        address="999999999999999999999999999999999999999999999999999999999999999999999999999999999"
fi

read -p "Please enter a trunk transaction hash: " trunk

while [[ ! $trunk =~ ^[A-Z9]*{81}$ ]]; do
        echo "Hash invalid. Transaction hashes much contain 81 trytes."
	read -p "Please enter a trunk transaction hash: " trunk
done


read -p "Please enter a branch transaction hash: " branch

while [[ ! $branch =~ ^[A-Z9]*{81}$ ]]; do
        echo "Hash invalid. Transaction hashes much contain 81 trytes."
        read -p "Please enter a branch transaction hash: " branch
done

timestamp=$(date +%s)

saved_transaction_directory="/home/pi/cryptocore-scripts/attached-transaction-trytes"

if [ ! -d $saved_transaction_directory ]; then
    mkdir $saved_transaction_directory
fi

template='{"command":"jsonDataTX","trunkTransaction":"%s","branchTransaction":"%s","minWeightMagnitude":%s,"tag":"CRYPTOCORE99999999999999999", "address":"%s","timestamp":%s,"data":{"message":"HELLO WORLD FROM CRYPTOCORE"}}'

json_string=$(printf "$template" "$trunk" "$branch" $MWM "$address" $timestamp)

echo "$json_string" | sudo picocom --baud 115200 --echo --imap crcrlf --exit-after 7000 /dev/ttyS0 > $saved_transaction_directory/zero_value_transaction.txt

attachedTrytes=$(node /home/pi/scripts/repo/node-scripts/send-tx.js $MWM)

echo "$attachedTrytes"