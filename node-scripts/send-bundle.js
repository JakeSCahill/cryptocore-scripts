#!/usr/bin/env node

const Iota = require('@iota/core');
const Transaction = require('@iota/transaction-converter');
const fs  = require('fs');

const network = process.argv[2];

console.log(network);
// Define a node for each IOTA network
const nodes = {
        devnet: 'https://nodes.devnet.iota.org:443',
        mainnet: `https://nodes.iota.org:443`
}

if (network === '14') {
        iota = Iota.composeAPI({
        provider: nodes.mainnet
        });
} else {
        iota = Iota.composeAPI({
        provider: nodes.devnet
        });
}

const data = fs.readFileSync('../cryptocore-scripts/attachedTrytes.txt');
const match = data.toString().match(/(?<=({"trytes":))\["[^\]]+\]/g);
const trytes = JSON.parse(match[0]);


iota.storeAndBroadcast(trytes)
 .then(trytes => {
	console.log("Successfully attached transactions to the Tangle");
	console.log("Tail transaction hash: ");
	console.log(JSON.stringify(trytes.map(t => Transaction.asTransactionObject(t))[trytes.length-1].hash))
})
.catch(error => {
     console.log(error);
})
