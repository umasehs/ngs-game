import React, { Component } from "react";
import Phaser from "phaser";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import happy from "./happy.svg";
import sad from "./sad.svg";
import happyPart from "./happyPart.svg";
import sadPart from "./sadPart.svg";

const styles = () => ({
  root: {
    height: "90%"
  }
});

class PhaserContainer extends Component {
  constructor(props) {
    super(props);
    this.divElement = React.createRef();
    this.state = { game: null };
  }

  componentWillUnmount() {
    this.state.game.destroy(true);
  }

  componentDidMount() {
    const w = this.divElement.current.clientWidth;
    const h = this.divElement.current.clientHeight;
    // The game will be configured with these settings:
    const config = {
      type: Phaser.AUTO,
      width: w,
      height: h,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: h / 3 },
          debug: false
        }
      },
      scene: {
        preload,
        create,
        update
      },
      parent: "phaser-container"
    };

    this.setState({ game: new Phaser.Game(config) });

    // game state details (loading, scoring, etc.)
    let gameStarted = false;
    const LOAD_TIME = 5000;
    let loaded = false;
    let score = 0;
    const INIT_LIVES = 3;
    let lives = INIT_LIVES;
    let loadingLabel, scoreLabel, livesLabel;
    const SCORE_LOCATION = { x: 10, y: 10 };
    const LIVES_LOCATION = { x: 10, y: 30 };
    const LOADING_LOCATION = { x: 100, y: 70 };
    const LABEL_FILL = "white";

    // lines drawn by mouse/touch
    let s;
    let lines = [];
    const LINE_DURATION = 100;
    const COLOR = 0xffff00;
    const THICKNESS = 2;
    const ALPHA = 1;

    // good and bad objects (i.e. fruits and bombs)
    const INIT_NUM_GOOD = 3;
    const INIT_NUM_BAD = 2;
    const MAX_NUM_OBJECTS = 10;
    let goodObjects, badObjects, goodParts, badParts;
    const SPAWN_RATE = 0.005;
    let enoughObjects = false;
    const FIRE_RATE = 1000;

    let graphics;
    let time;
    let physics;

    // preload images
    function preload() {
      this.load.image("goodObject", happy);
      this.load.image("badObject", sad);
      this.load.image("goodPart", happyPart);
      this.load.image("badPart", sadPart);
    }

    // initialize the game's components
    function create() {
      graphics = this.add.graphics();
      time = this.time;
      physics = this.physics;

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
      });
      badObjects.children.iterate(function(badObject) {
        launchObject(badObject);
        badObject.setActive(false);
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
            });
            badObjects.children.iterate(function(badObject) {
              launchObject(badObject);
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

      scoreLabel = this.add.text(
        SCORE_LOCATION.x,
        SCORE_LOCATION.y,
        "Tip: Get the happy ones!"
      );
      scoreLabel.setFill(LABEL_FILL);

      livesLabel = this.add.text(
        LIVES_LOCATION.x,
        LIVES_LOCATION.y,
        `Lives remaining: ${lives}`
      );
      livesLabel.setFill(LABEL_FILL);

      loadingLabel = this.add.text(
        LOADING_LOCATION.x,
        LOADING_LOCATION.y,
        "Loading..."
      );
      loadingLabel.setFill(LABEL_FILL);

      // give the physics engine some time to warm up
      time.addEvent({
        delay: LOAD_TIME,
        callback: () => {
          loaded = true;
          loadingLabel.setText("Click HERE to start!");
        }
      });
    }

    // launch object upwards from bottom of screen towards middle
    function launchObject(obj) {
      if (obj && obj.body) {
        obj.body.reset(startX(), startY());
        const velX = (w / 2 - obj.body.center.x) * 0.5 * Math.random();
        obj.setVelocityX(velX);
        obj.setAngularVelocity(velX * 2);
        obj.setVelocityY(Math.random() * -(0.1 * h) - 0.7 * h);
        obj.setActive(true);
      }
    }

    // when a line intersects a good object:
    // show object parts,
    // reset and relaunch the object,
    // increase the score
    function intersectGoodObject(line, goodObject) {
      goodObject.setActive(false);
      addGoodParts(goodObject, Math.floor(Math.random() * 2) + 2); // 2 to 4
      goodObject.body.reset(startX(), startY());
      time.addEvent({
        delay: FIRE_RATE,
        callback: () => launchObject(goodObject)
      });
      score++;
      scoreLabel.setText(`Score: ${score}`);
    }

    // when a line intersects a bad object:
    // show object parts,
    // reset and relaunch the object,
    // decrease the lives
    function intersectBadObject(line, badObject) {
      badObject.setActive(false);
      addBadParts(badObject, Math.floor(Math.random() * 4) + 6); // 6 to 10;
      badObject.body.reset(startX(), startY());
      time.addEvent({
        delay: FIRE_RATE,
        callback: () => launchObject(badObject)
      });
      loseLives(INIT_LIVES);
    }

    // generate a pseudorandom x-coordinate
    function startX() {
      return Math.random() * 0.75 * w + 0.1 * w;
    }

    // generate a starting y-coordinate
    function startY() {
      return h + 100;
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
        for (let i = 0; i < numParts; i++) {
          const velX = Math.random() * 400 - 200;
          const velY = Math.random() * 400 - 200;
          const badPart = badParts.create(x, y, "badPart");
          badPart.setVelocityX(velX);
          badPart.setVelocityY(velY);
          badPart.setAngularVelocity(velX * 2);

          // destroy this part once it's unneeded
          time.addEvent({
            delay: LOAD_TIME,
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
        for (let i = 0; i < numParts; i++) {
          const velX = Math.random() * 40 - 20;
          const velY = Math.random() * 40 - 20;
          const goodPart = goodParts.create(x + velX, y + velY, "goodPart");
          goodPart.setVelocityX(velX);
          goodPart.setVelocityY(velY);
          goodPart.setAngularVelocity(velX * 2);

          // destroy this part once it's unneeded
          time.addEvent({
            delay: LOAD_TIME,
            callback: () => goodPart.destroy()
          });
        }
      }
    }

    // decrement lives by the number numLost,
    // reset the game once player runs out of lives
    function loseLives(numLost) {
      lives = Math.max(lives - numLost, 0);
      livesLabel.setText(`Lives remaining: ${lives}`);
      if (lives === 0) {
        resetGame();
      }
    }

    // update the game's state if the game started,
    // otherwise just let objects bounce in background
    function update() {
      if (gameStarted) {
        updateGame();
      } else {
        bounceObjects();
      }
    }

    // relaunch the objects if they fall too far (i.e. bounce them)
    function bounceObjects() {
      goodObjects.children.iterate(function(goodObject) {
        if (goodObject && goodObject.body.center.y > h + 100) {
          goodObject.setActive(false);
          launchObject(goodObject);
        }
      });

      badObjects.children.iterate(function(badObject) {
        if (badObject && badObject.body.center.y > h + 100) {
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
          goodObjects.countActive() + badObjects.countActive() >
          MAX_NUM_OBJECTS;
        if (Math.random() < SPAWN_RATE) {
          if (Math.random() < 0.75) {
            addBadObject();
          } else {
            addGoodObject();
          }
        }
      }

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
        if (
          goodObject &&
          goodObject.active &&
          goodObject.body.center.y > h + 100
        ) {
          loseLives(1);
          goodObject.setActive(false);
          time.addEvent({
            delay: FIRE_RATE,
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
        if (
          badObject &&
          badObject.active &&
          badObject.body.center.y > h + 100
        ) {
          badObject.setActive(false);
          time.addEvent({
            delay: FIRE_RATE,
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

    // reset the game state when the player loses
    function resetGame() {
      var highscore = Math.max(score, localStorage.getItem("highscore"));
      localStorage.setItem("highscore", highscore);
      goodObjects.clear(true, true);
      badObjects.clear(true, true);
      enoughObjects = true;
      scoreLabel.setText(`High Score: ${highscore}`);
      loadingLabel.setText(`Game Over! Score: ${score}`);
      score = 0;

      // after user has absorbed the 'game over' screen,
      // restart the game
      time.addEvent({
        delay: FIRE_RATE * 2,
        callback: () => {
          lives = INIT_LIVES;
          livesLabel.setText(`Lives remaining: ${lives}`);
          for (let i = 0; i < INIT_NUM_GOOD; i++) {
            addGoodObject();
          }
          for (let i = 0; i < INIT_NUM_BAD; i++) {
            addBadObject();
          }
          enoughObjects = false;
          loadingLabel.setText("");
        }
      });
    }
  }

  // Phaser game rendered within HTML div
  render() {
    return (
      <div
        className={this.props.classes.root}
        id="phaser-container"
        ref={this.divElement}
      />
    );
  }
}

PhaserContainer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PhaserContainer);
