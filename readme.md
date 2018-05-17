```
const EthLawyer = require('eth-lawyer');
const PubSub = require('pubsub-js');

PubSub.subscribe('eth-lawyer-account', function(msg, data) {
  console.log(JSON.stringify(data));
});

let lawyer = new EthLawyer("contract address", "contract abi");
//Loads smart contract address + monitors Metamask account changes
//Including locking or unlocking of account
//Details show in subscription above


//Dev Donation: 0x2c3b0F6E40d61FEb9dEF9DEb1811ea66485B83E7
```

