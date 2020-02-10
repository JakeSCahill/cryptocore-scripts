#!/usr/bin/env node

const Iota = require('@iota/core');

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
if (network === 14) {
        iota = Iota.composeAPI({
        provider: nodes.mainnet
        });
} else {
        iota = Iota.composeAPI({
        provider: nodes.devnet
        });
}

// Ask the connected IOTA node for two tip transaction hashes
iota.getTransactionsToApprove(3)
 .then(transactionHashes => {
     console.log(JSON.stringify(transactionHashes));
})
.catch(error => {
     console.log(error)
})
