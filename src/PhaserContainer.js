import React, { Component } from "react";
import Phaser from "phaser";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Fragmentation from "./Fragmentation";

const styles = () => ({
  root: {
    height: "90%",
    border: "3px solid #3f51b5"
  }
});

class PhaserContainer extends Component {
  constructor(props) {
    super(props);
    this.divElement = React.createRef();
    this.state = { game: null };
  }

  componentWillUnmount() {
    this.state.game.destroy(true);
  }

  componentDidMount() {
    const w = this.divElement.current.clientWidth;
    const h = this.divElement.current.clientHeight;
    localStorage.setItem("w", w, "h", h);
    // The game will be configured with these settings:
    const config = {
      type: Phaser.AUTO,
      width: w,
      height: h,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: h / 3 },
          debug: false
        }
      },
      scene: [Fragmentation],
      parent: "phaser-container",
      backgroundColor: "0xFAFAFA"
    };

    this.setState({ game: new Phaser.Game(config) });
  }

  // Phaser game rendered within HTML div
  render() {
    return (
      <div
        className={this.props.classes.root}
        id="phaser-container"
        ref={this.divElement}
      />
    );
  }
}

PhaserContainer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PhaserContainer);
