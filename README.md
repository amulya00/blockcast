<h1 align="center">
  Blockcast
<p align="center">
  <img width="128" height="128" src="/icons8-ethereum-64.png">
</p>
</h1>
<p align="center" style="font-size: 1.2rem;">Anonymous and censorship resitant chatroom on Ethereum </p>

[![Netlify Status](https://api.netlify.com/api/v1/badges/5c67a2f6-6ebc-4007-9119-4c2c0396deb3/deploy-status)](https://app.netlify.com/sites/condescending-torvalds-af4503/deploys)
![Website](https://img.shields.io/website?logo=netlify&up_message=online&url=https%3A%2F%2Fcondescending-torvalds-af4503.netlify.app)
![GitHub repo size](https://img.shields.io/github/repo-size/amulya00/blockcast?logo=github)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)


## The problem
You need an anonymous decentralized chat room which is simple to use and safe. You also need it to be accessible from anywhere in the world. 
Finally, it should be accessible even on a locally hosted frontend.

## The solution
The solution to combat censorship resistance and provide anonymity is use of blockchain technology. Blockcast uses ethereum, currently on testnet due to monetary limitations. The testnet is provided by Rinkeby. The front-end is based on react.
Functionality to change on-chain username and convenience of multiple chat rooms is also provided.

## Installation

```
npm install 
```

You'll also need metamask browser extension for transactions.

## Usage

```
npm start
```


## Getting your own blockchain

Currently you will be greeted with messages on my blockchain. You might want to create a new blockchain. To do so, compile the smart contract with truffle using your keys from any ethereum node cluster like infura. This will generate a contract address which needs to be provided to var contractAddress in App.js . Also if any changes are made to the smart contract, make sure to compile it and generate a new abi for it.
