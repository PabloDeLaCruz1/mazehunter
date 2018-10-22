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

        //.setScrollFactor(0.0);


        // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
        // Phaser's cache (i.e. the name you used in preload)

        const map = this.make.tilemap({
            key: "map"
        });
        this.map = map;


        //Pablos Map
        const tileset1 = map.addTilesetImage("horror_rpg_tileset1", "tileset1");
        const tileset2 = map.addTilesetImage("horror_rpg_tileset2", "tileset2");
        const tileset3 = map.addTilesetImage("horror_rpg_tileset3", "tileset3");
        const tileset4 = map.addTilesetImage("horror_rpg_tileset4", "tileset4");
        const tileset5 = map.addTilesetImage("horror_rpg_tileset5", "tileset5");
        const tileset6 = map.addTilesetImage("horror_rpg_tileset6", "tileset6");


        // const bottomLayer = map.createDynamicLayer("bottomLayer", [magecityTileSet, wallTileSet, treesTileSet, dungeonTileSet])
        // const mediumLayer = map.createDynamicLayer("mediumLayer", [magecityTileSet, wallTileSet, treesTileSet, dungeonTileSet])
        const mainLayer = map.createDynamicLayer("Tile Layer 1", [tileset1, tileset2, tileset3, tileset4, tileset5, tileset6], 0, 0);
        const collideLayer = map.createDynamicLayer("Collide Layer", [tileset1, tileset2, tileset3, tileset4, tileset5, tileset6], 0, 0)
        const secondLayer = map.createDynamicLayer("Tile Layer 2", [tileset1, tileset2, tileset3, tileset4, tileset5, tileset6], 0, 0)
        const thirdLayer = map.createDynamicLayer("Tile Layer 3", [tileset1, tileset2, tileset3, tileset4, tileset5, tileset6], 0, 0)
        const fifthLayer = map.createDynamicLayer("Tile Layer 5", [tileset1, tileset2, tileset3, tileset4, tileset5, tileset6], 0, 0)

        diamond1 = this.physics.add.sprite(55, 400, 'diamond');
        diamond1.setInteractive();


        // TODO: make pathfinder work with new map (ideally, with ANY map)
        // this.finder = createPathFinder(map);

        this.lights.enable().setAmbientColor(0x000000);
        light = this.lights.addLight(180, 80, 300).setColor(0xffffff).setIntensity(2).setScrollFactor(0.0);
        // collideLayer.setPipeline('Light2D');

        collideLayer.setCollisionByProperty({
            collides: true
        });


        // SHORTCUT FUNCTIONS
        // create a shortcut of the toTileCoordinates function, bound to the map in this scene
        var t = toTileCoordinates.bind(this.map);
        // shortcut for toWorldCoordinates, similar to above
        var w = toWorldCoordinates.bind(this.map);
        // shortcut for alignWithMap
        var m = alignWithMap.bind(this.map);
        // shortcut for this.physics.add.sprite
        this.physicsAdd = function (x, y, spriteKey) {
            let aligned = m(x, y);
            return this.physics.add.sprite(aligned.x, aligned.y, spriteKey);
        }

        // add some enemies
        var enemy1 = Enemy(this.physicsAdd(36, 500, 'zombi'));
        var enemy2 = Enemy(this.physicsAdd(266, 490, 'zombi'));

        // set the patrol path that the enemies will follow
        // below lines commented out until pathfinder is working with new map
        // enemy1.createPatrol(t(273,236));
        // enemy2.createPatrol(t(410,230));

        this.camera = this.cameras.main;

        this.input.on('pointerup', function (pointer) {
            var x = this.scene.camera.scrollX + pointer.x;
            var y = this.scene.camera.scrollY + pointer.y;
            console.log(x, y);
            enemy1.patrol();
        });

        //     //Load Player
        // player = this.physics.add.sprite(50, 600, 'dude').setDisplaySize(50, 68);
        // player.body._bounds.height = 32;
        // player.body._bounds.width = 32;
        //     //Load Players
        player = this.physics.add.sprite(50, 600, 'zombi');
        items.sword = this.add.image(50, 400, 'sword').setDisplaySize(32, 32);
        items.sword.name = "sword"

        console.log(player.body._bounds.width);

        items.sword = this.physics.add.sprite(50, 400, 'sword').setDisplaySize(32, 32);

        items.sword.name = "sword"
        // this.physics.add.collider(player, items.sword);

        // this.physics.add.collider(player, collideLayer);


        player.setDepth(10)
        //   //Player animations
        const anims = this.anims;
        anims.create({
            key: "left",
            frames: anims.generateFrameNumbers('zombi', {
                start: 3,
                end: 5
            }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: "idle",
            frames: [{
                key: 'zombi',
                frame: 1
            }],
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: "right",
            frames: anims.generateFrameNumbers('zombi', {
                start: 6,
                end: 8
            }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: "up",
            frames: anims.generateFrameNumbers('zombi', {
                start: 9,
                end: 11
            }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: "down",
            frames: anims.generateFrameNumbers('zombi', {
                start: 0,
                end: 2
            }),
            frameRate: 10,
            repeat: -1
        });

        //   //Enable keyboard movement
        cursors = this.input.keyboard.createCursorKeys();
        //   scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        bombs = this.physics.add.group();
        //TODO refactor to use player and item class from ./objects
        this.physics.add.collider(player, collideLayer);


        // this.physics.add.collider(player, secondLayer);
        // this.physics.add.collider(player, thirdLayer);

        this.physics.add.collider(player, items.sword, collectItem, null, this)

        // setTimeout(() => {
        //     collectItem(player, items.sword)
        // }, 1000)
        // setTimeout(() => {
        //     console.log(player.inventory);

        // }, 2000)
        // physics collisions

        this.physics.add.collider(player, items.sword, collectItem)
        this.physics.add.overlap(player, enemy1, collidePlayerEnemy);
        this.physics.add.overlap(player, enemy2, collidePlayerEnemy);

        //Camera Layer
        // var camera1 = this.cameras.add(0, 0, 1200, 850).setZoom(.5);

        this.cameras.main.startFollow(player, true, 0.015, 0.015).setZoom(1);

        //  Enable lights and set a dark ambient color
        // this.lights.enable().setAmbientColor(0x333333);

        // //  Add an image and set it to use Lights2D
        // // var robot = this.add.image(-100, 0, 'robot').setOrigin(0).setScale(0.7);

        // this.cameras.main.setPipeline('Light2D');

        // //  Our spotlight. 100px radius and white in color.
        // var light = this.lights.addLight(180, 80, 200).setColor(0xffffff).setIntensity(2);

        // //  Track the pointer
        // this.input.on('pointermove', function (pointer) {

        //     light.x = pointer.x;
        //     light.y = pointer.y;

        // });


    },

    update: function (time, delta) {
        if (gameOver) {
            return;
        }

        // Stop any previous movement from the last frame
        // cursors = this.input.keyboard.createCursorKeys();
        let speed = 175;
        let prevVelocity = player.body.velocity.clone();

        if (prevVelocity.x == 0 && prevVelocity.y == 0) {
            player.anims.play('idle');
        }
        player.body.setVelocity(0);

        // Horizontal movement
        if (cursors.left.isDown) {
            player.body.setVelocityX(-100);
            player.anims.play('left', true);
        } else if (cursors.right.isDown) {
            player.body.setVelocityX(100);
            player.anims.play('right', true);
        }

        // Vertical movement
        if (cursors.up.isDown) {
            player.body.setVelocityY(-100);
            player.anims.play('up', true);
        } else if (cursors.down.isDown) {
            player.body.setVelocityY(100);
            player.anims.play('down', true);
        }

        // Normalize and scale the velocity so that player can't move faster along a diagonal
        player.body.velocity.normalize().scale(speed);

        //Spotlight


    }
});

