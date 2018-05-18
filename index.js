const BigNumber = require('bignumber.js');

class EthLawyer {
  constructor(options) {
    if (!options.callback) {
      console.error("ERROR: EthLawyer created without callback. Pass {callback: function(event, data) {..} as one of the key value pairs to the options parameter to the EthLawyer Constructor.");
      return;
    }

    this.callback = options.callback;

    if (options.spam) {
      this.spam = true;
    }

    if (options.address && options.abi) {
      this.loadContract(options.address, options.abi);  
    } else {
      console.warn("Warning: EthLawyer initiated without address + abi. EthLawyer will still publish metamask account changes.");
    }

    this.loadAccounts();
  }

  canAfford(eth) { //as integer or decimal
    window.bn = BigNumber;
    let one = new BigNumber(10 ** 18);
    window.one = one;
    return this.canAffordWei(one.times(eth));
  }

  //note that user may still have insufficent eth for gas.
  //eth-lawyer does not take this into account, this way
  //you can show the user affordable options
  //and they can observe the not enough gas in a transaction

  canAffordWei(wei) { //must be as a bignumber
    let address = this.lastAddress;
    return new Promise(function(resolve, reject) {
      if (!address) {
        reject(new BigNumber(0));
        return;
      }

      window.web3.eth.getBalance(address, function(a, balance) {
        if (balance.greaterThanOrEqualTo(wei)) {
          resolve(balance);
        } else {
          reject(balance);
        }
      });
    });
  }

  loadContract(address, abi) {
    let MyContract = web3.eth.contract(abi);
    this.contract = MyContract.at(address);  
  }

  shouldAnnounceAccount(address) {
    if (!this.firstAnnounce) {
      this.firstAnnounce = true;
      return true;
    }
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
        this.callback('eth-lawyer-account', {lawyer: this, address: null, lastAddress: this.lastAddress, hasMetamask: false});  
      }
      
      this.lastAddress = null;
    }

    setTimeout(this.loadAccounts.bind(this), 5000);
  }

  accountLoaded(address) {
    if (this.shouldAnnounceAccount(address)) {
      if (!address) {
        this.callback('eth-lawyer-account', {lawyer: this, address: null, lastAddress: this.lastAddress, hasMetamask: true});
      } else {
        this.lastAddress = address;
        this.callback('eth-lawyer-account', {lawyer: this, address: address, lastAddress: this.lastAddress, hasMetamask: true});
      }
    }

    this.lastAddress = address;
  }

  filePaperworkWei(functionName, functionParams, wei=0) {
    return new Promise(function(resolve, reject) {
      let callback = function (error, result) {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      }

      if (amount) {
        let payParams = {from: this.lastAddress, value: amount};
        functionParams.push(payParams);
      }

      functionParams.push(callback);

      this.contract[functionName](...functionParams);
    });
  }

  filePaperwork(functionName, functionParams, amount = 0) {
    this.filePaperwork(functionName, functionParams, amount * 10**18);
  }
}

module.exports = EthLawyer;