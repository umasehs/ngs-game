import React, { Component } from "react";
import Phaser from "phaser";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import ProjectLogo from "./ProjectLogo";
import TeamLogo from "./TeamLogo";
import Title from "./Title";
import Intro from "./Intro";
import FragTitle from "./FragTitle";
import FragIntro from "./FragIntro";
import Fragmentation from "./Fragmentation";
import AmpTitle from "./AmpTitle";
import AmpIntro from "./AmpIntro";
import Amplification from "./Amplification";
import AssemTitle from "./AssemTitle";
import AssemIntro from "./AssemIntro";
import Assembly from "./Assembly";
import Conclusion from "./Conclusion";

const styles = () => ({
  root: {
    height: "90%",
    border: "3px solid #3f51b5"
  }
});

let w, h;
let game;

class PhaserContainer extends Component {
  componentWillUnmount() {
    game.destroy(true);
  }

  componentDidMount() {
    w = this.props.size.width;
    h = this.props.size.height;
    localStorage.setItem("w", w);
    localStorage.setItem("h", h);
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
      scene: [
        ProjectLogo,
        TeamLogo,
        Title,
        Intro,
        FragTitle,
        FragIntro,
        Fragmentation,
        AmpTitle,
        AmpIntro,
        Amplification,
        AssemTitle,
        AssemIntro,
        Assembly,
        Conclusion
      ],
      parent: "phaser-container",
      backgroundColor: "0xFFFFFF"
    };

    game = new Phaser.Game(config);
  }

  // Phaser game rendered within HTML div
  render() {
    w = this.props.size.width;
    h = this.props.size.height;
    localStorage.setItem("w", w);
    localStorage.setItem("h", h);
    if (game) {
      game.resize(w - 10, h * 0.9);
    }

    return <div className={this.props.classes.root} id="phaser-container" />;
  }
}

PhaserContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  size: PropTypes.object.isRequired
};

export default withStyles(styles)(PhaserContainer);
