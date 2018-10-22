import Phaser from "phaser";

let texts;
let w, h;
export default class AmpIntro extends Phaser.Scene {
  constructor() {
    super({ key: "AmpIntro" });
  }
  preload() {}
  create() {
    w = parseInt(localStorage.getItem("w"), 10);
    h = parseInt(localStorage.getItem("h"), 10);
    texts = [
      this.add.text(10, 10, "Bridge Amplification", {
        fontSize: "20px",
        fill: "0x3f51b5",
        wordWrap: { width: w - 10, useAdvancedWrap: true }
      }),
      this.add.text(
        10,
        60,
        "The next stage of NGS is bridge amplification, where the DNA attaches to primers and duplicates to form clusters of many identical strands.",
        {
          fill: "0x3f51b5",
          wordWrap: { width: w - 10, useAdvancedWrap: true }
        }
      ),
      this.add.text(
        10,
        180,
        "Click to shoot strands of DNA and try to land them on the rotating primer plate. The more strands that find a unique space to attach, the higher your score.",
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
          this.scene.start("Amplification");
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
