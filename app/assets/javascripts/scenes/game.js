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
            key: "map"
            // tileWidth: 32,
            // tileHeight: 32
        });

        const magecityTileSet = map.addTilesetImage( "magecity", "magecity");
        const wallTileSet = map.addTilesetImage( "walls", "walls");
        const treesTileSet = map.addTilesetImage( "trees_plants", "trees");
        const dungeonTileSet = map.addTilesetImage( "ProjectUtumno_full", "dungeon");
        
        const bottomLayer = map.createDynamicLayer("bottomLayer", [magecityTileSet, wallTileSet, treesTileSet, dungeonTileSet])
        const mediumLayer = map.createDynamicLayer("mediumLayer", [magecityTileSet, wallTileSet, treesTileSet, dungeonTileSet])
        const topLayer = map.createDynamicLayer("topLayer", [magecityTileSet, wallTileSet, treesTileSet, dungeonTileSet])
        const treeLayer = map.createDynamicLayer("treeLayer", [magecityTileSet, wallTileSet, treesTileSet, dungeonTileSet])


        // this.finder = createPathFinder(map);

        // this.lights.enable().setAmbientColor(0x000000);
        // light = this.lights.addLight(180, 80, 300).setColor(0xffffff).setIntensity(2).setScrollFactor(0.0);
        // mainLayer.setPipeline('Light2D');

        topLayer.setCollisionByProperty({
          Collides: true
        });

        // add an enemy
        var enemy = this.physics.add.sprite(70, 500, 'zombi');
        enemy.setOrigin(0,0.5);
        enemy.goTo = function(x, y){
          // code mostly taken from https://github.com/Jerenaux/pathfinding_tutorial/blob/master/js/game.js
          var tileSize = map.tileWidth;
          var toX   = Math.floor(x/tileSize);
          var toY   = Math.floor(y/tileSize);
          var fromX = Math.floor(this.x/tileSize);
          var fromY = Math.floor(this.y/tileSize);
          var entity = this;
          // this.scene.finder.findPath(fromX, fromY, toX, toY, function( path ) {
          //   if (path === null) {
          //     console.warn("Path was not found.");
          //   } else {
          //     entity.followPath(path);
          //   }
          // });
          //this.scene.finder.calculate();
        }

        enemy.followPath = function(path){
          //console.log(path);
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

        //Load Players
        player = this.physics.add.sprite(90, 900, 'zombi');
        items.sword = this.add.image(50, 400, 'sword').setDisplaySize(32, 32);
        items.sword.name = "sword"


        player.setDepth(10)
        //   //Player animations
        const anims = this.anims;
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

        
        //Enable keyboard movement
        cursors = this.input.keyboard.createCursorKeys();
        //  scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
        //TODO refactor to use player and item class from ./objects
        this.physics.add.collider(player, topLayer);
        this.physics.add.collider(player, items.sword, collectItem, null, this)

        
        // setTimeout(() => {
        //     collectItem(player, items.sword)
        // }, 1000)
        // setTimeout(() => {
        //     console.log(player.inventory);

        // }, 2000)
        // physics collisions
        // 
        
        //this.registry.set('lives', this.lives);
        
        //this.lives = 6;

        //super({ key: 'UIScene', active: true });

        //this.livesText;

        this.physics.add.overlap(player, enemy, collidePlayerEnemy);
        info_lives = this.add.text(780, 30, lives, { font: '48px Arial', fill: '#000000' });
        info_timer = this.add.text(510, 30, timer, { font: '48px Arial', fill: '#000000' });
        timer = this.time.addEvent({ delay: 10000 });

    },
      



  //UPATE

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

        //Updates Death Counts
        info_lives.setText('Lives: ' + lives);

        //Updates Timer
        info_timer.setText('Time: ' + Math.floor(10000 - timer.getElapsed()));
        //Spotlight

    }
});

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

  function collidePlayerEnemy(player, enemy) {
    if(lives === 0) {
      gameOver()
    } else {
      lives--;
    }
    player.x = 90;
    player.y = 900;
  }

//INTERESTING FOR COIN PICKUP - DO NOT ERASE THIS
//function create() {  // create coins  for (var i = 0; i < vars.coinTotal; i++) {    var coin = game.coins.create(x, 0, 'coin');        coin.tween = game.add.tween(coin).to({ alpha: 0, y: 80, x: coin.x+(game.width/1.8) }, 1000, Phaser.Easing.Cubic.Out);    coin.pickedUp = false; // set flag on each coin to prevent multiple update calls    coin.tween.onComplete.add(function(coin, tween) {      coin.kill();    });  }}function update() {  // add collide event for pickup  game.physics.arcade.overlap(player, coin, coinPickup, null, this);}function coinPickup(player,coin) {  if (!coin.pickedUp) { // check if coin has already been picked up, if not proceed...    coin.pickedUp=true; // then immediately set it to true so it is only called once    game.coinCount += 1;    coin.tween.start();  }}
// Edited January 3, 2016 by dr.au