import Phaser from "phaser";
import gUp from "./G_up.svg";
import gDown from "./G_down.svg";
import cUp from "./C_up.svg";
import cDown from "./C_down.svg";
import aUp from "./A_up.svg";
import aDown from "./A_down.svg";
import tUp from "./T_up.svg";
import tDown from "./T_down.svg";
import hitSound from "./hit.mp3";

// score
var score = 0;
var scoreText;
let infoText;

let groups = [];
let buttons = [];
let colliders = [];
let isClicked = [];
let isSelected = [];
const G = 0;
const C = 1;
const A = 2;
const T = 3;
const nucleotides = ["G", "C", "A", "T"];
const complementary = ["C", "G", "T", "A"];
let cursors;

let physics;
let time;
let scene;

let hitaudio;
let playing = true;

function getHeight() {
  return parseInt(localStorage.getItem("h"), 10);
}

function getWidth() {
  return parseInt(localStorage.getItem("w"), 10);
}

const destroyFallenObjects = obj => {
  if (obj && obj.body.center.y > getHeight() + 200) {
    obj.destroy();
  }
};

const destroyCollidedObjects = (button, obj) => {
  hitaudio.play();
  obj.destroy();
  button.setScale(1.2);
  time.addEvent({
    delay: 50,
    callback: () => {
      button.setScale(1);
    }
  });
  score++;
  scoreText.setText("Score: " + score);
  localStorage.setItem("assemScore", score);
  var assemHighscore = Math.max(score, localStorage.getItem("assemHighscore"));
  localStorage.setItem("assemHighscore", assemHighscore);
};

const freezeRandomObjects = obj => {
  // if objects are high up enough to be off-screen, and are moving downwards, and are lucky,
  // freeze them momentarily, to make them drop at "random" rates
  if (
    obj &&
    obj.body.center.y < -500 &&
    obj.body.velocity.y > 0 &&
    Math.random() < 0.05
  ) {
    obj.setVelocityY(0);
  }
};
// Assembly game scene
export default class Assembly extends Phaser.Scene {
  // constructor
  constructor() {
    super("Assembly");
  }

  // method to be executed when the scene preloads
  preload() {
    // loading assets
    this.load.image("G_up", gUp);
    this.load.image("G_down", gDown);
    this.load.image("C_up", cUp);
    this.load.image("C_down", cDown);
    this.load.image("A_up", aUp);
    this.load.image("A_down", aDown);
    this.load.image("T_up", tUp);
    this.load.image("T_down", tDown);
    this.load.audio("hitaudio", hitSound);
  }

  // method to be executed once the scene has been created
  create() {
    if (!localStorage.getItem("assemHighscore")) {
      localStorage.setItem("assemHighscore", score);
    }
    if (!localStorage.getItem("assemScore")) {
      localStorage.setItem("assemScore", score);
    }

    hitaudio = this.sound.add("hitaudio");
    time = this.time;
    physics = this.physics;
    scene = this.scene;
    for (let i = 0; i < 4; i++) {
      groups[i] = physics.add.group({
        key: complementary[i] + "_down",
        repeat: 9,
        setXY: { x: (getWidth() * (i + 1)) / 5.0, y: -500, stepY: -500 }
      });

      buttons[i] = physics.add
        .staticGroup()
        .create(
          (getWidth() * (i + 1)) / 5.0,
          getHeight() * 0.75,
          nucleotides[i] + "_up"
        );
      colliders[i] = this.physics.add.collider(
        buttons[i],
        groups[i],
        destroyCollidedObjects
      );
      buttons[i]
        .setInteractive()
        .on("pointerdown", () => {
          isClicked[i] = true;
        })
        .on("pointerup", () => {
          isClicked[i] = false;
        });
    }

    cursors = this.input.keyboard.createCursorKeys();

    scoreText = this.add.text(10, 50, "Score: 0", {
      fill: "0x3f51b5",
      wordWrap: { width: getWidth() - 20, useAdvancedWrap: true }
    });
    infoText = this.add.text(10, 10, "Use arrow keys or click/tap!", {
      fill: "0x3f51b5",
      wordWrap: { width: getWidth() - 20, useAdvancedWrap: true }
    });
  }

  // method to be executed at each frame
  update() {
    // also allow keyboard input
    isSelected[G] = isClicked[G] || cursors.left.isDown;
    isSelected[C] = isClicked[C] || cursors.up.isDown;
    isSelected[A] = isClicked[A] || cursors.down.isDown;
    isSelected[T] = isClicked[T] || cursors.right.isDown;

    for (let i = 0; i < 4; i++) {
      if (isSelected[i]) {
        colliders[i].active = true;
        buttons[i].alpha = 1;
      } else {
        colliders[i].active = false;
        buttons[i].alpha = 0.15;
      }
      groups[i].children.iterate(destroyFallenObjects);
      groups[i].children.iterate(freezeRandomObjects);
    }
    const remaining =
      groups[G].getLength() +
      groups[C].getLength() +
      groups[A].getLength() +
      groups[T].getLength();

    if (remaining === 0) {
      if (playing) {
        playing = false;
        scoreText.setText("Game over! Score: " + score);
        infoText.setText(
          "High Score: " + localStorage.getItem("assemHighscore")
        );
        // score = 0;
        localStorage.setItem("assemScore", score);
        // after user has absorbed the 'game over' screen,
        // move to the next game
        time.addEvent({
          delay: 5000,
          callback: () => {
            infoText.setText("Adding up your scores...");
            time.addEvent({
              delay: 5000,
              callback: () => {
                scene.start("Conclusion");
              }
            });
          }
        });
      }
    } else {
      infoText.setText(`Nucleotides remaining: ${remaining}`);
    }
  }
}
