var GameScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function GameScene() {
            Phaser.Scene.call(this, {
                key: 'GameScene'
            });
        },
    preload: function () {
        this.load.image('diamond', 'assets/diamond.png');
    },
    create: function () {
        // create your world here
        this.lights.enable().setAmbientColor(0x000000);
        light = this.lights.addLight(100, 100, 1000).setColor(0xffffff).setIntensity(2).setScrollFactor(0.0);


        // var robot = this.add.image(-100, 0, 'robot').setOrigin(0).setScale(0.7);



        // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
        // Phaser's cache (i.e. the name you used in preload)

        const map = this.make.tilemap({
            key: "map",
            tileWidth: 36,
            tileHeight: 36
        });

        const tileset = map.addTilesetImage("Maze1Tiles", "tiles");
        const mainLayer = map.createStaticLayer("Tile Layer 1", tileset, 0, 0);
        diamond1 = this.physics.add.sprite(55, 400, 'diamond');
        diamond1.setInteractive();



        mainLayer.setPipeline('Light2D');

        mainLayer.setCollisionByProperty({
            collides: true
        });


        //     //Load Player
        player = this.physics.add.sprite(50, 600, 'dude');
        this.physics.add.collider(player, mainLayer);
        this.physics.add.collider(player, mainLayer);
        this.physics.add.overlap(player, diamond1, collisionHandler, null, this);
        player.setDepth(10)

        //   //Enable keyboard movement
        //   cursors = this.input.keyboard.createCursorKeys();
        //   scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        bombs = this.physics.add.group();

        // this.physics.add.collider(bombs, platforms);

        this.physics.add.collider(player, bombs, hitBomb, null, this);

    },

    update: function (time, delta) {
        if (gameOver)
        {
          return;
        }

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

    function collisionHandler(player, object)
    {
        console.log(this)
        this.scene.start('MenuScene');
        this.physics.pause();
        gameOver = true;
    }
