import Phaser from "phaser";

import happy from "./dna.svg";
import sad from "./bomb.svg";
import happyPart from "./dnaPart.svg";
import sadPart from "./bombPart.svg";
import wrongSound from "./wrong.wav";
import slicingSound from "./slicing.mp3";

let w, h;
// game state details (loading, scoring, etc.)
let gameStarted = false;
const LOAD_DELAY = 5000;
let loaded = false;
let score = 0;
const INIT_LIVES = 5;
let lives = INIT_LIVES;

let loadingLabel, scoreLabel, livesLabel;
const SCORE_LOCATION = { x: 10, y: 10 };
const LIVES_LOCATION = { x: 10, y: 30 };
const LOADING_LOCATION = { x: 10, y: 70 };
const LABEL_FILL = "0x3f51b5";

// lines drawn by mouse/touch
let s;
let lines = [];
const LINE_DURATION = 100;
const COLOR = 0x3f51b5;
const THICKNESS = 2;
const ALPHA = 1;

// good and bad objects (i.e. fruits and bombs)
const INIT_NUM_GOOD = 2;
const INIT_NUM_BAD = 1;
const MAX_NUM_OBJECTS = 7;
let goodObjects, badObjects, goodParts, badParts;
const SPAWN_RATE = 0.005;
let enoughObjects = false;
const FIRE_DELAY = 1000;
const FADE_DELAY = 25;
const FADE_AMOUNT = 0.025;

// sounds
let slicing;
let wrong;

let graphics;
let time;
let physics;
let scene;

// launch object upwards from bottom of screen towards middle
function launchObject(obj) {
  if (obj && obj.body) {
    const h = getHeight();
    const w = getWidth();

    obj.body.reset(startX(), startY());
    obj.setScale(0.25);
    const velX = (w / 2 - obj.body.center.x) * 0.5 * Math.random();
    obj.setVelocityX(velX);
    obj.setAngularVelocity(velX * 2);
    obj.setVelocityY(Math.random() * -(0.1 * h) - 0.75 * h);
    obj.setActive(true);
  }
}

// when a line intersects a good object:
// show object parts,
// reset and relaunch the object,
// increase the score
function intersectGoodObject(line, goodObject) {
  slicing.play();
  goodObject.setActive(false);
  addGoodParts(goodObject, 2);
  goodObject.body.reset(startX(), startY());
  time.addEvent({
    delay: FIRE_DELAY,
    callback: () => launchObject(goodObject)
  });
  score++;
  scoreLabel.setText(`Score: ${score}`);
  const fragHighscore = Math.max(score, localStorage.getItem("fragHighscore"));
  localStorage.setItem("fragHighscore", fragHighscore);
  localStorage.setItem("fragScore", score);
}

// when a line intersects a bad object:
// show object parts,
// reset and relaunch the object,
// decrease the lives
function intersectBadObject(line, badObject) {
  slicing.play();
  badObject.setActive(false);
  addBadParts(badObject, 2);
  badObject.body.reset(startX(), startY());
  time.addEvent({
    delay: FIRE_DELAY,
    callback: () => launchObject(badObject)
  });
  loseLives(INIT_LIVES);
}

// generate a pseudorandom x-coordinate
function startX() {
  const w = getWidth();
  return Math.random() * 0.75 * w + 0.125 * w;
}

// generate a starting y-coordinate
function startY() {
  const h = getHeight();
  return h + 200;
}

// add a brand-new good object
function addGoodObject() {
  const goodObject = goodObjects.create(startX(), startY(), "goodObject");
  launchObject(goodObject);
}
// add a brand-new good object
function addBadObject() {
  const badObject = badObjects.create(startX(), startY(), "badObject");
  launchObject(badObject);
}

// given a bad object and the number of parts to add,
// add these bad parts
function addBadParts(badObject, numParts) {
  if (badObject && badObject.body) {
    const x = badObject.body.x;
    const y = badObject.body.y;
    const angle = badObject.angle;
    for (let i = 0; i < numParts; i++) {
      const velX = Math.random() * 400 - 200;
      const velY = Math.random() * 400 - 200;
      const badPart = badParts.create(x, y, "badPart");
      badPart.setScale(0.25);
      badPart.setVelocityX(velX);
      badPart.setVelocityY(velY);
      badPart.setAngularVelocity(velX * 2);
      badPart.angle = angle;
      // destroy this part once it's unneeded
      time.addEvent({
        delay: LOAD_DELAY,
        callback: () => badPart.destroy()
      });
    }
  }
}

