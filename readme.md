```
const EthLawyer = require('eth-lawyer');
const PubSub = require('pubsub-js');


PubSub.subscribe('eth-lawyer-account', function(a, b) {
    console.log(b.lawyer);

    if (b.address) {
      let promise = b.lawyer.canAffordWei(5); //5 wei, could also do b.lawyer.canAfford(5) to check for 5 ETH
      promise.then(function(result) {
        console.log(result); //can afford, show to user
        //TODO: show prompt for buy
      }, function(error) {
        console.log("Insufficient" + error);
      });
    }
  });

  //Create EthLawyer just to read account balances.
  //spam: true will announce current account status every 5 seconds
  //spam: false will only announce when the Metamask address changes (including null)
  window.lawyer = new EthLawyer({spam: true});

  //Create a lawyer to interact with a smart contract.
  window.lawyer = new EthLawyer({address: "0x..", "abi": "...", spam: false});

//Dev Donation: 0x2c3b0F6E40d61FEb9dEF9DEb1811ea66485B83E7
```

