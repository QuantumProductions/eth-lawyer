https://github.com/QuantumProductions/eth-lawyer

Detect Metamask login, logout & Conveniently interact with Ethereum Smart Contracts.

Most Smart Contract web apps require detection of Metamask accounts.

EthLawyer handles the boilerplate of detecting: 

* Metamask not installed
* Metamask installed but locked
* Metamask installed & unlocked

```
var callback = function(event, data) {
  if (event == 'eth-lawyer-account') {
    //data.address
    //data.hasMetamask
  }
}

//EthLawyer will fire its callback just upon the Metamask account changing by default.
//pass in spam: true to its params to get notified every 5 seconds of the current Metamask account.
window.lawyer = new EthLawyer({spam: true, callback: callback});

//Create a lawyer to interact with a smart contract.
window.lawyer = new EthLawyer({address: "0x..", "abi": "...", spam: false, callback: callback});
```

The EthLawyer's Smart Contract can be accessed directly with 

```
lawyer.contract
```

or you can call and get a Promise with:

```
lawyer.filePaperworkWei(functionName, functionParams, wei, gasPrice)
//wei is optional
//gasPrice is optional
//returns a Promise, with success being the transaction hash.
``` 

I recommend you read the index.js here. This is a simple module and it's good to know what it's doing under the hood.

Currently Metamask supports Ethereum 0.2X API. Make note of which documentation you're reading on the Web3 Github page as there are differences.

For a more complete example, check out the example folder which demonstrates displaying user Account address + balance in react, updating when a new account is switched to or Metamask is locked/unlocked.

This React example also showcases lawyer.canAfford(eth), to determine if the current account has a minimum of eth balance. The conversion from Eth to Wei is handled by the lawyer, or you can call lawyer.canAffordWei(weiAsBigNumber) using bignumber.js 

The React example hides & shows a button based on the lawyer.canAfford result for 0.001 Ethereum.

I hope this saves you time.

```
const EthLawyer = require('eth-lawyer');
var callback = function(event, data) {
  if (event == 'eth-lawyer-account') {
    //also included: data.hasMetamask -- false if no web3 detected
    if (data.address) { //data.address null if locked
      let promise = data.lawyer.canAfford(5); //in eth. to use wei, convert wei to BigNumber and call .canAffordWei
      promise.then(function(result) {
        console.log(result); //can afford, show to user
        //TODO: show prompt for buy
      }, function(error) {
        console.log("Insufficient" + error);
      });
    }
  }
}
  

//Create EthLawyer just to read account balances.
//spam: true will announce current account status every 5 seconds
//spam: false will only announce when the Metamask address changes (including null)
window.lawyer = new EthLawyer({spam: true, callback: callback});

//Create a lawyer to interact with a smart contract.
window.lawyer = new EthLawyer({address: "0x..", "abi": "...", spam: false, callback: callback});

//Dev Donation: 0x2c3b0F6E40d61FEb9dEF9DEb1811ea66485B83E7
```