// This file contains helper functions
let hitBomb = function (player, bomb) {
  this.physics.pause();

  player.setTint(0xff0000);

  player.anims.play('turn');

  gameOver = true;
}

// Coordinate conversion functions
// TODO: phaser map likely already has functions like these,
// look them up
toTileCoordinates = function(x, y, size){
// if calling this function without binding "this" to a TileMap object,
// you must explicitly pass in the tile size
size = size || this.tileWidth;
return {
  x: Math.floor(x/size),
  y: Math.floor(y/size)
}
}
toWorldCoordinates = function(x, y, size){
// if calling this function without binding "this" to a TileMap object,
// you must explicitly pass in the tile size
size = size || this.tileWidth;
return {
  x: x * size,
  y: y * size
}
}
alignWithMap = function(x, y, size){
// takes world coordinates and returns an object containing 
// coordinates aligned to the map tiles
// like the other converter functions, you must either bind "this"
// to a TileMap object, or pass the tile size explicitly
size = size || this.tileWidth;
var tileCoords = toTileCoordinates(x,y,size);
return toWorldCoordinates(tileCoords.x, tileCoords.y, size);
}


//Will use this to generate "trust" effects or "dust" when player run/sprint/walk etc.
//http://labs.phaser.io/view.html?src=src\games\defenda\test.js
function createThrustEmitter ()
{
  this.thrust = this.add.particles('jets').createEmitter({
      x: 1600,
      y: 200,
      angle: { min: 160, max: 200 },
      scale: { start: 0.2, end: 0 },
      blendMode: 'ADD',
      lifespan: 600,
      on: false
  });
}

//Used for menu buttons
function textCallback (data)
{
  
  data.x = Phaser.Math.Between(data.x, data.x + .5 );
  data.y = Phaser.Math.Between(data.y, data.y + .5 );

  return data;
}