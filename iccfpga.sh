#!/bin/bash

if [ -z "$1" ]
  then
    echo "Usage: icc-fpga [command]"
fi

function init_secure_element(){
  if [ -z "$4" ]; then
    echo "Usage: icc-fpga init_secure_element [key]"
  fi
  node node-scripts/serial.js "{\"command\": \"initSecureElement\",\"key\": \"$1\"}"
}

function generate_seed(){
  if [ -z "$4" ]; then
    echo "Usage: icc-fpga generate_seed [key]"
  fi
  node node-scripts/serial.js "{\"command\":\"generateRandomSeed\",\"key\": $1}"
  #echo '{"command":"generateRandomSeed","key": 0}' | sudo picocom --baud 115200 --echo --imap crcrlf --exit-after 9000 /dev/ttyS0
}

function generate_address(){
  if [ -z "$4" ]; then
    echo "Usage: icc-fpga generate_address [key] [first_index] [number] [security]"
  fi
  node node-scripts/serial.js "{\"command\":\"generateAddress\",\"key\": $1,\"firstIndex\": $2,\"number\": $3,\"security\": $4}"
}

function commands(){
  if [ $1 = "generate_seed" ]; then
    generate_seed "$2"
  elif [ $1 = "generate_address" ]; then
    generate_address "$2" "$3" "$4" "$5"
  elif [ $1 = "init_secure_element" ]; then
    init_secure_element "$2"
  else
    echo "Command not known"
  fi
}

commands "$@"
#"$1" "$2" "$3" "$4" "$5"