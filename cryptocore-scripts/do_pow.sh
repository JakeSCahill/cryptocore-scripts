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

trytes=$(node /home/pi/scripts/repo/node-scripts/create-bundle.js MWM)

echo "Node returned: $trytes"

trunkAndBranch=$(node /home/pi/scripts/repo/node-scripts/get_branch_and_trunk.js MWM)

trunk=$(echo "$trunkAndBranch" | jq '.trunkTransaction')
branch=$(echo "$trunkAndBranch" | jq '.branchTransaction')

echo "$trunk"

timestamp=$(date +%s%3N)

template='{"command":"attachToTangle","trunkTransaction": %s,"branchTransaction":%s,"minWeightMagnitude":%s,"timestamp":%s,"trytes":%s}'

json_string=$(printf "$template" $trunk $branch $MWM  $timestamp $trytes)

echo "$json_string" | sudo picocom --baud 115200 --echo --imap crcrlf --exit-after 7000 /dev/ttyS0  > attachedTrytes.txt

