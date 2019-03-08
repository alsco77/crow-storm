
import { Component, AfterViewInit, ElementRef, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommunicateService } from '../../services/communicate.service';
import { AppState } from '../../classes/app-state.enum';
import { Subscription } from 'rxjs/Subscription';

declare var webkitAudioContext: any;

export class Ship {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  x: number;
  y: number;
  width = 32;
  height = 32;
}

export class Rocket {
  x;
  y;
  velocity;

  constructor(x, y, velocity) {
    this.x = x;
    this.y = y;
    this.velocity = velocity;
  }
}

export class Bomb {
  x;
  y;
  velocity;

  constructor(x, y, velocity) {
    this.x = x;
    this.y = y;
    this.velocity = velocity;
  }
}

export class Invader {
  x;
  y;
  rank;
  file;
  type;
  width;
  height;

  constructor(x, y, rank, file, type) {
    this.x = x;
    this.y = y;
    this.rank = rank;
    this.file = file;
    this.type = type;
    this.width = 36;
    this.height = 28;
  }
}

export class PlayState {

  config;
  level;
  invaderCurrentVelocity = 10;
  invaderCurrentDropDistance = 0;
  invadersAreDropping = false;
  lastRocketTime = null;

  //  Game entities.
  ship = null;
  invaders = [];
  rockets = [];
  bombs = [];

  shipSpeed;
  invaderInitialVelocity;
  bombRate;
  bombMinVelocity;
  bombMaxVelocity;
  invaderVelocity;
  invaderNextVelocity;

  constructor(config, level) {
    this.config = config;
    this.level = level;
  }

  enter(game) {

    //  Create the ship.
    this.ship = new Ship(game.width / 2, game.gameBounds.bottom);

    //  Setup initial state.
    this.invaderCurrentVelocity = 10;
    this.invaderCurrentDropDistance = 0;
    this.invadersAreDropping = false;

    //  Set the ship speed for this level, as well as invader params.
    var levelMultiplier = this.level * this.config.levelDifficultyMultiplier;
    this.shipSpeed = this.config.shipSpeed;
    this.invaderInitialVelocity = this.config.invaderInitialVelocity + (levelMultiplier * this.config.invaderInitialVelocity);
    this.bombRate = this.config.bombRate + (levelMultiplier * this.config.bombRate);
    this.bombMinVelocity = this.config.bombMinVelocity + (levelMultiplier * this.config.bombMinVelocity);
    this.bombMaxVelocity = this.config.bombMaxVelocity + (levelMultiplier * this.config.bombMaxVelocity);

    //  Create the invaders.
    var ranks = this.config.invaderRanks;
    var files = this.config.invaderFiles;
    var invaders = [];
    for (var rank = 0; rank < ranks; rank++) {
      for (var file = 0; file < files; file++) {
        invaders.push(new Invader(
          (game.width / 2) + ((files / 2 - file) * 300 / files),
          (game.gameBounds.top + rank * 30),
          rank, file, 'Invader'));
      }
    }
    this.invaders = invaders;
    this.invaderCurrentVelocity = this.invaderInitialVelocity;
    this.invaderVelocity = { x: -this.invaderInitialVelocity, y: 0 };
    this.invaderNextVelocity = null;
  };

