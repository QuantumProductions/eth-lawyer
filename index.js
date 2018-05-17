const PubSub = require('pubsub-js');

class EthLawyer {
  constructor(options) {
    if (options) {
      if (options.spam) {
        this.spam = true;
      }

      if (options.address && options.abi) {
        this.loadContract(options.address, options.abi);  
      } else {
        console.log("Warning: EthLawyer initiated without address + abi. EthLawyer will still publish metamask account changes.");
      }
    }

    this.lastAddress = null;
    this.loadAccounts();
  }

  canAfford(eth) {
    return this.canAffordWei(eth * 10**18);
  }

  //note that user may still have insufficent eth for gas.
  //eth-lawyer does not take this into account, this way
  //you can show the user affordable options
  //and they can observe the not enough gas in a transaction

  canAffordWei(wei) {
    let address = this.lastAddress;
    return new Promise(function(resolve, reject) {
      if (!address) {
        reject("Not signed in to Metamask");
        return;
      }

      window.web3.eth.getBalance(address, function(a, balance) {
        let amount = balance.toNumber();
        if (amount >= wei) {
          resolve(amount);
        } else {
          reject(amount);
        }
      });
    });
  }

  loadContract(address, abi) {
    let MyContract = web3.eth.contract(abi);
    this.contract = MyContract.at(address);  
  }

  shouldAnnounceAccount(address) {
    return (address != this.lastAddress || this.spam);
  }

  loadAccounts() {
    let web3 = window.web3;
    if (web3) {
      web3.eth.getAccounts(function(a,b) {
        if (b && b.length > 0) {
          this.accountLoaded(b[0]);
        } else {
          this.accountLoaded(null);
          return;
        }
      }.bind(this));  
    } else {
      if (this.shouldAnnounceAccount(null)) {
        PubSub.publish('eth-lawyer-account', {lawyer: this, address: null, lastAddress: this.lastAddress, hasMetamask: false});  
      }
      
      this.lastAddress = null;
    }

    setTimeout(this.loadAccounts.bind(this), 5000);
  }

  accountLoaded(address) {
    if (this.shouldAnnounceAccount(address)) {
      if (!address) {
        PubSub.publish('eth-lawyer-account', {lawyer: this, address: null, lastAddress: this.lastAddress, hasMetamask: true});
      } else {
        PubSub.publish('eth-lawyer-account', {lawyer: this, address: address, lastAddress: this.lastAddress, hasMetamask: true});
      }
    }
    
    this.lastAddress = address;
  }
}

module.exports = EthLawyer;