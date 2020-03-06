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

// Define a node for each IOTA network
const nodes = {
        devnet: 'https://nodes.devnet.iota.org:443',
        mainnet: `https://nodes.iota.org:443`
}

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

const depth = 3;

// We need the bundle to be in order head to tail before sending it to the node
iota.sendTrytes(trytes.reverse(), depth, network)
   .then(bundle => {
      console.log(`Sent bundle: ${JSON.stringify(bundle, null, 1)}`)
   })
   .catch(error => {
      console.log(error);
   });
