const Enemy = (function(){
  function goTo(x, y){
    // code mostly taken from https://github.com/Jerenaux/pathfinding_tutorial/blob/master/js/game.js
    var map = this.scene.map;
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

  function followPath(path){
    // code mostly taken from https://github.com/Jerenaux/pathfinding_tutorial/blob/master/js/game.js
    var map = this.scene.map;
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

  return function(enemy){
    enemy.goTo = goTo;
    enemy.followPath = followPath;
    return enemy;
  }
})();