  update(game, dt) {

    //  If the left or right arrow keys are pressed, move
    //  the ship. Check this on ticks rather than via a keydown
    //  event for smooth movement, otherwise the ship would move
    //  more like a text editor caret.
    if (game.pressedKeys[37]) {
      this.ship.x -= this.shipSpeed * dt;
    }
    if (game.pressedKeys[39]) {
      this.ship.x += this.shipSpeed * dt;
    }
    if (game.pressedKeys[32]) {
      this.fireRocket(game);
    }

    //  Keep the ship in bounds.
    if (this.ship.x < game.gameBounds.left) {
      this.ship.x = game.gameBounds.left;
    }
    if (this.ship.x > game.gameBounds.right) {
      this.ship.x = game.gameBounds.right;
    }

    //  Move each bomb.
    for (var i = 0; i < this.bombs.length; i++) {
      var bomb = this.bombs[i];
      bomb.y += dt * bomb.velocity;

      //  If the rocket has gone off the screen remove it.
      if (bomb.y > game.height) {
        this.bombs.splice(i--, 1);
      }
    }

    //  Move each rocket.
    for (i = 0; i < this.rockets.length; i++) {
      var rocket = this.rockets[i];
      rocket.y -= dt * rocket.velocity;

      //  If the rocket has gone off the screen remove it.
      if (rocket.y < 0) {
        this.rockets.splice(i--, 1);
      }
    }

    //  Move the invaders.
    var hitLeft = false, hitRight = false, hitBottom = false;
    for (i = 0; i < this.invaders.length; i++) {
      var invader = this.invaders[i];
      var newx = invader.x + this.invaderVelocity.x * dt;
      var newy = invader.y + this.invaderVelocity.y * dt;
      if (hitLeft == false && newx < game.gameBounds.left) {
        hitLeft = true;
      }
      else if (hitRight == false && newx > game.gameBounds.right) {
        hitRight = true;
      }
      else if (hitBottom == false && newy > game.gameBounds.bottom) {
        hitBottom = true;
      }

      if (!hitLeft && !hitRight && !hitBottom) {
        invader.x = newx;
        invader.y = newy;
      }
    }

    //  Update invader velocities.
    if (this.invadersAreDropping) {
      this.invaderCurrentDropDistance += this.invaderVelocity.y * dt;
      if (this.invaderCurrentDropDistance >= this.config.invaderDropDistance) {
        this.invadersAreDropping = false;
        this.invaderVelocity = this.invaderNextVelocity;
        this.invaderCurrentDropDistance = 0;
      }
    }
    //  If we've hit the left, move down then right.
    if (hitLeft) {
      this.invaderCurrentVelocity += this.config.invaderAcceleration;
      this.invaderVelocity = { x: 0, y: this.invaderCurrentVelocity };
      this.invadersAreDropping = true;
      this.invaderNextVelocity = { x: this.invaderCurrentVelocity, y: 0 };
    }
    //  If we've hit the right, move down then left.
    if (hitRight) {
      this.invaderCurrentVelocity += this.config.invaderAcceleration;
      this.invaderVelocity = { x: 0, y: this.invaderCurrentVelocity };
      this.invadersAreDropping = true;
      this.invaderNextVelocity = { x: -this.invaderCurrentVelocity, y: 0 };
    }
    //  If we've hit the bottom, it's game over.
    if (hitBottom) {
      game.lives = 0;
    }

    //  Check for rocket/invader collisions.
    for (i = 0; i < this.invaders.length; i++) {
      var invader = this.invaders[i];
      var bang = false;

      for (var j = 0; j < this.rockets.length; j++) {
        var rocket = this.rockets[j];

        if (rocket.x >= (invader.x - invader.width / 2) && rocket.x <= (invader.x + invader.width / 2) &&
          rocket.y >= (invader.y - invader.height / 2) && rocket.y <= (invader.y + invader.height / 2)) {

          //  Remove the rocket, set 'bang' so we don't process
          //  this rocket again.
          this.rockets.splice(j--, 1);
          bang = true;
          game.score += (this.config.pointsPerInvader + (this.level - 1));
          game.crowsKilled += 1;
          break;
        }
      }
      if (bang) {
        this.invaders.splice(i--, 1);
        game.sounds.playSound('crow');
      }
    }

    //  Find all of the front rank invaders.
    var frontRankInvaders = {};
    for (var i = 0; i < this.invaders.length; i++) {
      var invader = this.invaders[i];
      //  If we have no invader for game file, or the invader
      //  for game file is futher behind, set the front
      //  rank invader to game one.
      if (!frontRankInvaders[invader.file] || frontRankInvaders[invader.file].rank < invader.rank) {
        frontRankInvaders[invader.file] = invader;
      }
    }

    //  Give each front rank invader a chance to drop a bomb.
    for (var i = 0; i < this.config.invaderFiles; i++) {
      var invader = frontRankInvaders[i];
      if (!invader) continue;
      var chance = this.bombRate * dt;
      if (chance > Math.random()) {
        //  Fire!
        this.bombs.push(new Bomb(invader.x, invader.y + invader.height / 2,
          this.bombMinVelocity + Math.random() * (this.bombMaxVelocity - this.bombMinVelocity)));
      }
    }

    //  Check for bomb/ship collisions.
    for (var i = 0; i < this.bombs.length; i++) {
      var bomb = this.bombs[i];
      if (bomb.x >= (this.ship.x - this.ship.width / 2) && bomb.x <= (this.ship.x + this.ship.width / 2) &&
        bomb.y >= (this.ship.y - this.ship.height / 2) && bomb.y <= (this.ship.y + this.ship.height / 2)) {
        this.bombs.splice(i--, 1);
        game.lives--;
        game.sounds.playSound('hit');
      }

    }

    //  Check for invader/ship collisions.
    for (var i = 0; i < this.invaders.length; i++) {
      var invader = this.invaders[i];
      if ((invader.x + invader.width / 2) > (this.ship.x - this.ship.width / 2) &&
        (invader.x - invader.width / 2) < (this.ship.x + this.ship.width / 2) &&
        (invader.y + invader.height / 2) > (this.ship.y - this.ship.height / 2) &&
        (invader.y - invader.height / 2) < (this.ship.y + this.ship.height / 2)) {
        //  Dead by collision!
        game.lives = 0;
        game.sounds.playSound('hit');
      }
    }

    //  Check for failure
    if (game.lives <= 0) {
      game.moveToState(new GameOverState());
    }

    //  Check for victory
    if (this.invaders.length === 0) {
      game.score += this.level * 100;
      game.level += 1;
      game.moveToState(new LevelIntroState(game.level));
    }
  };