function toTileCoordinates(x, y, size) {
    // if calling this function without binding "this" to a TileMap object,
    // you must explicitly pass in the tile size
    size = size || this.tileWidth;
    return {
        x: Math.floor(x / size),
        y: Math.floor(y / size)
    }
}

function toWorldCoordinates(x, y, size) {
    // if calling this function without binding "this" to a TileMap object,
    // you must explicitly pass in the tile size
    size = size || this.tileWidth;
    return {
        x: x * size,
        y: y * size
    }
}

function alignWithMap(x, y, size) {
    // takes world coordinates and returns an object containing 
    // coordinates aligned to the map tiles
    // like the other converter functions, you must either bind "this"
    // to a TileMap object, or pass the tile size explicitly
    size = size || this.tileWidth;
    var tileCoords = toTileCoordinates(x, y, size);
    return toWorldCoordinates(tileCoords.x, tileCoords.y, size);
}

function collisionHandler(player, object) {
    console.log(this)
    this.scene.start('MenuScene');
    this.physics.pause();
    gameOver = true;
}


function createPathFinder(map) {
    // takes a map object and creates an EasyStar path finder from it
    // Most of this code is taken from: http://www.dynetisgames.com/2018/03/06/pathfinding-easystar-phaser-3/
    // instantiate a new pathfinder object
    var finder = new EasyStar.js();

    // first we have to create a 2D grid out of the tile IDs in our map
    var grid = [];
    for (var y = 0; y < map.height; y++) {
        var col = [];
        for (var x = 0; x < map.width; x++) {
            // In each cell we store the ID of the tile, which corresponds
            // to its index in the tileset of the map ("ID" field in Tiled)
            col.push(map.getTileAt(x, y).index);
        }

        grid.push(col);
    }
    finder.setGrid(grid);

    // now create a list of walkable tiles by only choosing the ones without the "collides" property
    var walkable = [];
    // get the tileset, and its property list
    var tileset = map.tilesets[0];
    var properties = tileset.tileProperties;
    // loop through properties, and add those tiles which have "collides: false" to the walkable list
    for (let i = tileset.firstgid - 1; i < tileset.total - 1; i++) {
        // if collides is false, add the tile to walkable
        if (properties[i] && !properties[i].collides) walkable.push(i + 1);
    }
    finder.setAcceptableTiles(walkable);

    return finder;
}



function collidePlayerEnemy(player, enemy) {
    //Respawn player, add 1 to death counter, shake camera. 
    // this.cameras.main.shake(500);
    player.x = 80;
    player.y = 700;
    player.setTint(0xff0000);

}