import React from "react";
import "./styles.css";
import SwapBox from "./components/SwapBox/SwapBox";
export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      tokens: null
    };
    fetch("https://api.1inch.io/v4.0/1/tokens")
      .then((data) => data.json())
      .then((data) => {
        let tokenArr = [];
        for (let i in data.tokens) {
          tokenArr.push(data.tokens[i]);
        }
        console.log(tokenArr);
        this.setState({ tokens: tokenArr });
      });
  }

  render() {
    if (this.state.tokens) {
      return (
        <div className="App">
          <h3>My Swap station</h3>
          <SwapBox tokens={this.state.tokens} />
        </div>
      );
    } else {
      return <div className="App">Loading....</div>;
    }
  }
}
