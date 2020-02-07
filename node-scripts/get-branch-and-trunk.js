#!/usr/bin/env node

const Iota = require('@iota/core');

const network = process.argv[2];

// Define a node for each IOTA network
const nodes = {
        devnet: 'https://nodes.devnet.iota.org:443',
        mainnet: `https://nodes.iota.org:443`
}

if (network === 14) {
        iota = Iota.composeAPI({
        provider: nodes.mainnet
        });
} else {
        iota = Iota.composeAPI({
        provider: nodes.devnet
        });
}


iota.getTransactionsToApprove(3)
 .then(transactionHashes => {
     console.log(JSON.stringify(transactionHashes));
})
.catch(error => {
     console.log(error)
})
