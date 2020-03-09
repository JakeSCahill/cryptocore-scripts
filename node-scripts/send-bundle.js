#!/usr/bin/env node

const Iota = require('@iota/core');
const Transaction = require('@iota/transaction-converter');
const fs  = require('fs');

// Get the first argument that was passed to this script
// This should be a minimum weight magnitude (14 or 9)
const network = process.argv[2];

// Define a node for each IOTA network
const nodes = {
        devnet: 'https://nodes.devnet.iota.org:443',
        mainnet: `https://nodes.iota.org:443`
}

// Connect to the correct IOTA network, depending on the user's
// selection in the main script
if (network === '14') {
        iota = Iota.composeAPI({
        provider: nodes.mainnet
        });
} else {
        iota = Iota.composeAPI({
        provider: nodes.devnet
        });
}

// Path to the file where the main script saved the transaction trytes
const savedTransactionTrytes = "/home/pi/cryptocore-scripts/attached-transaction-trytes";


// Check the file for transaction trytes
let trytes = fs.readFileSync(`${savedTransactionTrytes}/attached_trytes.txt`).toString();

if (!trytes) {
        console.log("No trytes found. Make sure that proof of work was done and check the following file :");
        console.log(`${savedTransactionTrytes}/attached_trytes.txt`);
}

trytes = JSON.parse(trytes);

// Send the transaction trytes to the connected IOTA node
iota.storeAndBroadcast(trytes)
 .then(trytes => {
        console.log("Successfully attached transactions to the Tangle");
        // print the transaction details
	console.log("Tail transaction hash: ");
	console.log(JSON.stringify(trytes.map(t => Transaction.asTransactionObject(t))[trytes.length-1].hash))
})
.catch(error => {
     console.log(error);
})
