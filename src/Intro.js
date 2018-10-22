import Phaser from "phaser";
import music from "./bensound-betterdays.mp3";

let texts;
let w, h;
export default class Intro extends Phaser.Scene {
  constructor() {
    super({ key: "Intro" });
  }
  preload() {
    this.load.audio("bgmusic", music);
  }
  create() {
    let bgmusic = this.sound.add("bgmusic");
    bgmusic.play();

    w = parseInt(localStorage.getItem("w"), 10);
    h = parseInt(localStorage.getItem("h"), 10);
    texts = [
      this.add.text(10, 10, "Introduction", {
        fontSize: "32px",
        fill: "0x3f51b5",
        wordWrap: { width: w - 10, useAdvancedWrap: true }
      }),
      this.add.text(
        10,
        60,
        "After incorporating Next Generation Sequencing (NGS) into our project this year, the Dry Lab and Human Practices teams have collaborated to help others learn about this technology.",
        {
          fill: "0x3f51b5",
          wordWrap: { width: w - 10, useAdvancedWrap: true }
        }
      ),
      this.add.text(
        10,
        180,
        "NGS is a revolutionary DNA sequencing method where thousands of genetic fragments can be sequenced at once. NGS technologies follow a three-step process of library preparation, amplification, and sequencing.",
        {
          fill: "0x3f51b5",
          wordWrap: { width: w - 10, useAdvancedWrap: true }
        }
      ),
      this.add
        .text(w - 100, h - 120, "Next", {
          fontSize: "32px",
          fill: "0x3f51b5",
          wordWrap: { width: w - 10, useAdvancedWrap: true }
        })
        .setInteractive()
        .on("pointerdown", () => {
          this.scene.start("FragTitle");
        })
    ];
  }
  update() {
    if (
      w !== parseInt(localStorage.getItem("w"), 10) ||
      h !== parseInt(localStorage.getItem("h"), 10)
    ) {
      w = parseInt(localStorage.getItem("w"), 10);
      h = parseInt(localStorage.getItem("h"), 10);
      texts.forEach(text => {
        text.setWordWrapWidth(w - 10, true);
      });
      texts[3].setX(w - 100);
    }
  }
}
