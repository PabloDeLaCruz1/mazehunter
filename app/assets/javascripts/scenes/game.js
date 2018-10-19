let GameScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function GameScene() {
            Phaser.Scene.call(this, {
                key: 'GameScene'
            });
        },
    preload: function () {


    },
    create: function () {

        // create your world here
        this.lights.enable().setAmbientColor(0x111111);
        light = this.lights.addLight(0, 0, 400).setColor(0xffffff).setIntensity(2);
        //.setScrollFactor(0.0);

        // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
        // Phaser's cache (i.e. the name you used in preload)

        const map = this.make.tilemap({
            key: "map",
            tileWidth: 36,
            tileHeight: 36
        });


        const tileset = map.addTilesetImage("Maze1Tiles", "tiles");
        const mainLayer = map.createStaticLayer("Tile Layer 1", tileset, 0, 0);


        mainLayer.setPipeline('Light2D');

        mainLayer.setCollisionByProperty({
            collides: true
        });


        //     //Load Player
        player = this.physics.add.sprite(50, 600, 'dude');
        items.sword = this.add.image(50, 400, 'sword').setDisplaySize(32, 32);
        items.sword.name = "sword"
        // this.physics.add.collider(player, items.sword);



        this.physics.add.collider(player, mainLayer);
        player.setDepth(10)
        //   //Player animations
        const anims = this.anims;
        anims.create({
            key: "left-walk",
            frames: anims.generateFrameNames("atlas", {
                prefix: "left-walk.",
                start: 0,
                end: 3,
                zeroPad: 3
            }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: "right-walk",
            frames: anims.generateFrameNames("atlas", {
                prefix: "right-walk.",
                start: 0,
                end: 3,
                zeroPad: 3
            }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: "front-walk",
            frames: anims.generateFrameNames("atlas", {
                prefix: "front-walk.",
                start: 0,
                end: 3,
                zeroPad: 3
            }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: "back-walk",
            frames: anims.generateFrameNames("atlas", {
                prefix: "back-walk.",
                start: 0,
                end: 3,
                zeroPad: 3
            }),
            frameRate: 10,
            repeat: -1
        });

        //   //Enable keyboard movement
        //   cursors = this.input.keyboard.createCursorKeys();
        //   scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        bombs = this.physics.add.group();

        // this.physics.add.collider(bombs, platforms);

        this.physics.add.collider(player, bombs, hitBomb, null, this);
        //TODO refactor to use player and item class from ./objects
        this.physics.add.collider(player, items.sword, collectItem, null, this)

        
        // setTimeout(() => {
        //     collectItem(player, items.sword)
        // }, 1000)
        // setTimeout(() => {
        //     console.log(player.inventory);

        // }, 2000)
    },

    update: function (time, delta) {
        // Stop any previous movement from the last frame
        cursors = this.input.keyboard.createCursorKeys();
        let speed = 175;
        let prevVelocity = player.body.velocity.clone();

        player.body.setVelocity(0);

        // Horizontal movement
        if (cursors.left.isDown) {
            player.body.setVelocityX(-100);
        } else if (cursors.right.isDown) {
            player.body.setVelocityX(100);
        }

        // Vertical movement
        if (cursors.up.isDown) {
            player.body.setVelocityY(-100);
        } else if (cursors.down.isDown) {
            player.body.setVelocityY(100);
        }

        // Normalize and scale the velocity so that player can't move faster along a diagonal
        player.body.velocity.normalize().scale(speed);

        //Spotlight

        light.x = player.x;
        light.y = player.y;
    }
});