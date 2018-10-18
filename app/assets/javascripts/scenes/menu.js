var MenuScene = new Phaser.Class({

  Extends: Phaser.Scene,

  initialize:

    function MenuScene() {
      Phaser.Scene.call(this, {
        key: 'MenuScene'
      });
    },
  preload: function () {

    this.load.image('logo', 'assets/logo.png');
    this.load.image('background', 'assets/menu_background.png');

    this.load.spritesheet('button-audio', 'assets/button-audio.png', {
      frameWidth: 35,
      frameHeight: 35
    });
    this.load.image('button-start', 'assets/button-start.png', {
      frameWidth: 600,
      frameHeight: 200
    });

    this.load.bitmapFont('desyrel', 'assets/desyrel.png', 'assets/desyrel.xml');

  },
  create: function () {

    this.add.sprite(600, 400, 'background');

    this.add.sprite(600, 200, 'logo');

    let startButton = this.add.image(600, 500, 'button-start', this.startGame, this, 2, 0, 1);
    let multiplayerButton = this.add.image(600, 600, 'button-start', this.startGame, this, 2, 0, 1);
    let howToButton = this.add.image(600, 700, 'button-start', this.startGame, this, 2, 0, 1);

    startButton.setInteractive();

    //Button Events 
    startButton.once('pointerup', function () {
      this.scene.start('GameScene');
    }, this);

    startButton.on('pointerover', function () {

      this.setTint(0xff0000);

    });

    startButton.on('pointerout', function () {

      this.setTint();

    });

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

  },


  update: function () {

  },
  startGame: function () {
    this.game.scene.start("GameScene")
  }

});