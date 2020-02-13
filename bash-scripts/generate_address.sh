#!/bin/bash

node ../node-scripts/serial.js '{"command":"generateAddress","key": 0,"firstIndex": 0,"number": 5,"security": 2}' 
#echo '{"command":"generateAddress","key": 0,"firstIndex": 0,"number": 5,"security": 2}' | sudo picocom --baud 115200 --echo --imap crcrlf --exit-after 9000 /dev/ttyS0
