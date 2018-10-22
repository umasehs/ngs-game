import Phaser from "phaser";

let texts;
let w, h;
export default class FragIntro extends Phaser.Scene {
  constructor() {
    super({ key: "FragIntro" });
  }
  preload() {}
  create() {
    w = parseInt(localStorage.getItem("w"), 10);
    h = parseInt(localStorage.getItem("h"), 10);
    texts = [
      this.add.text(10, 10, "Library Preparation: DNA Fragmentation", {
        fontSize: "16px",
        fill: "0x3f51b5",
        wordWrap: { width: w - 10, useAdvancedWrap: true }
      }),
      this.add.text(
        10,
        60,
        "This minigame represents the first stage of NGS, library preparation, where a target sequence is fragmented for easier amplification and sequencing.",
        {
          fill: "0x3f51b5",
          wordWrap: { width: w - 10, useAdvancedWrap: true }
        }
      ),
      this.add.text(
        10,
        180,
        "Drag your mouse across the green DNA to slice them to the right length before they fall off-screen. Be careful not to touch the red fragments! They're already the correct size.",
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
          this.scene.start("Fragmentation");
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
