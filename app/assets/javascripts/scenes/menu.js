let MenuScene = new Phaser.Class({

  Extends: Phaser.Scene,

  initialize:

    function MenuScene() {
      Phaser.Scene.call(this, {
        key: 'MenuScene'
      });
    },
  preload: function () {

    this.load.image('dark-smoke', gameAssets.smokepuffParticle);
    this.load.image('white-smoke', gameAssets.smokeParticle);
    this.load.image('main-logo', gameAssets.mainLogo);
    this.load.image('background', gameAssets.menuBackground);

    this.load.image('button-start', gameAssets.buttonStart);

    this.load.bitmapFont('desyrel', gameAssets.desyrel, gameAssets.desyrelXml);

  },
  create: function () {

    this.add.sprite(600, 400, 'background');

    this.add.sprite(600, 200, 'main-logo');

    let startButton = this.add.image(600, 500, 'button-start');
    let multiplayerButton = this.add.image(600, 600, 'button-start');
    let howToButton = this.add.image(600, 700, 'button-start');


    //Button Events 
    startButton.once('pointerup', function () {
      this.scene.start('GameScene');
    }, this);
    howToButton.once('pointerup', function () {
      this.scene.start('HowToScene');
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


    let startButtonText = this.add.dynamicBitmapText(550, 480, 'desyrel', 'START!', 32);
    let multiplayerButtonText = this.add.dynamicBitmapText(490, 580, 'desyrel', 'MULTIPLAYER', 32);
    let howToText = this.add.dynamicBitmapText(525, 680, 'desyrel', 'How To', 32);

    startButtonText.setDisplayCallback(textCallback);
    multiplayerButtonText.setDisplayCallback(textCallback);
    howToText.setDisplayCallback(textCallback);

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

    let whiteSmoke = this.add.particles('white-smoke').createEmitter({
      x: 400,
      y: 300,
      speed: {
        min: 10,
        max: 200
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

    let darkSmoke = this.add.particles('dark-smoke').createEmitter({
      x: 400,
      y: 300,
      speed: {
        min: 10,
        max: 200
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
        end: 0.3
      },
      blendMode: 'SCREEN',
      lifespan: 2000,
      //active: false

    });

    darkSmoke.reserve(1000);
    darkSmoke.setPosition(150, 875);

    whiteSmoke.setPosition(1000, 875);

    let whiteSmoke2 = this.add.particles('white-smoke').createEmitter({
      x: 400,
      y: 300,
      speed: {
        min: 10,
        max: 200
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
    whiteSmoke2.reserve(1000);

    let darkSmoke2 = this.add.particles('dark-smoke').createEmitter({
      x: 400,
      y: 300,
      speed: {
        min: 10,
        max: 200
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
        end: 0.3
      },
      blendMode: 'SCREEN',
      lifespan: 2000,
      //active: false

    });

    darkSmoke2.reserve(1000);
    darkSmoke2.setPosition(150, 5);

    whiteSmoke2.setPosition(1000, 5);
    



  },


  update: function () {

  },
  startGame: function () {
    this.game.scene.start("GameScene")
  },
  goToHowTo: function () {
    this.game.scene.start("HowToScene")
}

});