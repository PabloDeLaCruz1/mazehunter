let HowToScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function HowToScene() {
            Phaser.Scene.call(this, {
                key: 'HowToScene'
            });
        },
    preload: function () {
        this.load.image('how-to', gameAssets.howTo);
        this.load.image('how-to-keys', gameAssets.arrowKeys);
    },
    create: function () {

        let howToImage = this.add.image(600, 400, 'how-to');
        let howToKeys = this.add.image(450, 500, 'how-to-keys').setDisplaySize(600, 300)
        this.add.sprite(600, 200, 'logo');
        let startButton = this.add.image(600, 650, 'button-start');
        let menuButton = this.add.image(600, 750, 'button-start');

        let startButtonText = this.add.dynamicBitmapText(550, 625, 'desyrel', 'START!', 32);
        let menuButtonText = this.add.dynamicBitmapText(550, 725, 'desyrel', 'MENU!', 32);


        startButton.once('pointerup', function () {
            this.scene.start('GameScene');
        }, this);

        menuButton.once('pointerup', function () {
            this.scene.start('MenuScene');
        }, this);

        [startButton, menuButton].forEach(btn => {
            btn.setInteractive();
            btn.on('pointerover', function () {

                this.setTint(0xff0000);
            });
            btn.on('pointerout', function () {
                this.setTint();
            });
        });

    },


    update: function () {

    }

});