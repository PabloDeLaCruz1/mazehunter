var GameScene = new Phaser.Class({

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
        // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
        // Phaser's cache (i.e. the name you used in preload)

        const map = this.make.tilemap({
            key: "map",
            tileWidth: 36,
            tileHeight: 36
        });
        this.map = map;

        const tileset = map.addTilesetImage("Maze1Tiles", "tiles");
        const mainLayer = map.createStaticLayer("Tile Layer 1", tileset, 0, 0);

        this.finder = createPathFinder(map);

        // this.lights.enable().setAmbientColor(0x000000);
        // light = this.lights.addLight(180, 80, 300).setColor(0xffffff).setIntensity(2).setScrollFactor(0.0);
        // mainLayer.setPipeline('Light2D');

        mainLayer.setCollisionByProperty({
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
        this.physicsAdd = function(x, y, spriteKey){
          console.log();
          let aligned = m(x, y);
          return this.physics.add.sprite(aligned.x, aligned.y, spriteKey);
        }

        // add some enemies
        var enemy1 = Enemy(this.physicsAdd(36, 500, 'dude'));
        var enemy2 = Enemy(this.physicsAdd(266, 490, 'dude'));
        // var enemy3 = Enemy(this.physics.add.sprite(36, 500, 'dude'));

        // set the patrol path that the enemies will follow
        enemy1.createPatrol(t(273,236));
        enemy2.createPatrol(t(410,230));

        this.camera = this.cameras.main;

        this.input.on('pointerup', function(pointer){
          var x = this.scene.camera.scrollX + pointer.x;
          var y = this.scene.camera.scrollY + pointer.y;
          console.log(x,y);
          enemy.patrol();
        });

        //     //Load Player
        player = this.physics.add.sprite(50, 600, 'dude');
        
        player.setDepth(10)
        //   //Player animations
        const anims = this.anims;
        anims.create({
          key: "left",
          frames: anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
          frameRate: 10,
          repeat: -1
        });
        anims.create({
          key: "idle",
          frames: [{key: 'dude', frame: 4}],
          frameRate: 10,
          repeat: -1
        });
        anims.create({
          key: "right",
          frames: anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
          frameRate: 10,
          repeat: -1
        });

        
        //   //Enable keyboard movement
        cursors = this.input.keyboard.createCursorKeys();
        //   scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        bombs = this.physics.add.group();

        // this.physics.add.collider(bombs, platforms);

        this.physics.add.collider(player, bombs, hitBomb, null, this);
        // physics collisions
        this.physics.add.collider(player, mainLayer);
        this.physics.add.overlap(player, enemy1, collidePlayerEnemy);
        this.physics.add.overlap(player, enemy2, collidePlayerEnemy);

    },

    update: function (time, delta) {
        // Stop any previous movement from the last frame
        // cursors = this.input.keyboard.createCursorKeys();
        let speed = 175;
        let prevVelocity = player.body.velocity.clone();

        if (prevVelocity.x == 0 && prevVelocity.y == 0){
          player.anims.play('idle');
        }
        player.body.setVelocity(0);

        // Horizontal movement
        if (cursors.left.isDown) {
            player.body.setVelocityX(-100);
            globalAnim = player.anims;
            player.anims.play('left', true);
        } else if (cursors.right.isDown) {
            player.body.setVelocityX(100);
            player.anims.play('right', true);
        }

        // Vertical movement
        if (cursors.up.isDown) {
            player.body.setVelocityY(-100);
            player.anims.play('right', true);
        } else if (cursors.down.isDown) {
            player.body.setVelocityY(100);
            player.anims.play('right', true);
        }

        // Normalize and scale the velocity so that player can't move faster along a diagonal
        player.body.velocity.normalize().scale(speed);


        //Spotlight

        // light.x = player.x;
        // light.y = player.y;
    
        

    },
});

function toTileCoordinates(x, y, size){
  // if calling this function without binding "this" to a TileMap object,
  // you must explicitly pass in the tile size
  size = size || this.tileWidth;
  return {
    x: Math.floor(x/size),
    y: Math.floor(y/size)
  }
}
function toWorldCoordinates(x, y, size){
  // if calling this function without binding "this" to a TileMap object,
  // you must explicitly pass in the tile size
  size = size || this.tileWidth;
  return {
    x: x * size,
    y: y * size
  }
}
function alignWithMap(x, y, size){
  // takes world coordinates and returns an object containing 
  // coordinates aligned to the map tiles
  // like the other converter functions, you must either bind "this"
  // to a TileMap object, or pass the tile size explicitly
  size = size || this.tileWidth;
  var tileCoords = toTileCoordinates(x,y,size);
  return toWorldCoordinates(tileCoords.x, tileCoords.y, size);
}

function createPathFinder(map){
  // takes a map object and creates an EasyStar path finder from it
  // Most of this code is taken from: http://www.dynetisgames.com/2018/03/06/pathfinding-easystar-phaser-3/
  // instantiate a new pathfinder object
  var finder = new EasyStar.js();

  // first we have to create a 2D grid out of the tile IDs in our map
  var grid = [];
  for(var y = 0; y < map.height; y++){
    var col = [];
    for(var x = 0; x < map.width; x++){
      // In each cell we store the ID of the tile, which corresponds
      // to its index in the tileset of the map ("ID" field in Tiled)
      col.push(map.getTileAt(x,y).index);
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
  for (let i = tileset.firstgid-1; i < tileset.total-1; i++){
    // if collides is false, add the tile to walkable
    if (properties[i] && !properties[i].collides) walkable.push(i+1);
  }
  finder.setAcceptableTiles(walkable);

  return finder;
}

function collidePlayerEnemy(player, enemy){
  // respawn player logic goes here
  player.setTint(0xff0000);
}