#!/usr/bin/env node

const Iota = require('@iota/core');
const Bundle = require('@iota/bundle');
const Transaction = require('@iota/transaction');
const Converter = require('@iota/converter');
const fs = require('fs');

// Get the first argument that was passed to this script
// This should be a minimum weight magnitude (14 or 9)
const network = parseInt(process.argv[2]);

// Get the second argument that was passed to this script
// This should be a signature
const signature = process.argv[3];

// Get the third argument that was passed to the script
// This should be the path to the file that contains the latest unspent address$
let indexFilePath = process.argv[4];

let indexFile = require(indexFilePath);

// Define a node for each IOTA network
const nodes = {
        devnet: 'https://nodes.devnet.iota.org:443',
        mainnet: `https://nodes.iota.org:443`
}

const depth = 3;

// Connect to the correct IOTA network, depending on the user's
// selection in the main script
if (network === 14) {
	iota = Iota.composeAPI({
        provider: nodes.mainnet
        });
} else {
	iota = Iota.composeAPI({
        provider: nodes.devnet
        });
}

const signatureTrits = Converter.trytesToTrits(signature)

let bundle = new Int8Array(fs.readFileSync('../bash-scripts/bundle'));

// Transaction 0 is the output transaction, so start adding the signature fragments, starting from the next transaction in the bundle
bundle.set(Bundle.addSignatureOrMessage(bundle, signatureTrits, 1));

const trytes = []
for (let offset = 0; offset < bundle.length; offset += Transaction.TRANSACTION_LENGTH) {
    trytes.push(Converter.tritsToTrytes(bundle.subarray(offset, offset + Transaction.TRANSACTION_LENGTH)));
}

// Reverse the trytes so that the transactions are ordered head first
trytes = trytes.reverse();

const savedTransactionTrytes = "/home/pi/cryptocore-scripts/attached-transaction-trytes";

fs.writeFileSync(`${savedTransactionTrytes}/attached_bundle_trytes.txt`, trytes);

// We need the bundle to be in order head to tail before sending it to the node
iota.sendTrytes(trytes, depth, network)
    .then(bundle => {
    // Increment the index to avoid withdrawing from the same address again
    let index = indexFile.index;
    index++;
    indexFile.index = index;
    fs.writeFileSync(indexFilePath, JSON.stringify(indexFile));
    console.log('Bundle sent.');
    let tailTransactionHash = bundle[0].hash;
    console.log(`Tail transaction hash:${tailTransactionHash}`);
})
.catch(error => {
console.log(error);
});
