#!/bin/bash

read -p "Please enter your bundle's transaction trytes as an array: " bundle

read -p "Are you sending these transactions to the Devnet or the Mainnet? " MWM

if [[ $MWM =~ ^[mM] ]]
then
	echo "Setting minimum weight magnitude to 14."
	MWM=14
else
	echo "Setting minimum weight magnitude to 9."
	MWM=9
fi 

read -p "Please enter a trunk transaction hash to use to attach your bundle to the Tangle: " trunk

while [[ ! $trunk =~ ^[A-Z9]*{81}$ ]]; do
        echo "Hash invalid. Transaction hashes much contain 81 trytes."
	read -p "Please enter a trunk transaction hash: " trunk
done


read -p "Please enter a branch transaction hash to use to attach your bundle to the Tangle: " branch

while [[ ! $branch =~ ^[A-Z9]*{81}$ ]]; do
        echo "Hash invalid. Transaction hashes much contain 81 trytes."
        read -p "Please enter a branch transaction hash: " branch
done

timestamp=$(date +%s%3N)
echo $timestamp


template='{"command":"attachToTangle","trunkTransaction":"%s","branchTransaction":"%s","minWeightMagnitude":%s,"timestamp":%s,"trytes":%s}'

json_string=$(printf "$template" "$trunk" "$branch" $MWM  $timestamp $bundle)

echo "$json_string" | sudo picocom --baud 115200 --echo --imap crcrlf --exit-after 100000 /dev/ttyS0
