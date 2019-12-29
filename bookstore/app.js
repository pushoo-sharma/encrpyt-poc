const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var generateRSAKeypair = require('generate-rsa-keypair');
var pair = generateRSAKeypair();
const nodersa = require('node-rsa');

app.use(bodyParser.json());

app.get('/api/test', (req, res) => {

	const fs = require('fs');

	var employee;

	// String with the private key in PEM format
	console.log(pair.private);
	console.log(pair.public);

	const key = new nodersa(pair.public);

	let encrypted;

	// reading from json file
	fs.readFile('student.json', async (err, data) => {
		if (err) throw err;
	    employee = await JSON.parse(data);
		encrypted = await key.encrypt(employee, 'base64');
		res.json(employee);
	});

	console.log("TCL: encrypted", encrypted);

});

app.listen(3010);

console.log('Running on port 3010...');
