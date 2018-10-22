import Phaser from "phaser";

let texts;
let w, h;
export default class Conclusion extends Phaser.Scene {
  constructor() {
    super({ key: "Conclusion" });
  }
  preload() {}
  create() {
    w = parseInt(localStorage.getItem("w"), 10);
    h = parseInt(localStorage.getItem("h"), 10);
    const fragScore = parseInt(localStorage.getItem("fragScore"), 10) || 0;
    const ampScore = parseInt(localStorage.getItem("ampScore"), 10) || 0;
    const assemScore = parseInt(localStorage.getItem("assemScore"), 10) || 0;
    const fragHighscore =
      parseInt(localStorage.getItem("fragHighscore"), 10) || 0;
    const ampHighscore =
      parseInt(localStorage.getItem("ampHighscore"), 10) || 0;
    const assemHighscore =
      parseInt(localStorage.getItem("assemHighscore"), 10) || 0;
    texts = [
      this.add.text(10, 10, "Conclusion", {
        fontSize: "32px",
        fill: "0x3f51b5",
        wordWrap: { width: w - 10, useAdvancedWrap: true }
      }),
      this.add.text(
        10,
        60,
        `Your score is (${fragScore} + ${ampScore} + ${assemScore}) = ${fragScore +
          ampScore +
          assemScore}. The highscore is (${fragHighscore} + ${ampHighscore} + ${assemHighscore}) = ${fragHighscore +
          ampHighscore +
          assemHighscore}.`,
        {
          fill: "0x3f51b5",
          wordWrap: { width: w - 10, useAdvancedWrap: true }
        }
      ),
      this.add.text(
        10,
        150,
        "No matter what your score was, we hope you had fun learning about NGS!",
        {
          fill: "0x3f51b5",
          wordWrap: { width: w - 10, useAdvancedWrap: true }
        }
      ),
      this.add.text(
        10,
        240,
        "Credits: www.bensound.com, freesound.org, www.emanueleferonato.com, codepen.io/labdev/pen/sCAKe, Phaser, React",
        {
          fill: "0x3f51b5",
          wordWrap: { width: w - 10, useAdvancedWrap: true }
        }
      ),
      this.add
        .text(w - 150, h - 120, "Replay?", {
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
      texts[4].setX(w - 150);
    }
  }
}
