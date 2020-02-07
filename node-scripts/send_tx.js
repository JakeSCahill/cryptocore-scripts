const Iota = require('@iota/core');
const Transaction = require('@iota/transaction-converter');
const fs = require('fs');
const prompt = require('prompt');

const nodes = {
    devnet: 'https://nodes.devnet.iota.org:443',
    mainnet: `https://nodes.iota.org:443`
}

// This json object is used to configure what data will be retrieved from command line.
var prompt_attributes = [
    {
        name: 'network',
        // The network can begin with a D for Devnet or an M for Mainnet
        validator: /^[dDmM]$/,
        // If given data is not valid then prompt below message.
        warning: 'Please enter D for the Devnet or M for the Mainnet'
    },
    {
        // The second input text is assigned to password variable.
        name: 'trytes',
	// Allow a single string of trytes
        validator: /^[A-Z9]+[^,]$/,
        // If given data is not valid then prompt below message.
        warning: 'Please enter a single string of transaction trytes.'
    }
];

// Start the prompt to read user input.
prompt.start();

// Prompt and get user input then display those data in console.
prompt.get(prompt_attributes, function (err, result) {
    if (err) {
        console.log(err);
        return 1;
    } else {
        console.log('Command-line received data:');

        // Get user input from result object.
        var network = result.network;
        var trytes = result.trytes;

        if (network === 'd' || network === 'D'){
		iota = Iota.composeAPI({
	        // Replace with the URL of the IRI node you want to send the transactio$
        	 provider: nodes.devnet
     		});
	} else {
		iota = Iota.composeAPI({
                // Replace with the URL of the IRI node you want to send the tr$
                 provider: nodes.mainnet
                });
	}
	const trytesArray = new Array(1);

	trytes[0] =  trytes;

	const now = Date.now();

	fs.writeFileSync(`trytes-${now}.txt`, JSON.stringify(trytes), (error) => {
    	if (!error) {
       		console.log(`Trytes saved to file trytes-${now}.txt`);
    	} else {
		console.log(`Error writing file: ${error}`);
	}});

	iota.storeAndBroadcast(trytesArray)
	.then(result => {
    		console.log(Transaction.asTransactionObject(result));
	})
	.catch(error => {
    		console.log(error)
	});
    }
});
