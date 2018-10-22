import Phaser from "phaser";
import FragLogo from "./fragLogo.png";

let fragLogo;
let time;
let scene;
let add;
const FADE_RATE = 0.02;
const FADE_DELAY = 25;
const FADE_TIME = (1 / FADE_RATE) * FADE_DELAY;

export default class FragTitle extends Phaser.Scene {
  constructor() {
    super({ key: "FragTitle" });
  }
  preload() {
    this.load.image("fragLogo", FragLogo);
  }
  create() {
    const w = parseInt(localStorage.getItem("w"), 10);
    const h = parseInt(localStorage.getItem("h"), 10);
    fragLogo = this.add.image(w / 2, h / 2 - 60, "fragLogo").setScale(w / 3000);

    // fade the logo in, then wait, then out, then wait, then go to next screen
    time = this.time;
    scene = this.scene;
    add = this.add;
    fragLogo.alpha = 0;
    time.addEvent({
      delay: FADE_DELAY,
      repeat: 1 / FADE_RATE,
      callback: () => {
        fragLogo.alpha += FADE_RATE;
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
            scene.start("FragIntro");
          });
      }
    });
  }
}
