var MenuScene = new Phaser.Class({

  Extends: Phaser.Scene,

  initialize:

    function MenuScene() {
      Phaser.Scene.call(this, {
        key: 'MenuScene'
      });
    },
  preload: function () {

    this.load.image('menu', 'assets/logo.png');
    this.load.spritesheet('button-audio', 'assets/button-audio.png', {
      frameWidth: 35,
      frameHeight: 35
    });
    this.load.spritesheet('button-start', 'assets/button-start.png', {
      frameWidth: 600,
      frameHeight: 200
    });


  },
  create: function () {

    this.add.sprite(600, 400, 'menu');
    let startButton = this.add.image(600, 400, 'button-start', this.startGame, this, 2, 0, 1);
    startButton.setInteractive();

    startButton.once('pointerup', function () {
      this.scene.start('GameScene');
    }, this);

  },


  update: function () {

  },
  startGame: function () {
    this.game.scene.start("GameScene")
  }

});