  draw(game, dt, ctx) {

    //  Clear the background.
    ctx.clearRect(0, 0, game.width, game.height);

    //  Draw ship.
    var shooterImg = new Image();
    shooterImg.src = "assets/shooter.png";
    ctx.drawImage(shooterImg, this.ship.x - (this.ship.width / 2), this.ship.y - (this.ship.height / 2), this.ship.width, this.ship.height);


    //  Draw invaders.
    var crowImg = new Image();
    crowImg.src = "assets/crow.png";
    // ctx.fillStyle = '#006600';
    for (var i = 0; i < this.invaders.length; i++) {
      var invader = this.invaders[i];
      ctx.drawImage(crowImg, invader.x - invader.width / 2, invader.y - invader.height / 2, invader.width, invader.height);
    }

    // Draw bombs
    var eggImg = new Image();
    eggImg.src = "assets/egg-min.png";
    for (var i = 0; i < this.bombs.length; i++) {
      var bomb = this.bombs[i];
      ctx.drawImage(eggImg, bomb.x - 2, bomb.y - 2, 8, 8);
    }


    //  Draw rockets.
    var bulletImg = new Image();
    bulletImg.src = "assets/bullet.png";
    for (var i = 0; i < this.rockets.length; i++) {
      var rocket = this.rockets[i];
      ctx.drawImage(bulletImg, rocket.x, rocket.y - 2, 3, 12);
    }

    //  Draw info.
    var textYpos = game.gameBounds.bottom + ((game.height - game.gameBounds.bottom) / 2) + 14 / 2;
    var livesYpos = game.gameBounds.top - 10;
    ctx.font = "14px 'Andale Mono', Consolas, 'Courier New'";
    ctx.fillStyle = '#0a0a0a';

    var info = "Lives: ";
    ctx.textAlign = "left";
    ctx.fillText(info, game.gameBounds.right - 40 - (game.lives * 25), 22);
    for (var i = 0; i < game.lives; i++) {
      ctx.drawImage(shooterImg, game.gameBounds.right - (i * 25), 10, 25, 25);
    }

    info = "Score: " + game.score + ", Horde #: " + game.level;
    ctx.textAlign = "right";
    ctx.fillText(info, (game.width / 2) + 90, 22);

    //  If we're in debug mode, draw bounds.
    if (this.config.debugMode) {
      ctx.strokeStyle = '#ff0000';
      ctx.strokeRect(0, 0, game.width, game.height);
      ctx.strokeRect(game.gameBounds.left, game.gameBounds.top,
        game.gameBounds.right - game.gameBounds.left,
        game.gameBounds.bottom - game.gameBounds.top);
    }

  };

  keyDown(game, keyCode) {

    if (keyCode == 32) {
      //  Fire!
      this.fireRocket(game);
    }
    if (keyCode == 80) {
      //  Push the pause state.
      game.pushState(new PauseState());
    }
  };

  keyUp(game, keyCode) {

  };

