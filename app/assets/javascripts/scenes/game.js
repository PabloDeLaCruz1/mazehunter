let GameScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function GameScene() {
            Phaser.Scene.call(this, {
                key: 'GameScene'
            });
        },
    preload: function () {
      // Helper functions
      this.createMapCollider = function(){
        //TODO: change property "Collides" to "collides"
        this.map.layers.forEach((layer)=>{
          layer.tilemapLayer.setCollisionByProperty({Collides: true});
        })
      },

      this.addMapCollider = function(object){
        // adds collision between the given objects and each map layer in layers
        this.map.layers.forEach((layer)=>{
          this.physics.add.collider(object, layer.tilemapLayer)
        });
      }
    },
    create: function () {

        // create your world here
        this.lights.enable().setAmbientColor(0x111111);
        light = this.lights.addLight(0, 0, 400).setColor(0xffffff).setIntensity(2);
        //.setScrollFactor(0.0);


        // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
        // Phaser's cache (i.e. the name you used in preload)

        const map = this.make.tilemap({
            key: "map"
            // tileWidth: 32,
            // tileHeight: 32
        });
        this.map = map;
        gmap = map;

        const magecityTileSet = map.addTilesetImage( "magecity", "magecity");
        const wallTileSet = map.addTilesetImage( "walls", "walls");
        const treesTileSet = map.addTilesetImage( "trees_plants", "trees");
        const dungeonTileSet = map.addTilesetImage( "ProjectUtumno_full", "dungeon");
        
        const bottomLayer = map.createDynamicLayer("bottomLayer", [magecityTileSet, wallTileSet, treesTileSet, dungeonTileSet])
        const mediumLayer = map.createDynamicLayer("mediumLayer", [magecityTileSet, wallTileSet, treesTileSet, dungeonTileSet])
        const topLayer = map.createDynamicLayer("topLayer", [magecityTileSet, wallTileSet, treesTileSet, dungeonTileSet])
        const treeLayer = map.createDynamicLayer("treeLayer", [magecityTileSet, wallTileSet, treesTileSet, dungeonTileSet])

        // const magecityLayer = map.createStaticLayer("magecityLayer", magecityTileSet, 0, 0);
        // const wallLayer = map.createStaticLayer("wallLayer", wallTileSet, 0, 0);
        // const treesLayer = map.createStaticLayer("treesLayer", treesTileSet, 0, 0);
        // const dungeonLayer = map.createStaticLayer("dungeonLayer", dungeonTileSet, 0, 0);

        // const tileset = map.addTilesetImage("Maze1Tiles", "tiles");
        // const mainLayer = map.createStaticLayer("Tile Layer 1", tileset, 0, 0);

        // const tileset = map.addTilesetImage("Maze1Tiles", "tiles");
        // const mainLayer = map.createStaticLayer("Tile Layer 1", tileset, 0, 0);
        diamond1 = this.physics.add.sprite(55, 400, 'diamond');
        diamond1.setInteractive();


        // TODO: make pathfinder work with new map (ideally, with ANY map)
        this.finder = createPathFinder2(map);

        // this.lights.enable().setAmbientColor(0x000000);
        // light = this.lights.addLight(180, 80, 300).setColor(0xffffff).setIntensity(2).setScrollFactor(0.0);
        // mainLayer.setPipeline('Light2D');
        gmediumLayer = mediumLayer;
        this.createMapCollider();


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
        var enemy1 = Enemy(this.physicsAdd(96, 512, 'zombi'));
        var enemy2 = Enemy(this.physicsAdd(266, 490, 'zombi'));

        // set the patrol path that the enemies will follow
        // below lines commented out until pathfinder is working with new map
        enemy1.createPatrol(t(32,896));
        // enemy2.createPatrol(t(410,230));

        this.camera = this.cameras.main;

        this.input.on('pointerup', function(pointer){
          var x = this.scene.camera.scrollX + pointer.x;
          var y = this.scene.camera.scrollY + pointer.y;
          console.log(m(x,y)); // DEBUGGING
          console.log(t(x,y)); // DEBUGGING
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

        this.physics.add.collider(player, mainLayer);


        // change player's hitbox size
        player.body.setSize(20,20);
        player.body.setOffset(14,28);

        player.setDepth(10)
        //   //Player animations
        const anims = this.anims;
        // anims.create({
        //     key: "idle",
        //     frames: [{
        //         key: 'dude',
        //         frame: 0
        //     }],
        //     frameRate: 10,
        //     repeat: -1
        // });
        // anims.create({
        //     key: "down",
        //     frames: anims.generateFrameNumbers('dude', {
        //         start: 0,
        //         end: 11
        //     }),
        //     frameRate: 10,
        //     repeat: -1
        // });
        // anims.create({
        //     key: "left",
        //     frames: anims.generateFrameNumbers('dude', {
        //         start: 12,
        //         end: 23
        //     }),
        //     frameRate: 10,
        //     repeat: -1
        // });
        // anims.create({
        //     key: "right",
        //     frames: anims.generateFrameNumbers('dude', {
        //         start: 24,
        //         end: 35
        //     }),
        //     frameRate: 10,
        //     repeat: -1
        // });
        // anims.create({
        //     key: "up",
        //     frames: anims.generateFrameNumbers('dude', {
        //         start: 36,
        //         end: 47
        //     }),
        //     frameRate: 10,
        //     repeat: -1

        anims.create({
          key: "left",
          frames: anims.generateFrameNumbers('zombi', { start: 3, end: 5 }),
          frameRate: 10,
          repeat: -1
        });
        anims.create({
          key: "idle",
          frames: [{key: 'zombi', frame: 1}],
          frameRate: 10,
          repeat: -1
        });
        anims.create({
          key: "right",
          frames: anims.generateFrameNumbers('zombi', { start: 6, end: 8 }),
          frameRate: 10,
          repeat: -1
        });
        anims.create({
          key: "up",
          frames: anims.generateFrameNumbers('zombi', { start: 9, end: 11 }),
          frameRate: 10,
          repeat: -1
        });
        anims.create({
          key: "down",
          frames: anims.generateFrameNumbers('zombi', { start: 0, end: 2 }),
          frameRate: 10,
          repeat: -1
        });

        //   //Enable keyboard movement
        cursors = this.input.keyboard.createCursorKeys();
        //   scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        bombs = this.physics.add.group();

        // setTimeout(() => {
        //     collectItem(player, items.sword)
        // }, 1000)
        // setTimeout(() => {
        //     console.log(player.inventory);

        // }, 2000)
        // physics collisions
        //TODO refactor to use player and item class from ./objects
        this.addMapCollider(player);
        this.physics.add.collider(player, items.sword, collectItem, null, this);
        this.physics.add.overlap(player, enemy1, collidePlayerEnemy);
        this.physics.add.overlap(player, enemy2, collidePlayerEnemy);

    },

    update: function (time, delta) {
        if (gameOver)
        {
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


    },

    render: function(){
      
    }
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

function collisionHandler(player, object){
    console.log(this)
    this.scene.start('MenuScene');
    this.physics.pause();
    gameOver = true;
}

function createPathFinder2(map){
  // takes a map object and creates an EasyStar path finder from it
  // Most of this code is taken from: http://www.dynetisgames.com/2018/03/06/pathfinding-easystar-phaser-3/
  // Modified to work with maps with multiple layers, each of which can have collideable tiles.
  // Each layer in the map must have the same height and width

  // instantiate a new pathfinder object
  var finder = new EasyStar.js();

  // create a 2D grid of map height x map width, initialized to all zero's.
  // for our pathfinder, 0 will represent walkable tiles,
  // and 1 represents collideable.
  // other numbers may be added later to represent various costs
  var grid = Array(map.height).fill().map(()=>{return Array(map.width).fill(0)});

  // create an object to store the properties of every tile in every tileset in the map
  var tiles = {};
  // loop through each tileset in the map
  for (let tileset of map.tilesets){
    // copy the tile properties in this tileset into tiles
    Object.assign(tiles, tileset.tileProperties);
  }
  gtiles = tiles; //DEBUGGING

  // loop through each map layer
  for (let layer of map.layers){
    var data = layer.data;
    // loop through the layer's data 2D array
    for (let r = 0; r < map.height; r++){
      for (let c = 0; c < map.width; c++){
        // get  the index of this tile
        var index = data[r][c].index;
        // if this index is in tiles, and the "Collides" property is set,
        // then set this coordinate in the grid to 1
        if (tiles[index] && tiles[index].Collides) {
          grid[r][c] = 1;
        }
      }
    }
  }

  finder.setGrid(grid);
  finder.setAcceptableTiles([0]);

  // ggrid = grid; // DEBUGGING

  return finder;
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
  player.x = 80;
  player.y = 700;
  player.setTint(0xff0000);

}

