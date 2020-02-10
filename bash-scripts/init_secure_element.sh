#!/bin/bash

echo '{"command": "initSecureElement","key": "3780e63d4968ade5d822c013fcc323845d1b569fe705b60006feec145a0db1e3"}' | sudo picocom --baud 115200 --echo --imap crcrlf --exit-after 1000 /dev/ttyS0
