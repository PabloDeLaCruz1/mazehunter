let PreLoadScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function PreLoadScene() {
        Phaser.Scene.call(this, {
            key: 'PreLoadScene'
        });
    },


    preload: function () {
        //loading Screen

        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();
        progressBox.fillStyle(0x111111, 0.8);
        progressBox.fillRect(400, 270, 400, 50);

        //Loading text
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;
        let loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        //   progressBox.setOrigin
        loadingText.setOrigin(0.5, 0.5);

        //Percent text
        let percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        //Show assets being loaded
        let assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        assetText.setOrigin(0.5, 0.5);
        //Slows loading for testing
        //   this.load.image('logo', './assets/logo.png');
        //   for (let i = 0; i < 500; i++) {
        //       this.load.image('logo' + i, './assets/logo.png');
        //   }

        //Event listens for loading screen


        this.load.on('progress', function (value) {
            console.log(value);
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(400, 280, 400 * value, 30);
        });

        this.load.on('fileprogress', function (file) {
            console.log(file.src);
            assetText.setText('Loading asset: ' + file.src); //file.key for only the keys
        });

        this.load.on('complete', function () {
            console.log('complete');
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });

        //Game Assests
        this.load.image('bomb', 'assets/bomb.png');


        this.load.image('sword', 'assets/sword.png', {
          frameHeight: 32,
          frameWidth: 32
        });
        this.load.image('diamond', 'assets/diamond.png', {
          frameHeight: 32,
          frameWidth: 28
        });

        this.load.spritesheet('dude', 'assets/dude.png', {
            frameWidth: 32,
            frameHeight: 48
        });


        this.load.spritesheet('zombi', 'assets/zombi.png', {
            frameWidth: 48,
            frameHeight: 48
        });

        // load masks for the spotlight
        this.load.image('mask1', '/assets/mask1.png');
        this.load.image('mask2', '/assets/mask2.png');

        //Pablos map
        this.load.image("tileset1", "assets/horror_rpg_tileset1.png");
        this.load.image("tileset2", "assets/horror_rpg_tileset2.png");
        this.load.image("tileset3", "assets/horror_rpg_tileset3.png");
        this.load.image("tileset4", "assets/horror_rpg_tileset4.png");
        this.load.image("tileset5", "assets/horror_rpg_tileset5.png");
        this.load.image("tileset6", "assets/horror_rpg_tileset6.png");

        this.load.tilemapTiledJSON("map", "assets/mainmap.json");       

    },

    create: function () {
        //   //Player animations
        const anims = this.anims;
        anims.create({
            key: "misa-left-walk",
            frames: anims.generateFrameNames("atlas", {
                prefix: "misa-left-walk.",
                start: 0,
                end: 3,
                zeroPad: 3
            }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: "misa-right-walk",
            frames: anims.generateFrameNames("atlas", {
                prefix: "misa-right-walk.",
                start: 0,
                end: 3,
                zeroPad: 3
            }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: "misa-front-walk",
            frames: anims.generateFrameNames("atlas", {
                prefix: "misa-front-walk.",
                start: 0,
                end: 3,
                zeroPad: 3
            }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: "misa-back-walk",
            frames: anims.generateFrameNames("atlas", {
                prefix: "misa-back-walk.",
                start: 0,
                end: 3,
                zeroPad: 3
            }),
            frameRate: 10,
            repeat: -1
        });


        console.log("Preload complete, running main world scene now");
        this.game.scene.start("GameScene")

    },	

    update: function () {

    }
});
