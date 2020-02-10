#!/usr/bin/env node

const Iota = require('@iota/core');
const Transaction = require('@iota/transaction-converter');
const fs = require('fs');

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
const data = fs.readFileSync(`${savedTransactionTrytes}/zero_value_transaction.txt`);
const match = data.toString().match(/(?<=({"trytes":))\["[^\]]+\]/g);
const trytes = JSON.parse(match[0]);

console

if (!trytes) {
        console.log("No trytes found. Make sure that proof of work was done and check the following file :");
        console.log(`${savedTransactionTrytes}/zero_value_transaction.txt`);
}

iota.storeAndBroadcast(trytes)
.then(result => {
        console.log(Transaction.asTransactionObject(result));
})
.catch(error => {
        console.log(error)
});
