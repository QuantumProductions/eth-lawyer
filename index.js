const PubSub = require('pubsub-js');

class EthLawyer {
  constructor(address, abi) {
    let web3 = window.web3;

    if (address && abi) {
      this.loadContract(address, abi);  
    } else {
      console.log("Warning: EthLawyer initiated without address + abi. EthLawyer will still publish metamask account changes.");
    }

    this.lastAddress = null;
    this.loadAccounts();
  }

  loadContract(address, abi) {
    let MyContract = web3.eth.contract(abi);
    this.contract = MyContract.at(address);  
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
      Pubsub.publish('eth-lawyer-account', {address: null, lastAddress: this.lastAddress, hasMetamask: false});
      this.lastAddress = null;
    }

    setTimeout(this.loadAccounts.bind(this), 5000);
  }

  accountLoaded(address) {
    if (!address) {
      Pubsub.publish('eth-lawyer-account', {address: null, lastAddress: this.lastAddress, hasMetamask: true});
    } else {
      PubSub.publish('eth-lawyer-account', {address: address, lastAddress: this.lastAddress, hasMetamask: true});
    }
    this.lastAddress = address;
  }
}

module.exports = EthLawyer;