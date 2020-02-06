#!/bin/bash

echo '{"command":"generateRandomSeed","key": 0}' | sudo picocom --baud 115200 --echo --imap crcrlf --exit-after 9000 /dev/ttyS0
