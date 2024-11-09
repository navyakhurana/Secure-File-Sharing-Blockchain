# Blockchain based Cloud File Sharing System
Prototype to store files on IPFS and Ethereum Blockchain.

## Introduction

The Secure File Sharing Blockchain project leverages IPFS and Ethereum blockchain technology to provide a decentralized, secure, and transparent platform for sharing files among users. The project aims to combine blockchain's immutability and decentralization with the distributed storage capabilities of IPFS. This approach enhances the security and privacy of file sharing, addressing issues of centralization and data tampering.


## Architecture and Design

The system architecture integrates a smart contract deployed on the Ethereum blockchain 
with IPFS for decentralized file storage. Authorized users register on the blockchain, and files are uploaded to IPFS. The file metadata, including the IPFS hash, is recorded in a smart contract. A React.js frontend facilitates user interactions. The design ensures that files are securely stored and only accessible to authorized users. 

## Functionality

The system allows users to register and share files securely as follows: 

-	User Registration: Users register their addresses, which are verified and stored on the blockchain. 
-	File Upload: Files are uploaded to IPFS, and the IPFS hash is recorded in the smart contract. 
-	File Sharing: Only authorized users can access shared files, providing a secure sharing mechanism. 
-	Decentralized Storage: Files are stored on IPFS, ensuring data availability and redundancy. 

## Requirements
* IPFS 
* Truffle 
* Ganache 
* Web3.js 
* NodeJs 
* Chrome with CORS extension

## Instructions

1) Install IPFS

2) Start IPFS daemon.  

   ipfs daemon

3) Configure config.js variables in Services/config.js.  
   Add Ganache mnemonic to CONFIG.wallet_passphrase. 
   
4) Deploy Smart Contracts using Truffle and Ganache.  
   Configure config.js variables in Services/config.js.  
   
   cd SecureFileSharing.  
   truffle compile -all.  
   truffle migrate -reset.  

4) Use the contract address generated after deployment in config.js, CONFIG.hs_contract_address variable.

5) Start the webapp.  

   npm install.  
   npm start.  

6) Start the React App.    

   cd app.  
   npm install.  
   npm start.  

7) Enable CORS from the Chrome Extension  

Note: The implementation stores the addresses of the authorized accounts in smart contract as per the current Ganache accounts. So, the values would need to be updated as per the blockchain on which the application runs.
 

## Demo

#### Demo Video:

![](https://github.com/vaibs28/SecureFileSharingBlockchain/blob/master/img/s1.png).  


![](https://github.com/vaibs28/SecureFileSharingBlockchain/blob/master/img/s2.png).  


![](https://github.com/vaibs28/SecureFileSharingBlockchain/blob/master/img/s3.png).  



![](https://github.com/vaibs28/SecureFileSharingBlockchain/blob/master/img/s4.png).  


![](https://github.com/vaibs28/SecureFileSharingBlockchain/blob/master/img/s5.png).  
