const Enemy = (function(){
  // code dealing with pathfinding mostly taken from: 
  // https://github.com/Jerenaux/pathfinding_tutorial/blob/master/js/game.js
  function createPatrol(to, from, startPatrol=true){
    this.startPatrol = startPatrol;
    from = from || toTileCoordinates.call(this.scene.map, this.x, this.y);
    var toX = to.x;
    var toY = to.y;
    var fromX = from.x;
    var fromY = from.y;
    var caller = this;
    this.scene.finder.findPath(fromX, fromY, toX, toY, function( path ) {
      if (path === null) {
        console.warn("Path was not found.");
      } else {
        createTweens.call(caller, path);
      }
    });
    this.scene.finder.calculate();
  }

  function createTweens(path){
    // use the generated path to create an array of tweens
    var map = this.scene.map;
    var tweens = [];
    for(var i = 0; i < path.length; i++){
      var ex = path[i].x;
      var ey = path[i].y;
      tweens.push({
        targets: this,
        x: {value: ex*map.tileWidth, duration: 200},
        y: {value: ey*map.tileHeight, duration: 200}
      });
    }
    // now append the tweens array reversed, so it goes back to the start
    this.tweens = tweens.concat(tweens.slice().reverse());

    // once this function finishes, the patrol path has been finalized.
    this.pathSet = true;
    // if patrol has been called at this point, call it again now
    if (this.startPatrol) this.patrol();
    // otherwise do nothing, patrol will be called at some point
  }

  function patrol(){
    // if already patrolling, don't do anything
    if (this.patrolling) {
      console.log("Already patrolling.");
      return;
    }
    // if the patrol path hasn't been created yet,
    // set a flag indicating that this function has been called.
    // once createPatrol finishes, it will check this flag and call patrol.
    if (!this.pathSet) {
      console.log("waiting for path to be set");
      this.startPatrol = true;
    }
    else {
      // else, path has finished being created, start the patrol
      this.patrolling = true;
      this.scene.tweens.timeline({
        tweens: this.tweens,
        loop: -1
      });
    }
  }

  return function(enemy){
    enemy.setOrigin(0,0.5);
    enemy.pathSet = false;
    enemy.createPatrol = createPatrol;
    enemy.patrol = patrol;
    return enemy;
  }
})();