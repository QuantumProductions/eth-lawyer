import React, { Component } from 'react';
import './App.css';
import EthLawyer from 'eth-lawyer';
import AccountBalance from './eth-account-balance-display';
import EthDevTip from './eth-dev-tip';

class App extends Component {
  constructor() {
    super();
    console.log(EthLawyer);
    var callback = function(event, data) {
      if (event === 'eth-lawyer-account') {
        console.log("Hey there");
        if (data.address) {
          this.hasMetamask = true;
          let promise = data.lawyer.canAfford(0.001);
          let that = this;
          promise.then(function(result) {
            window.res = result;
            data.ethString = result.dividedBy(10 ** 18).toString();
            data.canAffordOneThousandthEth = true;
            that.setState(data);
          }, function(result) {
            window.res = result;
            data.canAffordOneThousandthEth = false;
            console.log("Insufficient Funds" + result.toString());
            if (result) {
              data.ethString = result.dividedBy(10 ** 18).toString();  
            } else {
              data.ethString = "0";
            }

            that.setState(data);
          });
        } else {
          this.hasMetamask = data.hasMetamask;
          this.setState({address: data.address, ethString:""});
        }  
      }
    }.bind(this);
      

    window.lawyer = new EthLawyer({spam: true, callback: callback});   
  }

  tipClicked() {
    window.web3.eth.sendTransaction({to: "0x2c3b0F6E40d61FEb9dEF9DEb1811ea66485B83E7", value: 10**15}, function(err, transactionHash) {
      console.log("Tip error" + err);
      console.log("Tip TX" + transactionHash);
    });
  }

  render() {
    if (!this.hasMetamask) {
      return <div>Metamask required</div>
    }

    let address;
    if (this.state && this.state.address) {
      address = this.state.address;
    }

    let ethString;
    if (this.state && this.state.ethString) {
      ethString = this.state.ethString;
    }

    let affordThousandth;
    if (this.state && this.state.canAffordOneThousandthEth) {
      affordThousandth = true;
    }

    return (
      <div className="App">
        <AccountBalance address={address} ethString={ethString} />
        <EthDevTip tipClicked={this.tipClicked.bind(this)} afford={affordThousandth}/>
      </div>
    );
  }
}

export default App;