  fireRocket(game) {
    //  If we have no last rocket time, or the last rocket time 
    //  is older than the max rocket rate, we can fire.
    if (this.lastRocketTime === null || ((new Date()).valueOf() - this.lastRocketTime) > (1000 / this.config.rocketMaxFireRate)) {
      //  Add a rocket.
      this.rockets.push(new Rocket(this.ship.x, this.ship.y - 12, this.config.rocketVelocity));
      this.lastRocketTime = (new Date()).valueOf();

      //  Play the 'shoot' sound.
      game.sounds.playSound('shoot');
    }
  };
}

export class WelcomeState {

  constructor() { }

  enter(game) {
  }
  update(game, dt) { };

  draw(game, dt, ctx) {


    ctx.font = "30px 'Andale Mono', Consolas, 'Courier New'";
    ctx.fillStyle = '#0a0a0a';
    ctx.textBaseline = "center";
    ctx.textAlign = "center";
    ctx.fillText("Crow Invaders", game.width / 2, game.height / 2 - 40);
    ctx.font = "16px 'Andale Mono', Consolas, 'Courier New'";

    ctx.fillText("Move with arrow keys, fire with the space bar.", game.width / 2, game.height / 2)
    ctx.fillText("The crows get faster and drop more eggs as you clear each horde!", game.width / 2, game.height / 2 + 25);


    ctx.fillText("Press 'Space' to start.", game.width / 2, game.height / 2 + 80);
  }
  keyDown(game, keyCode) {
    if (keyCode == 32) /*space*/ {
      //  Space starts the game.
      game.level = 1;
      game.score = 0;
      game.lives = 3;
      game.moveToState(new LevelIntroState(game.level));
    }
  };
}

export class LevelIntroState {

  level;
  countdownMessage = "3";
  countdown = undefined;

  constructor(level) {
    this.level = level;
  }

  update(game, dt) {

    //  Update the countdown.
    if (this.countdown === undefined) {
      this.countdown = 3; // countdown from 3 secs
    }
    this.countdown -= dt;

    if (this.countdown < 2) {
      this.countdownMessage = "2";
    }
    if (this.countdown < 1) {
      this.countdownMessage = "1";
    }
    if (this.countdown <= 0) {
      //  Move to the next level, popping this state.
      game.moveToState(new PlayState(game.config, this.level));
    }
  }
  draw(game, dt, ctx) {

    //  Clear the background.
    ctx.clearRect(0, 0, game.width, game.height);

    ctx.font = "32px 'Andale Mono', Consolas, 'Courier New'";
    ctx.fillStyle = '#0a0a0a';
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText("Horde " + this.level, game.width / 2, game.height / 2 - 36);
    ctx.font = "24px 'Andale Mono', Consolas, 'Courier New'";
    ctx.fillText("Coming in " + this.countdownMessage, game.width / 2, game.height / 2);
    return;
  };
}

export class GameOverState {

  constructor() { }

  update(game, dt) {
  };

  draw(game, dt, ctx) {
    //  Clear the background.
    ctx.clearRect(0, 0, game.width, game.height);

    ctx.font = "30px 'Andale Mono', Consolas, 'Courier New'";
    ctx.fillStyle = '#0a0a0a';
    ctx.textBaseline = "center";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", game.width / 2, game.height / 2 - 40);
    ctx.font = "16px 'Andale Mono', Consolas, 'Courier New'";
    ctx.fillText("You took care of " + game.crowsKilled + " crows and earned " + game.score + " Crow Coins", game.width / 2, game.height / 2);
    ctx.font = "16px 'Andale Mono', Consolas, 'Courier New'";
    ctx.fillText("Press 'Space' to return to the command centre.", game.width / 2, game.height / 2 + 40);
  };

  keyDown(game, keyCode) {
    if (keyCode == 32) /*space*/ {
      //  Space restarts the game.
      game.finishGame();
    }
  };
}

export class PauseState {

  constructor() { }

  keyDown(game, keyCode) {

    if (keyCode == 80) {
      //  Pop the pause state.
      game.popState();
    }
  };

  draw(game, dt, ctx) {

    //  Clear the background.
    ctx.clearRect(0, 0, game.width, game.height);

    ctx.font = "14px 'Andale Mono', Consolas, 'Courier New'";
    ctx.fillStyle = '#0a0a0a';
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText("Paused", game.width / 2, game.height / 2);
    return;
  };
}

