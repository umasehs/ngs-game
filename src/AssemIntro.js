import Phaser from "phaser";

let texts;
let w, h;
export default class AssemIntro extends Phaser.Scene {
  constructor() {
    super({ key: "AssemIntro" });
  }
  preload() {}
  create() {
    w = parseInt(localStorage.getItem("w"), 10);
    h = parseInt(localStorage.getItem("h"), 10);
    texts = [
      this.add.text(10, 10, "DNA Sequence Assembly", {
        fontSize: "20px",
        fill: "0x3f51b5",
        wordWrap: { width: w - 10, useAdvancedWrap: true }
      }),
      this.add.text(
        10,
        60,
        "The final step in NGS is to sequence our DNA. Fluorescent nucleotide bases attach to their complementary base pairs on the strands, forming a glowing complementary sequence which is read by the computer.",
        {
          fill: "0x3f51b5",
          wordWrap: { width: w - 10, useAdvancedWrap: true }
        }
      ),
      this.add.text(
        10,
        180,
        "Sequence our DNA, as each base crosses the read line, by using the arrow keys or clicking/tapping the correct complementary base!",
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
          this.scene.start("Assembly");
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
