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
        diamond1 = this.physics.add.sprite(55, 400, 'diamond');
        diamond1.setInteractive();


        this.finder = createPathFinder(map);

        // this.lights.enable().setAmbientColor(0x000000);
        // light = this.lights.addLight(180, 80, 300).setColor(0xffffff).setIntensity(2).setScrollFactor(0.0);
        // mainLayer.setPipeline('Light2D');

        mainLayer.setCollisionByProperty({
            collides: true
        });

        // add an enemy
        var enemy = this.physics.add.sprite(36, 500, 'dude');
        enemy.setTint(0xff0000);
        enemy.setOrigin(0,0.5);
        enemy.goTo = function(x, y){
          // code mostly taken from https://github.com/Jerenaux/pathfinding_tutorial/blob/master/js/game.js
          var tileSize = map.tileWidth;
          var toX = Math.floor(x/tileSize);
          var toY = Math.floor(y/tileSize);
          var fromX = Math.floor(this.x/tileSize);
          var fromY = Math.floor(this.y/tileSize);
          var entity = this;
          this.scene.finder.findPath(fromX, fromY, toX, toY, function( path ) {
            if (path === null) {
              console.warn("Path was not found.");
            } else {
              entity.followPath(path);
            }
          });
          this.scene.finder.calculate();
        }

        enemy.followPath = function(path){
          console.log(path);
          var tweens = [];
          for(var i = 0; i < path.length-1; i++){
            var ex = path[i+1].x;
            var ey = path[i+1].y;
            tweens.push({
              targets: this,
              x: {value: ex*map.tileWidth, duration: 200},
              y: {value: ey*map.tileHeight, duration: 200}
            });
          }

          this.scene.tweens.timeline({
            tweens: tweens
          });
        }

        this.camera = this.cameras.main;

        this.input.on('pointerup', function(pointer){
          var x = this.scene.camera.scrollX + pointer.x;
          var y = this.scene.camera.scrollY + pointer.y;
          enemy.goTo(x,y);
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
          //TODO refactor to use player and item class from ./objects
        this.physics.add.collider(player, items.sword, collectItem, null, this)

        
        // setTimeout(() => {
        //     collectItem(player, items.sword)
        // }, 1000)
        // setTimeout(() => {
        //     console.log(player.inventory);

        // }, 2000)
        // physics collisions
        this.physics.add.collider(player, mainLayer);
        this.physics.add.collider(enemy, mainLayer);
        this.physics.add.overlap(player, enemy, collidePlayerEnemy);
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


    }
});

function collisionHandler(player, object){
    console.log(this)
    this.scene.start('MenuScene');
    this.physics.pause();
    gameOver = true;
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
  player.setTint(0xff0000);
}
