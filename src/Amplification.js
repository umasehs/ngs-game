import Phaser from "phaser";

import throwSound from "./throw.mp3";
import hitSound from "./hit.mp3";
import primerPlate from "./primerPlate.png";
import ssDNA from "./ssDNA.png";

// global game options
var gameOptions = {
  // target rotation speed, in degrees per frame
  baseRotationSpeed: 3,

  // knife throwing duration, in milliseconds
  throwSpeed: 200,

  // minimum angle between two knives
  minAngle: 15
};

// score
var score = 0;
var scoreText;
let infoText;

let throwaudio;
let hitaudio;

let knifeGroup;

let time;
let scene;

function getHeight() {
  return parseInt(localStorage.getItem("h"), 10);
}

function getWidth() {
  return parseInt(localStorage.getItem("w"), 10);
}

// speeds up the rotation as game continues
function getRotationSpeed() {
  return gameOptions.baseRotationSpeed + 0.1 * knifeGroup.getLength();
}

// Amplification game scene
export default class Amplification extends Phaser.Scene {
  // constructor
  constructor() {
    super("Amplification");
  }

  // method to be executed when the scene preloads
  preload() {
    // loading assets
    this.load.image("target", primerPlate);
    this.load.image("knife", ssDNA);
    this.load.audio("throwaudio", throwSound);
    this.load.audio("hitaudio", hitSound);
  }

  // method to be executed once the scene has been created
  create() {
    if (!localStorage.getItem("ampHighscore")) {
      localStorage.setItem("ampHighscore", score);
    }
    if (!localStorage.getItem("ampScore")) {
      localStorage.setItem("ampScore", score);
    }

    throwaudio = this.sound.add("throwaudio");
    hitaudio = this.sound.add("hitaudio");

    // can the player throw a knife? Yes, at the beginning of the game
    this.canThrow = true;

    // group to store all rotating knives
    knifeGroup = this.add.group();

    // adding the knife
    this.knife = this.add.sprite(
      getWidth() / 2,
      (getHeight() / 5) * 4.3,
      "knife"
    );
    this.knife.setScale(0.25);

    // adding the target
    this.target = this.add.sprite(getWidth() / 2, getHeight() / 4, "target"); // y originally 400
    this.target.setScale(0.25);
    // this.target = this.add.sprite(game.config.width / 2, 500, "target");// this.target.setScale(0.25)

    // moving the target on front
    this.target.depth = 1;

    scoreText = this.add.text(10, 50, "Score: 0", {
      fill: "0x3f51b5",
      wordWrap: { width: getWidth() - 20, useAdvancedWrap: true }
    });
    infoText = this.add.text(10, 10, "Tip: Don't hit the same spot twice!", {
      fill: "0x3f51b5",
      wordWrap: { width: getWidth() - 20, useAdvancedWrap: true }
    });
    // waiting for player input to throw a knife
    this.input.on("pointerdown", this.throwKnife, this);

    time = this.time;
    scene = this.scene;
  }

  // method to throw a knife
  throwKnife() {
    // can the player throw?
    if (this.canThrow) {
      throwaudio.play();

      // player can't throw anymore
      this.canThrow = false;

      // tween to throw the knife
      this.tweens.add({
        // adding the knife to tween targets
        targets: [this.knife],

        // y destination
        y: this.target.y + this.target.displayHeight / 2,

        // tween duration
        duration: gameOptions.throwSpeed,

        // callback scope
        callbackScope: this,

        // function to be executed once the tween has been completed
        onComplete: function(tween) {
          // at the moment, this is a legal hit
          var legalHit = true;

          // getting an array with all rotating knives
          var children = knifeGroup.getChildren();

          // looping through rotating knives
          for (var i = 0; i < children.length; i++) {
            // is the knife too close to the i-th knife?
            if (
              Math.abs(
                Phaser.Math.Angle.ShortestBetween(
                  this.target.angle,
                  children[i].impactAngle
                )
              ) < gameOptions.minAngle
            ) {
              // this is not a legal hit
              legalHit = false;

              // no need to continue with the loop
              break;
            }
          }

          // is this a legal hit?
          if (legalHit) {
            // player can now throw again
            this.canThrow = true;

            // adding the rotating knife in the same place of the knife just landed on target
            var knife = this.add.sprite(this.knife.x, this.knife.y, "knife");
            knife.setScale(0.25);

            // impactAngle property saves the target angle when the knife hits the target
            knife.impactAngle = this.target.angle;

            // adding the rotating knife to knifeGroup group
            knifeGroup.add(knife);

            // bringing back the knife to its starting position
            this.knife.y = (getHeight() / 5) * 4.3; // game.config.height / 5 * 4

            // score
            score++;
            scoreText.setText("Score: " + score);

            localStorage.setItem("ampScore", score);

            var ampHighscore = Math.max(
              score,
              localStorage.getItem("ampHighscore")
            );
            localStorage.setItem("ampHighscore", ampHighscore);
          }

          // in case this is not a legal hit
          else {
            hitaudio.play();

            // tween to throw the knife
            this.tweens.add({
              // adding the knife to tween targets
              targets: [this.knife],

              // y destination
              y: getHeight() + this.knife.displayHeight,

              // rotation destination, in radians
              rotation: 5,

              // tween duration
              duration: gameOptions.throwSpeed * 4,

              // callback scope
              callbackScope: this,

              // function to be executed once the tween has been completed
              onComplete: function(tween) {
                scoreText.setText("Game over! Score: " + score);
                infoText.setText(
                  "High Score: " + localStorage.getItem("ampHighscore")
                );
                // score = 0;
                localStorage.setItem("ampScore", score);
                // after user has absorbed the 'game over' screen,
                // move to the next game
                time.addEvent({
                  delay: 5000,
                  callback: () => {
                    infoText.setText("Continuing to next minigame...");
                    time.addEvent({
                      delay: 5000,
                      callback: () => {
                        scene.start("AssemTitle");
                      }
                    });
                  }
                });
              }
            });
          }
        }
      });
    }
  }

  // method to be executed at each frame
  update() {
    // rotating the target
    this.target.angle += getRotationSpeed();

    // getting an array with all rotating knives
    var children = knifeGroup.getChildren();

    // looping through rotating knives
    for (var i = 0; i < children.length; i++) {
      // rotating the knife
      children[i].angle += getRotationSpeed();

      // turning knife angle in radians
      var radians = Phaser.Math.DegToRad(children[i].angle + 90);

      // trigonometry to make the knife rotate around target center
      children[i].x =
        this.target.x + (this.target.displayWidth / 2) * Math.cos(radians);
      children[i].y =
        this.target.y + (this.target.displayHeight / 2) * Math.sin(radians);
    }
  }
}