// given a good object and the number of parts to add,
// add these good parts
function addGoodParts(goodObject, numParts) {
  if (goodObject && goodObject.body) {
    const x = goodObject.body.x;
    const y = goodObject.body.y;
    const angle = goodObject.angle;
    for (let i = 0; i < numParts; i++) {
      const velX = Math.random() * 40 - 20;
      const velY = Math.random() * 40 - 20;
      const goodPart = goodParts.create(x + velX, y + velY, "goodPart");
      goodPart.setScale(0.25);
      goodPart.setVelocityX(velX);
      goodPart.setVelocityY(velY);
      goodPart.setAngularVelocity(velX * 2);
      goodPart.angle = angle;
      goodPart.alpha = 0.8;
      const repeat = goodPart.alpha / FADE_AMOUNT;
      // fade these parts so they don't clog the screen
      time.addEvent({
        delay: FADE_DELAY,
        callback: () => {
          goodPart.alpha -= FADE_AMOUNT;
        },
        repeat
      });
      // destroy this part once it's unneeded
      time.addEvent({
        delay: LOAD_DELAY,
        callback: () => goodPart.destroy()
      });
    }
  }
}

// decrement lives by the number numLost,
// reset the game once player runs out of lives
function loseLives(numLost) {
  wrong.play();
  lives = Math.max(lives - numLost, 0);
  livesLabel.setText(`Lives remaining: ${lives}`);
  if (lives === 0) {
    nextScene();
  }
}

// relaunch the objects if they fall too far (i.e. bounce them)
function bounceObjects() {
  const h = getHeight();
  goodObjects.children.iterate(function(goodObject) {
    if (goodObject && goodObject.body.center.y > h + 200) {
      goodObject.setActive(false);
      launchObject(goodObject);
    }
  });

  badObjects.children.iterate(function(badObject) {
    if (badObject && badObject.body.center.y > h + 200) {
      badObject.setActive(false);
      launchObject(badObject);
    }
  });
}

// update the actual game components
function updateGame() {
  // occasionally spawn new objects
  if (!enoughObjects) {
    enoughObjects =
      goodObjects.countActive() + badObjects.countActive() > MAX_NUM_OBJECTS;
    if (Math.random() < SPAWN_RATE) {
      if (Math.random() < 0.75) {
        addBadObject();
      } else {
        addGoodObject();
      }
    }
  }

  const h = getHeight();
  goodObjects.children.iterate(function(goodObject) {
    // handle intersections of lines and good objects
    if (goodObject && goodObject.active) {
      for (const line of lines) {
        if (Phaser.Geom.Intersects.LineToRectangle(line, goodObject.body)) {
          intersectGoodObject(line, goodObject);
          break;
        }
      }
    }

    // handle bouncing of good objects
    if (goodObject && goodObject.active && goodObject.body.center.y > h + 200) {
      loseLives(1);
      goodObject.setActive(false);
      time.addEvent({
        delay: FIRE_DELAY,
        callback: () => launchObject(goodObject)
      });
    }
  });

  badObjects.children.iterate(function(badObject) {
    // handle intersections of lines and bad objects
    if (badObject && badObject.active) {
      for (const line of lines) {
        if (Phaser.Geom.Intersects.LineToRectangle(line, badObject.body)) {
          intersectBadObject(line, badObject);
          break;
        }
      }
    }

    // handle bouncing of bad objects
    if (badObject && badObject.active && badObject.body.center.y > h + 200) {
      badObject.setActive(false);
      time.addEvent({
        delay: FIRE_DELAY,
        callback: () => launchObject(badObject)
      });
    }
  });

  // draw lines
  graphics.clear();
  graphics.lineStyle(THICKNESS, COLOR, ALPHA);
  for (const line of lines) {
    graphics.strokeLineShape(line);
  }
}

// move to the next minigame
function nextScene() {
  const fragHighscore = localStorage.getItem("fragHighscore");
  goodObjects.clear(true, true);
  badObjects.clear(true, true);
  enoughObjects = true;
  scoreLabel.setText(`High Score: ${fragHighscore}`);
  loadingLabel.setText(`Game Over! Score: ${score}`);
  // score = 0;
  localStorage.setItem("fragScore", score);
  // after user has absorbed the 'game over' screen,
  // move to the next game
  time.addEvent({
    delay: LOAD_DELAY,
    callback: () => {
      loadingLabel.setText("Continuing to next minigame...");
      time.addEvent({
        delay: LOAD_DELAY,
        callback: () => {
          scene.start("AmpTitle");
        }
      });
    }
  });
}

function getHeight() {
  return parseInt(localStorage.getItem("h"), 10);
}

function getWidth() {
  return parseInt(localStorage.getItem("w"), 10);
}

export default class Fragmentation extends Phaser.Scene {
  constructor() {
    super({ key: "Fragmentation" });
  }

  // preload images
  preload() {
    this.load.image("goodObject", happy);
    this.load.image("badObject", sad);
    this.load.image("goodPart", happyPart);
    this.load.image("badPart", sadPart);
    this.load.audio("slicing", slicingSound);
    this.load.audio("wrong", wrongSound);
  }

