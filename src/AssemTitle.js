import Phaser from "phaser";
import AssemLogo from "./assemLogo.png";

let assemLogo;
let time;
let scene;
let add;
const FADE_RATE = 0.02;
const FADE_DELAY = 25;
const FADE_TIME = (1 / FADE_RATE) * FADE_DELAY;

export default class AssemTitle extends Phaser.Scene {
  constructor() {
    super({ key: "AssemTitle" });
  }
  preload() {
    this.load.image("assemLogo", AssemLogo);
  }
  create() {
    const w = parseInt(localStorage.getItem("w"), 10);
    const h = parseInt(localStorage.getItem("h"), 10);
    assemLogo = this.add
      .image(w / 2, h / 2 - 60, "assemLogo")
      .setScale(w / 3000);

    // fade the logo in, then wait, then out, then wait, then go to next screen
    time = this.time;
    scene = this.scene;
    add = this.add;
    assemLogo.alpha = 0;
    time.addEvent({
      delay: FADE_DELAY,
      repeat: 1 / FADE_RATE,
      callback: () => {
        assemLogo.alpha += FADE_RATE;
      }
    });
    time.addEvent({
      delay: FADE_TIME,
      callback: () => {
        add
          .text(w / 2 - 50, h - 120, "START", {
            fontSize: "32px",
            fill: "0x3f51b5",
            wordWrap: { width: w - 20, useAdvancedWrap: true }
          })
          .setInteractive()
          .on("pointerdown", () => {
            scene.start("AssemIntro");
          });
      }
    });
  }
}
