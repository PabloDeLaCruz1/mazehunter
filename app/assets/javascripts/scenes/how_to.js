let HowToScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function HowToScene() {
            Phaser.Scene.call(this, {
                key: 'HowToScene'
            });
        },
    preload: function () {

        this.load.image('how-to', 'assets/how-to.png');

    },
    create: function () {

        let howToImage = this.add.image(1200, 850, 'how-to', this.goToMenu, this, 5, 0, 1);

        howToImage.once('pointerup', function () {
            this.scene.start('MenuScene');
        }, this);

    },


    update: function () {

    },
    goToMenu: function () {
        this.game.scene.start("MenuScene")
    }

});