let EndingScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function EndingScene() {
            Phaser.Scene.call(this, {
                key: 'EndingScene'
            });
        },
    preload: function () {
        this.load.image('game-over-background', gameAssets.gameOverBackground);
        this.load.image('congrats-background', gameAssets.congratsBackground);

        this.load.bitmapFont('desyrel', gameAssets.desyrel, gameAssets.desyrelXml);
        this.load.image('button-start', gameAssets.buttonStart);
        this.load.image('congrats-logo', gameAssets.congratsLogo);
        this.load.image('game-over-logo', gameAssets.gameOverLogo);


    },
    create: function () {

        if (gameOver === false){
            this.add.image(600, 400, 'game-over-background').setDisplaySize(1200, 900);

            this.add.sprite(600, 200, 'game-over-logo');


        } else {
            this.add.image(600, 400, 'congrats-background').setDisplaySize(1200, 900);

            this.add.sprite(640, 200, 'congrats-logo');


        }
        let tryAgainButton = this.add.image(600, 600, 'button-start').setTint(0xff0000);
        let menuButton = this.add.image(600, 700, 'button-start').setTint(0xff0000);
    
            let tryAgainText = this.add.dynamicBitmapText(520, 575, 'desyrel', 'Try Again...', 32);
            tryAgainText.setDisplayCallback(textCallback);
            let menuText = this.add.dynamicBitmapText(550, 675, 'desyrel', 'Menu', 32);
            menuText.setDisplayCallback(textCallback);
        
            //Button Events 
            tryAgainButton.once('pointerup', function () {
              this.scene.start('GameScene');
            }, this);
            menuButton.once('pointerup', function () {
              this.scene.start('MenuScene');
            }, this);
        
            [tryAgainButton, menuButton].forEach(btn => {
              btn.setInteractive();
              btn.on('pointerover', function () {
        
                this.setTint(0xff0000);
              });
              btn.on('pointerout', function () {
                this.setTint();
              });
            })
        // let howToKeys = this.add.image(450, 500, 'how-to-keys').setDisplaySize(600, 300)
        // this.add.sprite(600, 200, 'logo');
        // let startButton = this.add.image(600, 650, 'button-start');
        // let menuButton = this.add.image(600, 750, 'button-start');

        // let startButtonText = this.add.dynamicBitmapText(550, 625, 'desyrel', 'START!', 32);
        // let menuButtonText = this.add.dynamicBitmapText(550, 725, 'desyrel', 'MENU!', 32);


        // startButton.once('pointerup', function () {
        //     this.scene.start('GameScene');
        // }, this);

        // menuButton.once('pointerup', function () {
        //     this.scene.start('MenuScene');
        // }, this);

        // [startButton, menuButton].forEach(btn => {
        //     btn.setInteractive();
        //     btn.on('pointerover', function () {

        //         this.setTint(0xff0000);
        //     });
        //     btn.on('pointerout', function () {
        //         this.setTint();
        //     });
        // });

    },


    update: function () {

    }

});