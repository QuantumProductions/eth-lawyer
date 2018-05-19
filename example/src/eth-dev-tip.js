import React, { Component } from 'react';

class EthDevTip extends Component {
  render() {
    if (!this.props.afford) {
      return <div/>
    }

    return (
      <div>
        <div className="eth-dev-tip">
          <button onClick={this.props.tipClicked}>Tip Dev 0.001 Eth </button>
        </div>
        
      </div>
    );
  }
}

export default EthDevTip;