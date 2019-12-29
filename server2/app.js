const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var generateRSAKeypair = require('generate-rsa-keypair');
var pair = generateRSAKeypair();
const nodersa = require('node-rsa');
var Request = require("request");
var crypto = require('crypto');


app.use(bodyParser.json());

app.get('/api/test', (req, res) => {


	// String with the private key in PEM format
	console.log(pair.public);
	console.log(pair.private);

	

	// Symmetric Algo Setting
	var algorithm = 'aes256';
	var inputEncoding = 'utf8';
	var outputEncoding = 'hex';

	// requesting other server
	Request.post({
		"headers": { "content-type": "application/json" },
		"url": "http://localhost:3018/api/test",
		"body": JSON.stringify({
			"publicKey": pair.public
		})
	}, (error, response, body) => {
		if (error) {
			return console.log(error);
		}
		
		var responseBody = JSON.parse(body)
		
		// decrypt Secret key using RSA Private key
		decryptedSecretKey = new nodersa(pair.private).decrypt(responseBody.key, inputEncoding);
        

		// Create Decipher using Secret key
		var decipher = crypto.createDecipher(algorithm, decryptedSecretKey);

		// decrypt Response Data
		var decipheredData = decipher.update(responseBody.ciphered, outputEncoding, inputEncoding);

		res.send(decipheredData);
	});

});

app.listen(3015);

console.log('Running on port 3015...');
