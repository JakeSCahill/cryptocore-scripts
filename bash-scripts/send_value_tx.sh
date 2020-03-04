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
template='{"command":"generateAddress", "key": %s, "firstIndex":0, "number": 1, "security": 2)'

json_string=$(printf "$template" "$slot")

echo "Generating an address with index 0 and security level 2"

# Open the serial terminal and enter the API request to generate the address 
input=$(node ../node-scripts/serial.js "$json_string")

echo "$input"

inputAddress=$(grep "(?<=({\"trytes\":\[\"))[^\]]+" input)

echo "$inputAddress"
