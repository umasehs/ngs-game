import Phaser from "phaser";
import TeamLogo from "./teamLogo.png";

let teamLogo;
let time;
let scene;
const FADE_RATE = 0.02;
const FADE_DELAY = 25;
const FADE_TIME = (1 / FADE_RATE) * FADE_DELAY;
const LOGO_DELAY = 2000;
const BLANKSCREEN_DELAY = 500;
export default class TeamLogoScene extends Phaser.Scene {
  constructor() {
    super({ key: "TeamLogo" });
  }
  preload() {
    this.load.image("teamLogo", TeamLogo);
  }
  create() {
    const w = parseInt(localStorage.getItem("w"), 10);
    const h = parseInt(localStorage.getItem("h"), 10);
    teamLogo = this.add.image(w / 2, h / 2 - 60, "teamLogo").setScale(w / 1000);

    // fade the logo in, then wait, then out, then wait, then go to next screen
    time = this.time;
    scene = this.scene;
    teamLogo.alpha = 0;
    time.addEvent({
      delay: FADE_DELAY,
      repeat: 1 / FADE_RATE,
      callback: () => {
        teamLogo.alpha += FADE_RATE;
      }
    });
    time.addEvent({
      delay: FADE_TIME + LOGO_DELAY,
      callback: () => {
        time.addEvent({
          delay: FADE_DELAY,
          repeat: 1 / FADE_RATE,
          callback: () => {
            teamLogo.alpha -= FADE_RATE;
          }
        });
      }
    });
    time.addEvent({
      delay: FADE_TIME + LOGO_DELAY + FADE_TIME + BLANKSCREEN_DELAY,
      callback: () => {
        scene.start("Title");
      }
    });
  }
}
