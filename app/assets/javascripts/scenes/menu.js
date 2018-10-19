var MenuScene = new Phaser.Class({

  Extends: Phaser.Scene,

  initialize:

    function MenuScene() {
      Phaser.Scene.call(this, {
        key: 'MenuScene'
      });
    },
  preload: function () {

    this.load.image('dark-smoke', 'assets/particles/smoke-puff.png');
    this.load.image('white-smoke', 'assets/particles/smoke0.png');
    this.load.image('logo', 'assets/logo.png');
    this.load.image('background', 'assets/menu_background.png');

    this.load.spritesheet('button-audio', 'assets/button-audio.png', {
      frameWidth: 35,
      frameHeight: 35
    });
    this.load.image('button-start', 'assets/button-start.png');

    this.load.bitmapFont('desyrel', 'assets/desyrel.png', 'assets/desyrel.xml');

  },
  create: function () {

    this.add.sprite(600, 400, 'background');

    this.add.sprite(600, 200, 'logo');

    let startButton = this.add.image(600, 500, 'button-start', this.startGame, this, 5, 0, 1);
    let multiplayerButton = this.add.image(600, 600, 'button-start', this.startGame, this, 2, 0, 1);
    let howToButton = this.add.image(600, 700, 'button-start', this.startGame, this, 2, 0, 1);


    //Button Events 
    startButton.once('pointerup', function () {
      this.scene.start('GameScene');
    }, this);

    [startButton, multiplayerButton, howToButton].forEach(btn => {
      btn.setInteractive();
      btn.on('pointerover', function () {

        this.setTint(0xff0000);

      });

      btn.on('pointerout', function () {

        this.setTint();

      });
    })


    var startButtonText = this.add.dynamicBitmapText(550, 480, 'desyrel', 'START!', 32);
    var multiplayerButtonText = this.add.dynamicBitmapText(490, 580, 'desyrel', 'MULTIPLAYER', 32);
    var settingsText = this.add.dynamicBitmapText(525, 680, 'desyrel', 'SETTINGS', 32);

    startButtonText.setDisplayCallback(textCallback);
    multiplayerButtonText.setDisplayCallback(textCallback);
    settingsText.setDisplayCallback(textCallback);

    // this.tweens.add({
    //   targets: text,
    //   duration: 2000,
    //   delay: 2000,
    //   scaleX: 1,
    //   scaleY: 1,
    //   ease: 'Sine.easeInOut',
    //   repeat: -1,
    //   yoyo: true
    // });

    whiteSmoke = this.add.particles('white-smoke').createEmitter({
      x: 400,
      y: 300,
      speed: {
        min: 20,
        max: 100
      },
      angle: {
        min: 0,
        max: 360
      },
      scale: {
        start: 1,
        end: 0
      },
      alpha: {
        start: 0,
        end: 0.1
      },
      lifespan: 2000,
      //active: false
    });
    whiteSmoke.reserve(1000);

    darkSmoke = this.add.particles('dark-smoke').createEmitter({
      x: 400,
      y: 300,
      speed: {
        min: 20,
        max: 100
      },
      angle: {
        min: 0,
        max: 360
      },
      scale: {
        start: 1,
        end: 0
      },
      alpha: {
        start: 0,
        end: 0.1
      },
      blendMode: 'SCREEN',
      lifespan: 2000,
      //active: false

    });
    darkSmoke.reserve(1000);
    darkSmoke.setPosition(700, 750);
    whiteSmoke.setPosition(800, 750);
    darkSmoke.setPosition(100, 750);
    whiteSmoke.setPosition(750, 750);
    darkSmoke.setPosition(200, 750);
    whiteSmoke.setPosition(600, 750);


  },


  update: function () {

  },
  startGame: function () {
    this.game.scene.start("GameScene")
  }

});