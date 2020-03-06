#!/usr/bin/env node
 
const CryptoJS = require('crypto-js');
const converter = require('@iota/converter');
const { wordsToTrits }  = require ('@iota/kerl/out/kerl/src/word-converter');
const BIT_HASH_LENGTH = 384;
const apiKey = new Uint8Array([0xb2, 0x33, 0x12, 0x56, 0x41, 0xf0, 0xcc, 0x60, 0x9c, 0x6f, 0x36, 0x30, 0xe7, 0xf3, 0xb2, 0xfd, 0xb7, 0x2b, 0xbd, 0x2e,
        0x94, 0x40, 0xa5, 0xb0, 0x0a, 0xb5, 0x83, 0x65, 0x5b, 0x01, 0xb1, 0x43, 0xdf, 0x31, 0x3e, 0x9a, 0xa0, 0x90, 0x72, 0x02, 0xdf, 0x5f, 0x16,
        0x40, 0x8e, 0x64, 0xf4, 0xd4]);

// Get the first argument that was passed to this script
// This should be a slot number between 0 and 7
const slot = process.argv[2];

// Get the second argument that was passed to this script
// This should be a keyIndex
const keyIndex = process.argv[3];

// Get the second argument that was passed to this script
// This should be an unsigned bundle hash
const bundleHash = process.argv[4];

// Converts an integer to bytes in the little endian format
function toBytesInt32 (number) {
        return new Uint8Array([(number & 0x000000ff), (number & 0x0000ff00) >> 8, (number & 0x00ff0000) >> 16, (number & 0xff000000) >> 24]);
}

// Converts bytes to a CryptoJS Word Array
function byteArrayToWordArray(byteArray) {
 var wordArray = [];
  for (i = 0; i < byteArray.length; i++) {
   wordArray[(i / 4) | 0] |= byteArray[i] << (24 - 8 * i);
  }

 return CryptoJS.lib.WordArray.create(wordArray, byteArray.length);
}
 
let bundleHashChars = new Buffer.from(bundleHash, "ascii");
let bundleHashBytes = Uint8Array.from(bundleHashChars)
 
var buffer = [];
 
buffer.push(toBytesInt32(slot))
buffer.push(toBytesInt32(keyIndex))
buffer.push(bundleHashBytes)
buffer.push(apiKey)
 
k = CryptoJS.algo.SHA3.create()
k.init({
  outputLength: BIT_HASH_LENGTH,
})
 
for (let b of buffer) {
        k.update(byteArrayToWordArray(b))
}
hash = k.finalize()
console.log(hash.toString(CryptoJS.enc.Hex))
