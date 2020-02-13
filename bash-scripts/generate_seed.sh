#!/bin/bash

node ../node-scripts/serial.js '{"command":"generateRandomSeed","key": 0}'
#echo '{"command":"generateRandomSeed","key": 0}' | sudo picocom --baud 115200 --echo --imap crcrlf --exit-after 9000 /dev/ttyS0
