#!/usr/bin/env node

const Iota = require('@iota/core');
const Converter = require('@iota/converter');
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
// selection in the CryptoCore script
if (network === 14) {
	iota = Iota.composeAPI({
        provider: nodes.mainnet
        });
} else {
	iota = Iota.composeAPI({
        provider: nodes.devnet
        });
}

// Define an address to send all transaction to
const address = "CRYPTOCORE99999999999999999999999999999999999999999999999999999999999999999999999"

// Create one transfer object for each transaction that you want to send
var transfers = [{
    'address': address,
    // These transactions do not send IOTA tokens
    'value': 0,
    // The `asciiToTrytes()` method supports only basic ASCII characters. As a result, diacritical marks such as accents and umlauts aren't supported and result in an `INVALID_ASCII_CHARS` error.
    'message': Converter.asciiToTrytes('Hello, this is my first message on a CryptoCore'),
    'tag': 'CRYPTOCORE'
},
    
{
    'address': address, 
    'value': 0,
    'message': Converter.asciiToTrytes('Hello, this is my second message on a CryptoCore'),
    'tag': 'CRYPTOCORE'
},

{
    'address': address, 
    'value': 0,
    'message': Converter.asciiToTrytes('Hello, this is my third message on a CryptoCore'),
    'tag': 'CRYPTOCORE'
},

{
    'address': address, 
    'value': 0,
    'message': Converter.asciiToTrytes('Hello, this is my fourth message on a CryptoCore'),
    'tag': 'CRYPTOCORE'
},

{
    'address': address, 
    'value': 0,
    'message': Converter.asciiToTrytes('Hello, this is my fifth message on a CryptoCore'),
    'tag': 'CRYPTOCORE'
},

{
    'address': address, 
    'value': 0,
    'message': Converter.asciiToTrytes('Hello, this is my sixth message on a CryptoCore'),
    'tag': 'CRYPTOCORE'
},

{
    'address': address, 
    'value': 0,
    'message': Converter.asciiToTrytes('Hello, this is my seventh message on a CryptoCore'),
    'tag': 'CRYPTOCORE'
},

{
    'address': address, 
    'value': 0,
    'message': Converter.asciiToTrytes('Hello, this is my eighth message on a CryptoCore'),
    'tag': 'CRYPTOCORE'
}];

// The library expects a seed, but it is not used because these are zero-value transactions,
// therefore this bundle is not signed
const seed = "999999999999999999999999999999999999999999999999999999999999999999999999999999999"

// Chain the transactions into a bundle and save the transaction trytes to a file
iota.prepareTransfers(seed, transfers)
    .then(function(trytes){
        fs.writeFileSync('bundleTrytes.txt', JSON.stringify(trytes), (error) => {
            if(!error) {
               console.log('Bundle trytes saved to file');
            } else{
               console.log(`Error writing file: ${error}`);
            }});
	console.log(JSON.stringify(trytes));
    })
    .catch(error => {
        console.log(error)
})

