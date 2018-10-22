import Phaser from "phaser";
import ProjectLogo from "./projectLogo.png";

let projectLogo;
let time;
let scene;
const FADE_RATE = 0.02;
const FADE_DELAY = 25;
const FADE_TIME = (1 / FADE_RATE) * FADE_DELAY;
const LOGO_DELAY = 2000;
const BLANKSCREEN_DELAY = 500;
export default class ProjectLogoScene extends Phaser.Scene {
  constructor() {
    super({ key: "ProjectLogo" });
  }
  preload() {
    this.load.image("projectLogo", ProjectLogo);
  }
  create() {
    const w = parseInt(localStorage.getItem("w"), 10);
    const h = parseInt(localStorage.getItem("h"), 10);
    projectLogo = this.add
      .image(w / 2, h / 2 - 60, "projectLogo")
      .setScale(w / 2000);

    // fade the logo in, then wait, then out, then wait, then go to next screen
    time = this.time;
    scene = this.scene;
    projectLogo.alpha = 0;
    time.addEvent({
      delay: FADE_DELAY,
      repeat: 1 / FADE_RATE,
      callback: () => {
        projectLogo.alpha += FADE_RATE;
      }
    });
    time.addEvent({
      delay: FADE_TIME + LOGO_DELAY,
      callback: () => {
        time.addEvent({
          delay: FADE_DELAY,
          repeat: 1 / FADE_RATE,
          callback: () => {
            projectLogo.alpha -= FADE_RATE;
          }
        });
      }
    });
    time.addEvent({
      delay: FADE_TIME + LOGO_DELAY + FADE_TIME + BLANKSCREEN_DELAY,
      callback: () => {
        scene.start("TeamLogo");
      }
    });
  }
}
