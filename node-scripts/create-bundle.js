#!/usr/bin/env node

const Iota = require('@iota/core');
const Converter = require('@iota/converter');
const fs = require('fs');

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

 const address = "CRYPTOCORE99999999999999999999999999999999999999999999999999999999999999999999999"

 // Create one transfer object for each transaction that you want to send
var transfers = [{
    'address': address,
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

const seed = "999999999999999999999999999999999999999999999999999999999999999999999999999999999"

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

