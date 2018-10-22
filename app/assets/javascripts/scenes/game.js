let GameScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function GameScene() {
            Phaser.Scene.call(this, {
                key: 'GameScene'
            });
        },
    preload: function () {
      
      this.load.image('stats-bar', 'assets/button-start.png');
      this.load.image('test-image', 'assets/test-image.png');
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

        topLayer.setCollisionByProperty({
          collides: true
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
        player.setDepth(1);

        //Player animations
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
        
        //Set collision to the the Top Layer
        this.physics.add.collider(player, topLayer);

        graphics = this.add.graphics();
        graphics.fillStyle(0x000000, 0.3);
        graphics.fillRect(0, 0, 960, 960);
        graphics.setVisible(true);

        diamond = this.physics.add.group({
          key: 'diamonds',
          repeat: 3,
          setXY: { x: 100, y: 750, stepX: 70}
        });

        sword          = this.physics.add.image(100, 600, 'attack').setDisplaySize(60, 30);

        stats_diamonds = this.add.image(0, 0, 'stats-bar').setDisplaySize(200, 150);
        img_diamond    = this.add.image(-30, 0, 'diamond-stats').setDisplaySize(25, 25);

        stats_attack   = this.add.image(0, 0, 'stats-bar').setDisplaySize(200, 150);
        img_sword      = this.add.image(-30, 0, 'attack').setDisplaySize(70, 40);

        stats_timer    = this.add.image(0, 0, 'stats-bar').setDisplaySize(200, 150);
        img_timer      = this.add.image(-40, 0, 'hourglass-stats').setDisplaySize(30, 30);

        stats_lives    = this.add.image(0, 0, 'stats-bar').setDisplaySize(200, 150);
        img_lives      = this.add.image(-30, 0, 'heart-stats').setDisplaySize(30, 30);

        diamondContainer  = this.add.container(250, 850, [ stats_diamonds, img_diamond ]);
        attackContainer   = this.add.container(433, 850, [ stats_attack, img_sword ]);
        timerContainer    = this.add.container(616, 850, [ stats_timer, img_timer ]);
        livesContainer    = this.add.container(800, 850, [ stats_lives, img_lives ]);
        
        diamondContainer.setSize(stats_diamonds.width, img_diamond.height);
        attackContainer.setSize(stats_attack.width, img_sword.height);
        timerContainer.setSize(stats_timer.width, img_timer.height);
        livesContainer.setSize(stats_lives.width, img_lives.height);
         
        this.diamondCollectSound = this.sound.add("coinPickup");

        timer_text  = this.add.text(610, 830, timer,  { font: '30px Arial', fill:  '#ffffff' });
        timer = this.time.addEvent({ delay: 10000 });
        lives_text  = this.add.text(810, 830, lives,  { font: '30px Arial', fill:  '#ffffff' });
        points_text = this.add.text(260, 830, '0',    { font: '30px Arial', fill:  '#ffffff' });
        attack_text = this.add.text(440, 830, '0',    { font: '30px Arial', fill:  '#ffffff' });
        
        this.diamondCollectSound = this.sound.add("coinPickup");

        this.physics.add.overlap(player, enemy, collidePlayerEnemy);
        this.physics.add.overlap(player, diamond, collectDiamonds, null, this);
        this.physics.add.overlap(player, sword, collectSwords, null, this);
    },
      
  //UPATE

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

        // //Updates Death Counts
        lives_text.setText(lives);

        // //Updates Timer
        timer_text.setText(Math.floor(10000 - timer.getElapsed()));

    }
});

function createPathFinder(map){
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

function collectDiamonds (player, diamond)
{
  diamond.disableBody(true, true);
  this.diamondCollectSound.play();
  //  Add and update the score
  points += 10;
  points_text.setText(points);

}

function collectSwords (player, sword)
{
  swords.disableBody(true, true);
  // this.swordCollectSound.play();
  //  Add and update the score
  sword += 1;
  attack_text.setText(swords);
  console.log(swords);

}