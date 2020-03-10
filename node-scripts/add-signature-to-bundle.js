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
// This should be the path to the file that contains the index of the latest unspent address
let indexFilePath = process.argv[4];

// Load the file
let indexFile = require(indexFilePath);

// Get the fourth argument that was passed to the script
// This should be the path to which you can save the attached transaction trytes
const savedTransactionDirectory = process.argv[5];

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

let bundle = new Int8Array(fs.readFileSync(`${savedTransactionDirectory}/bundle`));

// Transaction 0 is the output transaction, so start adding the signature fragments, starting from the next transaction in the bundle
bundle.set(Bundle.addSignatureOrMessage(bundle, signatureTrits, 1));

let trytes = []
for (let offset = 0; offset < bundle.length; offset += Transaction.TRANSACTION_LENGTH) {
    trytes.push(Converter.tritsToTrytes(bundle.subarray(offset, offset + Transaction.TRANSACTION_LENGTH)));
}

// Reverse the trytes so that the transactions are ordered head first
trytes = trytes.reverse();

// Save the trytes to a file so that they can later be reattached if needed
fs.writeFile(`${savedTransactionDirectory}/attached_value_trytes.txt`, JSON.stringify(trytes), function(error, result)  {
    if (error){
        console.log(error);
    } else {
        console.log("Bundle trytes saved");
    }
});

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
