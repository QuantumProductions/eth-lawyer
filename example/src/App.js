import React, { Component } from 'react';
import './App.css';
import EthLawyer from 'eth-lawyer';
import AccountBalance from './eth-account-balance-display';

class App extends Component {
  constructor() {
    super();
    var callback = function(event, data) {
      console.log(data.lawyer);

      console.log(data);
      // return;

      if (event === 'eth-lawyer-account') {
        if (data.address) {
          console.log("address" + data.address);
          let promise = data.lawyer.canAfford(1);
          let that = this;
          promise.then(function(result) {
            window.res = result;
            console.log(result.toString());
            data.ethString = result.dividedBy(10 ** 18).toString();
            data.canAffordOneEth = true;
            that.setState(data);
          }, function(result) {
            window.res = result;
            console.log("Insufficient Funds" + result.toString());
            if (result) {
              data.ethString = result.dividedBy(10 ** 18).toString();  
            } else {
              data.ethString = "0";
            }

            that.setState(data);
          });
        }  
      }
    }
      

    window.lawyer = new EthLawyer({callback: callback.bind(this)});   
  }

  render() {
    let address;
    if (this.state && this.state.address) {
      address = this.state.address;
    }

    let ethString;
    if (this.state && this.state.ethString) {
      ethString = this.state.ethString;
    }
    return (
      <div className="App">
        <AccountBalance address={address} ethString={ethString} />
      </div>
    );
  }
}

export default App;
