import React, { Component } from 'react';

class AccountBalance extends Component {
  render() {
    console.log(JSON.stringify(this.props));

    let address = "Unlock Metamask to view account balance.";
    if (this.props.address) {
      address = this.props.address;
    }

    let balance;
    if (this.props.ethString) {
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