  // initialize the game's components
  create() {
    graphics = this.add.graphics();
    time = this.time;
    physics = this.physics;
    scene = this.scene;
    slicing = this.sound.add("slicing");
    wrong = this.sound.add("wrong");

    if (!localStorage.getItem("fragHighscore")) {
      localStorage.setItem("fragHighscore", score);
    }
    if (!localStorage.getItem("fragScore")) {
      localStorage.setItem("fragScore", score);
    }

    // since JavaScript is dynamically typed,
    // we should populate our arrays to save time
    for (let i = 0; i < 10; i++) {
      lines.push(
        new Phaser.Geom.Line(
          LOADING_LOCATION.x,
          LOADING_LOCATION.y,
          LOADING_LOCATION.x,
          LOADING_LOCATION.y
        )
      );
    }
    goodObjects = physics.add.group({
      key: "goodObject",
      repeat: INIT_NUM_GOOD - 1,
      setXY: { x: startX(), y: startY() }
    });
    badObjects = physics.add.group({
      key: "badObject",
      repeat: INIT_NUM_BAD - 1,
      setXY: { x: startX(), y: startY() }
    });
    goodParts = physics.add.group();
    badParts = physics.add.group();

    // launch all the objects (they bounce while the game loads)
    goodObjects.children.iterate(function(goodObject) {
      launchObject(goodObject);
      goodObject.setActive(false);
      goodObject.alpha = 0;
    });
    badObjects.children.iterate(function(badObject) {
      launchObject(badObject);
      badObject.setActive(false);
      badObject.alpha = 0;
    });

    let leftButtonDown = false;

    // when screen is touched/clicked
    this.input.on("pointerdown", function(pointer) {
      if (pointer.leftButtonDown()) {
        leftButtonDown = true;
        s = {
          x: pointer.x,
          y: pointer.y
        };

        // on the first click after the game has loaded,
        // relaunch the objects and clear any old lines
        if (!gameStarted && loaded) {
          loadingLabel.setText("");
          gameStarted = true;
          goodObjects.children.iterate(function(goodObject) {
            launchObject(goodObject);
            goodObject.alpha = 1;
          });
          badObjects.children.iterate(function(badObject) {
            launchObject(badObject);
            badObject.alpha = 1;
          });
          time.addEvent({
            delay: LINE_DURATION, // TODO: shorter delay on faster devices
            callback: () => {
              lines = [];
            }
          });
        }
      }
    });

    this.input.on("pointerup", function() {
      leftButtonDown = false;
      if (gameStarted) {
        lines = [];
      }
    });

    this.input.on("pointermove", function(pointer) {
      if (gameStarted && leftButtonDown) {
        // sx and sy from source point or from end of last line
        let sx = s.x;
        let sy = s.y;
        const len = lines.length;
        if (len) {
          const last = lines[len - 1];
          sx = last.x2;
          sy = last.y2;
        }

        // add new line from last point to current point
        const line = new Phaser.Geom.Line(sx, sy, pointer.x, pointer.y);
        lines.push(line);

        // remove old lines after a given amount of time
        time.addEvent({
          delay: LINE_DURATION,
          callback: () => {
            if (lines.length && Phaser.Geom.Line.Equals(lines[0], line)) {
              lines.shift();
            }
          }
        });
      }

      s = {
        x: pointer.x,
        y: pointer.y
      };

      // before game starts, the initial array of lines should be kept up-to-date
      if (!gameStarted) {
        lines.push(new Phaser.Geom.Line(s.x, s.y, s.x, s.y));
        lines.shift();
      }
    });
    const w = getWidth();
    scoreLabel = this.add.text(
      SCORE_LOCATION.x,
      SCORE_LOCATION.y,
      "Slice green, avoid red!",
      {
        fill: LABEL_FILL,
        wordWrap: { width: w - 20, useAdvancedWrap: true }
      }
    );

    livesLabel = this.add.text(
      LIVES_LOCATION.x,
      LIVES_LOCATION.y,
      `Lives remaining: ${lives}`,
      {
        fill: LABEL_FILL,
        wordWrap: { width: w - 20, useAdvancedWrap: true }
      }
    );

    loadingLabel = this.add.text(
      LOADING_LOCATION.x,
      LOADING_LOCATION.y,
      "Loading...",
      {
        fill: LABEL_FILL,
        wordWrap: { width: w - 20, useAdvancedWrap: true }
      }
    );

    // give the physics engine some time to warm up
    time.addEvent({
      delay: LOAD_DELAY,
      callback: () => {
        loaded = true;
        loadingLabel.setText("Click HERE to start!");
      }
    });
  }

  // update the game's state if the game started,
  // otherwise just let objects bounce in background
  update() {
    if (gameStarted) {
      updateGame();
    } else {
      bounceObjects();
    }
    if (w !== getWidth() || h !== getHeight()) {
      w = getWidth();
      h = getHeight();
      scoreLabel.setWordWrapWidth(w - 20, true);
      livesLabel.setWordWrapWidth(w - 20, true);
      loadingLabel.setWordWrapWidth(w - 20, true);
    }
  }
}
