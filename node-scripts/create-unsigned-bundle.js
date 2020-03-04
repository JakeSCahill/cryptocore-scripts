const Iota = require('@iota/core');
const Bundle = require('@iota/bundle');
const Transaction = require('@iota/transaction');
const Converter = require('@iota/converter');
const fs = require('fs');

// Get the first argument that was passed to this script
// This should be a minimum weight magnitude (14 or 9)
const network = process.argv[2];

// Get the second argument that was passed to this script
// This should be an 81 tryte address from which to withdraw IOTA tokens
const inputAddress = Converter.trytesToTrits(process.argv[3]);

// Get the third argument that was passed to this script
// This should be an 81 tryte address in which to deposit the IOTA tokens from the input address
const outputAddress = Converter.trytesToTrits(process.argv[4]);

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

let value = 0;

Iota.getBalances([inputAddress], 100)
  .then(({ balances }) => {
    value = balances[0];
  })
  .catch(error => {
    console.log(error);
});

const parameters = {
   outputAddress: outputAddress,
   inputAddress: inputAddress,
   securityLevel: 2,
   value: value 
}

createUnsignedBundle(parameters);

async function createUnsignedBundle({ outputAddress, inputAddress, securityLevel, value }) {
let bundle = new Int8Array();
const issuanceTimestamp = Converter.valueToTrits(Math.floor(Date.now() / 1000));

bundle = Bundle.addEntry(bundle, {
  address: outputAddress,
  value: Converter.valueToTrits(value),
  issuanceTimestamp
});

// For every security level, create a new zero-value transaction to which you can later add the rest of the signature fragments
for (let i = 0; i < securityLevel; i++) {
   bundle = Bundle.addEntry(bundle, {
      address: inputAddress,
      value: Converter.valueToTrits(i == 0 ? -value : 0),
      issuanceTimestamp
   });
}

const result = await Bundle.finalizeBundle(bundle);

// Save the bundle array to a binary file
fs.writeFileSync('bundle', result, (error) => {
  if(!error) {
     console.log('Bundle details saved to file');
  } else{
     console.log(`Error writing file: ${error}`);
  }});

const bundleHash = Converter.tritsToTrytes(Transaction.bundle(result));

console.log(bundleHash);
}
