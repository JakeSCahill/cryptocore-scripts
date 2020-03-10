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

// Get the second argument that was passed to the script
// This should be the path to which you can save unfinished or pending transactions
const savedTransactionDirectory = process.argv[3];

// Check the file for transaction trytes
const data = fs.readFileSync(`${savedTransactionDirectory}/zero_value_transaction_trytes.txt`);
const match = data.toString().match(/[A-Z9,]*/g);
const trytes = [match[0]];

if (!trytes) {
        console.log("No trytes found. Make sure that proof of work was done and check the following file :");
        console.log(`${savedTransactionTrytes}/zero_value_transaction.txt`);
}

iota.storeAndBroadcast(trytes)
.then(result => {
        console.log(Transaction.asTransactionObject(result[0]));
})
.catch(error => {
        console.log(error)
});
