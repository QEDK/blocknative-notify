require("dotenv").config();
var Web3 = require("web3");
const BlocknativeSdk = require('bnc-sdk');
const WebSocket = require('ws');


const blocknative = new BlocknativeSdk({
  dappId: process.env.API_KEY,
  networkId: 5, // Goerli
  ws: WebSocket,
});

var web3 = new Web3(process.env.RPC_URL);

const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);

web3.eth.sendTransaction({from: account.address, to: account.address,
    value: web3.utils.toWei("1", "gwei"), gasPrice: web3.utils.toWei("90", "gwei"), gas: "21000"}).on("transactionHash", hash => {
    const {
        emitter, // emitter object to listen for status updates
        details // initial transaction details which are useful for internal tracking: hash, timestamp, eventCode
    } = blocknative.transaction(hash);
    emitter.on('txSent', console.log)
    emitter.on('txConfirmed', console.log)
    emitter.on('txSpeedUp', console.log)
    emitter.on('txCancel', console.log)
    emitter.on('txFailed', console.log)
});
