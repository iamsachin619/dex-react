import React from "react";
import "./SwapBox.scss";
import GearIcon from "@rsuite/icons/Gear";
import ArrowDownIcon from "@rsuite/icons/ArrowDown";
import DragableIcon from "@rsuite/icons/Dragable";
import ReloadIcon from "@rsuite/icons/Reload";
import { Cascader, Modal, Paragraph, Button, Input } from "rsuite";

import Moralis from "moralis";

class SwapBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalSettings: false,
      modalFrom: false,
      from: props.tokens[51],
      fromVal: 0,
      modalTo: false,
      to: props.tokens[12],
      toVal: 0,
      search: "",
      user: null,
      slippage: 1
    };
    this.search = this.search.bind(this);
    const currentUser = Moralis.User.current();
    if (currentUser) {
      this.setState({ user: currentUser });
    }
  }
  componentDidMount() {
    const currentUser = Moralis.User.current();
    if (currentUser) {
      this.setState({ user: currentUser });
    }
  }

  getQuote() {
    // console.log(
    //   `https://api.1inch.io/v4.0/1/quote?fromTokenAddress=${
    //     this.state.from.address
    //   }&toTokenAddress=${
    //     this.state.to.address
    //   }&amount=${this.state.fromVal.toString()}&fee=1`
    // );
    this.setState({ toVal: "Loading..." });
    fetch(
      `https://api.1inch.io/v4.0/1/quote?fromTokenAddress=${
        this.state.from.address
      }&toTokenAddress=${this.state.to.address}&amount=${
        this.state.fromVal * 10 ** this.state.from.decimals
      }&fee=1`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode) {
          //error some
          if (this.state.fromVal == 0) {
            this.setState({ toVal: 0 });
          } else {
            this.setState({ toVal: "No Liquidity" });
          }
        } else {
          // console.log(data);
          this.setState({
            toVal: data.toTokenAmount / 10 ** this.state.to.decimals
          });
        }
      });
  }

  search(token) {
    if (this.state.search === "") {
      return true;
    } else {
      return (
        token.symbol.slice(0, this.state.search.length).toLowerCase() ===
        this.state.search.toLowerCase()
      );
    }
  }

  async StartSwap(e) {
    // fetch(
    //   `https://api.1inch.io/v4.0/1/swap?fromTokenAddress=${
    //     this.state.from.address
    //   }&toTokenAddress=${this.state.to.address}&amount=${
    //     this.state.fromVal * 10 ** this.state.from.decimals
    //   }&fee=1&fromAddress=${this.state.user.get("ethAddress")}&slippage=${
    //     this.state.slippage
    //   }`
    // )
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data);
    //   });
    //
    //
    // await Moralis.initPlugins();
    // let dex = Moralis.Plugins.oneInch;
    // const options = {
    //   chain: "eth",
    //   fromTokenAddress: this.state.from.address,
    //   toTokenAddress: this.state.to.address,
    //   amount: this.state.fromVal * 10 ** this.state.from.decimals,
    //   fromAddress: Moralis.User.current().get("ethAddress"),
    //   slippage: this.state.slippage
    // };
    //
    //
    // var receipt = await dex.swap(options);
    // console.log(receipt);
    // const receipt = await Moralis.Plugins.oneInch.swap({
    //   chain: "eth", // The blockchain you want to use (eth/bsc/polygon)
    //   fromTokenAddress: "0x0da6ed8b13214ff28e9ca979dd37439e8a88f6c4", // The token you want to swap
    //   toTokenAddress: "0x6fd7c98458a943f469e1cf4ea85b173f5cd342f4", // The token you want to receive
    //   amount: "1000",
    //   fromAddress: Moralis.User.current().get("ethAddress"), // Your wallet address
    //   slippage: 1
    // });
    // console.log(receipt);
  }
  render() {
    return (
      <div className="swapbox">
        <h4>Swap</h4>
        <p>Trade tokens in an instant</p>
        <div
          className="settings"
          onClick={() => {
            this.setState({ modalSettings: true });
          }}
        >
          <GearIcon />
        </div>
        <div className="main">
          {/* <Cascader style={{ width: 224 }}  /> */}
          <div className="from">
            You Sell :
            <button
              className="fromBtn"
              onClick={() => {
                this.setState({ modalFrom: true });
              }}
            >
              <img src={this.state.from.logoURI} width="20px" />
              &nbsp;
              {this.state.from.symbol} <ArrowDownIcon />
            </button>
            <Input
              className="InputValue"
              placeholder="Default Input"
              value={this.state.fromVal}
              onChange={(value) => {
                this.setState({ fromVal: value }, this.getQuote.bind(this));
                //update valuees
              }}
            />
          </div>
          <div
            className="swapTokens"
            onClick={() => {
              this.setState(
                { to: this.state.from, from: this.state.to },
                this.getQuote.bind(this)
              );
              //update Valueesss
            }}
          >
            <DragableIcon />
          </div>
          <div className="to">
            You Buy :
            <button
              className="fromBtn"
              onClick={() => {
                this.setState({ modalTo: true });
              }}
            >
              <img src={this.state.to.logoURI} width="20px" />
              &nbsp;&nbsp;
              {this.state.to.symbol} <ArrowDownIcon />
            </button>
            <button className="reloadQuote" onClick={this.getQuote.bind(this)}>
              <ReloadIcon />
            </button>
            <Input
              className="InputValue"
              placeholder="0"
              value={this.state.toVal}
            />
          </div>
          <div>
            {this.state.user !== null ? (
              <>
                <button
                  className="SwapBtnMain"
                  onClick={this.StartSwap.bind(this)}
                >
                  <span>
                    Proceed to Swap as{" "}
                    <span className="btnAddress">
                      {this.state.user.get("ethAddress").slice(0, 20)}...
                      {this.state.user.get("ethAddress").slice(36)}
                      {/* {this.state.user.get("ethAddress")} */}
                    </span>
                  </span>
                </button>
                <button
                  className="SwapBtnMain LogOut"
                  onClick={() => {
                    Moralis.User.logOut().then(() => {
                      // const currentUser = Moralis.User.current(); // this will now be null
                      this.setState({ user: null });
                    });
                  }}
                >
                  Log Out
                </button>
              </>
            ) : (
              <button
                className="SwapBtnMain"
                onClick={() => {
                  Moralis.authenticate(
                    {
                      signingMessage: "Swap Station by Sachin Singh"
                    }
                    // {
                    //   provider: "walletconnect",
                    //   mobileLinks: [
                    //     "rainbow",
                    //     "metamask",
                    //     "argent",
                    //     "trust",
                    //     "imtoken",
                    //     "pillar"
                    //   ]
                    // }
                  )
                    .then((user) => {
                      // console.log(user);
                      // console.log(user.get("ethAddress"));
                      this.setState({ user: user });
                    })
                    .catch(() => {
                      console.log("error login");
                    });
                }}
              >
                <span>Connect Wallet!</span>
              </button>
            )}
          </div>
        </div>
        {/* from modal */}
        <Modal
          overflow={true}
          open={this.state.modalFrom}
          onClose={() => {
            this.setState({ modalFrom: false });
          }}
          onOpen={() => {
            this.setState({ search: "" });
          }}
        >
          <Modal.Header>
            <Modal.Title>Select a token</Modal.Title>
            <Input
              className="InputValueSearch"
              placeholder="Search token symbol"
              value={this.state.search}
              onChange={(value) => {
                this.setState({ search: value });
              }}
            />
          </Modal.Header>

          <Modal.Body>
            <div className="tokensContainer">
              {this.props.tokens.filter(this.search).map((token) => {
                return (
                  <div
                    className="tokenItem"
                    onClick={() => {
                      if (this.state.to.symbol !== token.symbol) {
                        this.setState(
                          { from: token },
                          this.getQuote.bind(this)
                        );
                        this.setState({ modalFrom: false });
                        //update valuees
                      }
                    }}
                  >
                    <img src={token.logoURI} width="30px" />
                    <div className="tokenItem-Inner">
                      <p>
                        <strong>{token.symbol}</strong>
                      </p>
                      <p>{token.name}</p>
                    </div>
                    <hr />
                  </div>
                );
              })}
            </div>
          </Modal.Body>
          <Modal.Footer>
            {/* <Button
                  onClick={() => {
                    this.setState({ modalFrom: false });
                  }}
                  appearance="primary"
                >
                  Ok
                </Button>
                <Button
                  onClick={() => {
                    this.setState({ modalFrom: false });
                  }}
                  appearance="subtle"
                >
                  Cancel
                </Button> */}
          </Modal.Footer>
        </Modal>

        {/* to modal */}
        <Modal
          overflow={true}
          open={this.state.modalTo}
          onClose={() => {
            this.setState({ modalTo: false });
          }}
          onOpen={() => {
            this.setState({ search: "" });
          }}
        >
          <Modal.Header>
            <Modal.Title>Select a token</Modal.Title>
            <Input
              className="InputValueSearch"
              placeholder="Search token symbol"
              value={this.state.search}
              onChange={(value) => {
                this.setState({ search: value });
              }}
            />
          </Modal.Header>
          <Modal.Body>
            <div className="tokensContainer">
              {this.props.tokens.filter(this.search).map((token) => {
                return (
                  <div
                    className="tokenItem"
                    onClick={() => {
                      if (this.state.from.symbol !== token.symbol) {
                        this.setState({ to: token }, this.getQuote.bind(this));
                        this.setState({ modalTo: false });
                        //update valuees
                      }
                    }}
                  >
                    <img src={token.logoURI} width="30px" />
                    <div className="tokenItem-Inner">
                      <p>
                        <strong>{token.symbol}</strong>
                      </p>
                      <p>{token.name}</p>
                    </div>
                    <hr />
                  </div>
                );
              })}
            </div>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>

        {/* settings */}
        <Modal
          open={this.state.modalSettings}
          onClose={() => {
            this.setState({ modalSettings: false });
          }}
        >
          <Modal.Header>
            <Modal.Title>Swap Settings</Modal.Title>
          </Modal.Header>
        </Modal>
      </div>
    );
  }
}

export default SwapBox;
