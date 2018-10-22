let EditorScene = new Phaser.Class({

  Extends: Phaser.Scene,

  initialize:

      function GameScene() {
          Phaser.Scene.call(this, {
              key: 'GameScene'
          });
      },
  preload: function () {
    // functions called later on:
    this.createMap = function(){
      var map = this.make.tilemap({
        key: "map"
        // tileWidth: 32,
        // tileHeight: 32
      });
      this.map = map;

      var magecityTileSet = map.addTilesetImage( "magecity", "magecity");
      var wallTileSet = map.addTilesetImage( "walls", "walls");
      var treesTileSet = map.addTilesetImage( "trees_plants", "trees");
      var dungeonTileSet = map.addTilesetImage( "ProjectUtumno_full", "dungeon");
      var tilesets = [magecityTileSet, wallTileSet, treesTileSet, dungeonTileSet];

      map.createStaticLayer("bottomLayer", tilesets);
      map.createStaticLayer("mediumLayer", tilesets);
      map.createStaticLayer("topLayer", tilesets);
      map.createStaticLayer("treeLayer", tilesets);

      return map;
    }

    this.createMarker = function(){
      var marker = this.add.graphics();
      marker.lineStyle(3, 0x00ff00, 1);
      marker.strokeRect(0,0, this.map.tileWidth, this.map.tileHeight);
      marker.setVisible(true);
      return this.marker = marker;
    }

    this.updateMarker = function(x,y){
      this.marker.x = x;
      this.marker.y = y;
    }

    this.state = "main";
    this.pointerTile = {x:0, y:0};
  },
  create: function () {
    // create the map
    var map = this.createMap();
    // create the pathfinder for the map
    this.finder = createPathFinder2(map);
    // create a cursor marker to highlight tiles
    var marker = this.createMarker();

    // SHORTCUT FUNCTIONS
    // create a shortcut of the toTileCoordinates function, bound to the map in this scene
    var t = toTileCoordinates.bind(this.map);
    // shortcut for toWorldCoordinates, similar to above
    var w = toWorldCoordinates.bind(this.map);
    // shortcut for alignWithMap
    var m = alignWithMap.bind(this.map);
    // shortcut for this.physics.add.sprite
    this.physicsAdd = function(x, y, spriteKey){
      let aligned = m(x, y);
      return this.physics.add.sprite(aligned.x, aligned.y, spriteKey);
    }

    this.camera = this.cameras.main;

    // event listener for mouse movement
    this.input.on('pointermove', function(pointer){
      var x = this.scene.camera.scrollX + pointer.x;
      var y = this.scene.camera.scrollY + pointer.y;
      var aligned = m(x,y);
      this.scene.updateMarker(aligned.x,aligned.y);
    });

    // event listener for mouse click
    this.input.on('pointerup', function(pointer){
      var x = this.scene.camera.scrollX + pointer.x;
      var y = this.scene.camera.scrollY + pointer.y;
      console.log(m(x,y)); // DEBUGGING
      console.log(t(x,y)); // DEBUGGING
    });
  },

  update: function (time, delta) {
      
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