export class Sounds {

  //  The audio context.
  audioContext = null;
  //  The actual set of loaded sounds.
  sounds;
  mute;

  constructor() {
    this.mute = false;
    this.sounds = {};
  }

  init() {

    //  Create the audio context, paying attention to webkit browsers.
    var context = AudioContext || webkitAudioContext;
    this.audioContext = new context();
  };

  loadSound(name, url) {

    //  Reference to ourselves for closures.
    var self = this;

    //  Create an entry in the sounds object.
    this.sounds[name] = null;

    //  Create an asynchronous request for the sound.
    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.responseType = 'arraybuffer';
    req.onload = function () {
      self.audioContext.decodeAudioData(req.response, function (buffer) {
        self.sounds[name] = { buffer: buffer };
      });
    };
    try {
      req.send();
    } catch (e) {
      console.log("An exception occured getting sound the sound " + name + " this might be " +
        "because the page is running from the file system, not a webserver.");
      console.log(e);
    }
  };

  playSound(name) {

    //  If we've not got the sound, don't bother playing it.
    if (this.sounds[name] === undefined || this.sounds[name] === null || this.mute === true) {
      return;
    }

    //  Create a sound source, set the buffer, connect to the speakers and
    //  play the sound.
    var source = this.audioContext.createBufferSource();
    source.buffer = this.sounds[name].buffer;
    source.connect(this.audioContext.destination);
    source.start(0);
  };
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements AfterViewInit, OnDestroy {


  instructions: "Move with arrow keys, fire with the space bar. The invaders get faster and drop more bombs as you complete each level!";

  @ViewChild('gameCanvas') canvas: ElementRef;
  @ViewChild('backgroundCanvas') backgroundCanvas: ElementRef;

  @Output()
  finalScore: EventEmitter<number> = new EventEmitter<number>();

  //  Set the initial config.
  config = {
    bombRate: 0.15,
    bombMinVelocity: 50,
    bombMaxVelocity: 50,
    invaderInitialVelocity: 50,
    invaderAcceleration: 0,
    invaderDropDistance: 20,
    rocketVelocity: 160,
    rocketMaxFireRate: 4,
    gameWidth: 600,
    gameHeight: 500,
    fps: 50,
    debugMode: false,
    invaderRanks: 5,
    invaderFiles: 10,
    shipSpeed: 160,
    levelDifficultyMultiplier: 0.4,
    pointsPerInvader: 10
  };

  //  All state is in the variables below.
  lives = 3;
  width = 0;
  height = 0;
  gameBounds = { left: 0, top: 0, right: 0, bottom: 0 };
  intervalId;
  score = 0;
  crowsKilled = 0;
  level = 1;

  //  The state stack.
  stateStack = [];

  //  Input/output
  pressedKeys = {};
  gameCanvas = null;

  //  All sounds.
  sounds: Sounds;
  loaded = false;

  stateSubscription: Subscription;

  constructor(private comService: CommunicateService) {
    this.stateSubscription = this.comService.appState$.subscribe((state: AppState) => {
      if (state != AppState.game) {
        this.moveToState(new GameOverState());
      }
    })
  }

  ngAfterViewInit() {
    this.startGame();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

    window.removeEventListener("keydown", (e) => {})
    this.stateSubscription.unsubscribe();
  }

  startGame() {

    this.canvas.nativeElement.width = 700;
    this.canvas.nativeElement.height = 600;


    setTimeout(() => {
      this.sounds = new Sounds();
      this.sounds.init();
      this.sounds.loadSound('shoot', '/assets/sounds/pistol.wav');
      this.sounds.loadSound('bang', '/assets/sounds/bang.wav');
      this.sounds.loadSound('crow', '/assets/sounds/crow.wav');
      this.sounds.loadSound('hit', '/assets/sounds/hurt.wav');
    }, 0);

    // this.backgroundCanvas.nativeElement.width = 700;
    // this.backgroundCanvas.nativeElement.height = 600;
    // var ctx = this.backgroundCanvas.nativeElement.getContext("2d");
    // //  Clear the background.
    // ctx.clearRect(0, 0, 700, 600);
    // var bgImg = new Image();
    // bgImg.src = "assets/backdropTransparent.png";
    // ctx.drawImage(bgImg, 0, 0, 700, 600);

    //  Create the game.
    // var game = new Game();

    //  Initialise it with the game canvas.
    this.initialise(this.canvas.nativeElement);

    //  Start the game.
    this.start();

    //  Listen for keyboard events.
    window.addEventListener("keydown", (e) => {
      var keycode = e.keyCode;
      //  Supress further processing of left/right/space (37/29/32)
      if (keycode == 37 || keycode == 39 || keycode == 32) {
        // e.preventDefault();
      }
      this.keyDown(keycode);
    });

    window.addEventListener("keyup", (e) => {
      var keycode = e.keyCode;
      this.keyUp(keycode);
    });
  }


  toggleMute() {
    this.mute();
  };

  initialise(gameCanvas) {

    //  Set the game canvas.
    this.gameCanvas = gameCanvas;



    //  Set the game width and height.
    this.width = gameCanvas.width;
    this.height = gameCanvas.height;



    //  Set the state game bounds.
    this.gameBounds = {
      left: gameCanvas.width / 2 - this.config.gameWidth / 2,
      right: gameCanvas.width / 2 + this.config.gameWidth / 2,
      top: gameCanvas.height / 2 - this.config.gameHeight / 2,
      bottom: gameCanvas.height / 2 + this.config.gameHeight / 2,
    };
  };


  moveToState(state) {

    //  If we are in a state, leave it.
    if (this.currentState() && this.currentState().leave) {
      this.currentState().leave(this);
      this.stateStack.pop();
    }

    //  If there's an enter function for the new state, call it.
    if (state.enter) {
      state.enter(this);
    }

    //  Set the current state.
    this.stateStack.pop();
    this.stateStack.push(state);
  };

  finishGame() {
    this.finalScore.emit(this.score);
  }

  //  Start the Game.
  start() {

    //  Move into the 'welcome' state.
    this.moveToState(new WelcomeState());

    //  Set the game variables.
    this.lives = 3;
    this.config.debugMode = /debug=true/.test(window.location.href);

    //  Start the game loop.
    this.intervalId = setInterval(() => {
      this.gameLoop();
    }, 1000 / this.config.fps);
    setTimeout(() => {
      this.loaded = true;
    }, 0);
  };

  //  Returns the current state.
  currentState() {
    return this.stateStack.length > 0 ? this.stateStack[this.stateStack.length - 1] : null;
  };

  //  Mutes or unmutes the game.
  mute(mute = null) {

    //  If we've been told to mute, mute.
    if (mute === true) {
      this.sounds.mute = true;
    } else if (mute === false) {
      this.sounds.mute = false;
    } else {
      // Toggle mute instead...
      this.sounds.mute = this.sounds.mute ? false : true;
    }
  };

  //  The main loop.
  gameLoop() {
    var currentState = this.currentState();
    if (currentState) {

      //  Delta t is the time to update/draw.
      var dt = 1 / this.config.fps;

      //  Get the drawing context.
      var ctx = this.gameCanvas.getContext("2d");

      //  Update if we have an update function. Also draw
      //  if we have a draw function.
      if (currentState.update) {
        currentState.update(this, dt);
      }
      if (currentState.draw) {
        currentState.draw(this, dt, ctx);
      }
    }
  }

  pushState(state) {

    //  If there's an enter function for the new state, call it.
    if (state.enter) {
      state.enter(this);
    }
    //  Set the current state.
    this.stateStack.push(state);
  };

  popState() {

    //  Leave and pop the state.
    if (this.currentState()) {
      if (this.currentState().leave) {
        this.currentState().leave(this);
      }

      //  Set the current state.
      this.stateStack.pop();
    }
  };

  //  The stop function stops the game.
  stop() {
    clearInterval(this.intervalId);
  };

  //  Inform the game a key is down.
  keyDown(keyCode) {
    this.pressedKeys[keyCode] = true;
    //  Delegate to the current state too.
    if (this.currentState() && this.currentState().keyDown) {
      this.currentState().keyDown(this, keyCode);
    }
  };

  //  Inform the game a key is up.
  keyUp(keyCode) {
    delete this.pressedKeys[keyCode];
    //  Delegate to the current state too.
    if (this.currentState() && this.currentState().keyUp) {
      this.currentState().keyUp(this, keyCode);
    }
  };
}