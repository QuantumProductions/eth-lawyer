import React, { Component } from 'react';

class AccountBalance extends Component {
  render() {
    let address = "Unlock Metamask to view account balance.";
    console.log(JSON.stringify(this.props));
    if (this.props.address) {
      address = this.props.address;
    }

    let balance;
    if (this.props.ethString || this.props.ethString === "0") {
      balance = this.props.ethString;
    }

    return (
      <div>
        <div className="address">
          Ethereum Address: {address}
        </div>
        <div className="address">
          Balance: {balance}
        </div>
      </div>
    );
  }
}

export default AccountBalance;