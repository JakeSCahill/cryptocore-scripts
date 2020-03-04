#!/bin/bash

function usage {
    echo "Usage: iccfpga [command]"
    echo 
    echo "commands:"
    echo "    init_secure_element [key]"
    echo "    set_activate_seed [bip39-path] [security (1-3)]"
    echo "    generate_seed [slot (0-7)]"
    echo "    generate_address [slot (0-7)] [first_index (>=0)] [number (1-100)] [security (1-3)]" 
    echo
    echo "slot 7 is always BIP39 and needs to be activated before using. Example:"
    echo "    set_activate_seed \"44'/4218'/0'/0'\"" 2
    exit 1
}

function error {
  echo "invalid parameter"
  echo
  usage
}  

[[ "$1" == "" || "$1" == "-h" || "$1" == "--help" ]] && usage

function validate_key {
  grep -qP '^[0-9a-f]{64}$' <<< "$1"
  return $?
}

function is_number {
  [ ! -z "$1" ] && [ "$1" -eq "$1" ] 2> /dev/null
  return $?
}

function validate_slot {
  is_number "$1" && (( $1 >= 0 && $1 <= 7 ))
  return $?
}

function validate_number {
  is_number "$1" && (( $1 >= 1 && $1 <= 100 ))
  return $?
}

function validate_security {
  is_number "$1" && (( $1 >= 1 && $1 <= 3 ))
  return $?
}

function validate_keyindex {
  is_number "$1"
  return $?
}

function validate_bip39 {
  grep -Po "^([0-9]+'/){3}[0-9]+'" <<< "$1"
  return $?
}

function init_secure_element {
  validate_key "$1" || error
  node node-scripts/serial.js "{\"command\": \"initSecureElement\",\"key\": \"$1\"}"
}

function generate_seed {
  validate_slot "$1" || error
  node node-scripts/serial.js "{\"command\":\"generateRandomSeed\",\"slot\": $1}"
}

function generate_address {
  validate_slot "$1" &&
  validate_keyindex "$2" &&
  validate_number "$3" &&
  validate_security "$4" || error
  node node-scripts/serial.js "{\"command\":\"getAddress\",\"slot\": $1,\"keyIndex\": $2,\"number\": $3,\"security\": $4}"
}

function set_activate_seed {
  validate_bip39 "$1" && 
  validate_security "$2" || error
  node node-scripts/serial.js "{\"command\":\"setActiveSeed\",\"path\":\"$1\",\"security\": $2}"
}

function get_version {
  node node-scripts/serial.js "{\"command\":\"version\"}"
}

case "$1" in
generate_seed | \
generate_address | \
init_secure_element | \
get_version | \
set_activate_seed )
	$@
	;;
*)
	echo "unknown command: $1"
	echo
	usage
	exit 1
esac

exit 0
