require('./services/config');
const ipfsAPI = require('ipfs-api');
const express = require('express');
const fs = require('fs');
const moment = require('moment');
const app = express();
const hsService = require('./services/hs-service');
const web3Utils = require('./services/web3-utils');
const CryptoJS = require("crypto-js");
const bodyParser = require('body-parser');
const cors = require('cors')

app.use(cors());
const ipfs = ipfsAPI(CONFIG.ipfs_api_address, CONFIG.ipfs_api_port, {protocol: 'http'});

app.use(bodyParser.raw({limit: '5mb'}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', CONFIG.clientUrl);
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Content-Type');
    next();
});

app.post('/addRecipient',async function(req,res){
	try 
	{	
		//## prepare data
		//req data will be an array of file data [{"file1":""},{file2:""}]
		//traverse over the reqData and add to the blockchain
		const reqData = req.body;
		var jsonObj = reqData;
		var fileHash = jsonObj["uploadedHashes"];
		console.log("filehash is", fileHash);
		var ipfsHash = jsonObj["fileHash"];
		console.log("ipfs hash is", ipfsHash);
		const epochTime = Math.round(moment().format('X'));
		ipfsHash = String(ipfsHash);
		fileHash = String(fileHash);
		var recipient = jsonObj["address"];
		recipient = String(recipient);
		recipient = recipient.toLowerCase();
		console.log("in lower case ", recipient);
		const data = await hsService.add(ipfsHash, fileHash, epochTime, recipient);
		console.log('Added to ETH Blockchain!');
		res.status(200).send(JSON.stringify({tx:data, ipfsHash: ipfsHash, fileHash: fileHash}));
	} catch (err) {
		console.log(err);

		if(err.message.includes("revert")) {
			res.status(409).send();
		} 
		else {
			res.status(500).send();
		}
	}
})

app.post('/addfile', async function(req, res) {
	try 
	{	
		//## prepare data
		res.setHeader('Access-Control-Allow-Origin', '*');  // Allow any origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
		const fileToAdd = req.body;
		const fileContentWordArray = CryptoJS.lib.WordArray.create(req.body);
		const fileHash = CryptoJS.SHA256(fileContentWordArray).toString();
		
		const epochTime = Math.round(moment().format('X'));
		console.log(moment().format('X'));
		
		//## save to ifps
		const fileIPFS = await ipfs.files.add(fileToAdd);
		console.log('Added to ipfs : ' + fileIPFS[0].hash);
		
		//## save to blockchain
		console.log('fileHash : ' + fileHash);
		//const data = await hsService.add(fileIPFS[0].hash, fileHash, epochTime);
		res.status(200).send(JSON.stringify({ipfsHash: fileIPFS[0].hash, fileHash: fileHash}));
	} catch (err) {
		console.log(err);

		if(err.message.includes("revert")) {
			res.status(409).send();
		} 
		else {
			res.status(500).send();
		}
	}
})

app.get('/getfile', async function(req, res) {
    
	if (!req.query.hash){
		res.status(400).send({msg: 'Please provide file hash!'});
		return;
	}
	
	var hash = req.query.hash;
	console.log('hash', hash);
	try {
		//## get from blockchain
		const response = await hsService.get(hash);
		console.log('getfile',response);
		if(response[0].exists == false) {
			console.log('File hash not found in smart contract!');
			res.status(404).send("Not found!");
			return;
		}
		console.log('Found in ETH Blockchain: ' + web3Utils.bytesToString(response[0].filehash));
		
		const ipfsHash = web3Utils.bytesToString(response[0].ipfshash);
		//## get from ipfs
		const files = await ipfs.files.get(ipfsHash);
		files.forEach((file) => {
			console.log('Found in IPFS: ' + file.path);
			//console.log(file.content.toString('utf8'));
		});

		//## return
		console.log('File found in IPFS and ETH Blockchain!');
		res.status(200).send(JSON.stringify({hash: hash, unixTimeAdded: response[0].dateAdded, exists: response[0].exists, url: CONFIG.ipfs_url + ipfsHash}));
	} catch (err) {
		console.log(err);
		res.status(500).send();
	}
})


app.get('/gethash', async function(req, res) {
    
	if (!req.query.address){
			res.status(400).send({msg: 'Please provide private key!'});
			return;
	}
	
	var key = req.query.address;
	var addr = web3Utils.keyToAddress(key);
	console.log("Printing address from key",addr);
	if(addr.includes("Private key")){
			res.status(501).send("Wrong Private Key");
			return;
	}

	try {
			// Fetch data from blockchain
			const response = await hsService.get1(addr);
			console.log("Response in server", response);
if(response.length==0) {
					console.log('unauthorized!');
					res.status(404).send("unauthorized!");
					return;
			}
console.log('Found in ETH Blockchain: ' + web3Utils.bytesToString(response[0].filehash));
		var data = [];
		for(var i=0;i<response.length;i++){
					const ipfsHash = web3Utils.bytesToString(response[i].ipfshash);
					const fileHash = web3Utils.bytesToString(response[i].filehash);
					const url = CONFIG.ipfs_url + ipfsHash;
			data.push({filehash: fileHash, url: url});
			}

			console.log(data);
			//## get from ipfs
			//files.forEach((file) => {
			//console.log('Found in IPFS: ' + file.path);
			//console.log(file.content.toString('utf8'));
		//});

			res.status(200).send(JSON.stringify(data));
	} catch (err) {
			console.log(err);
			res.status(500).send();
	}
});

app.listen(CONFIG.port, () => console.log(`DocuHash listening on port ${CONFIG.port}`))
