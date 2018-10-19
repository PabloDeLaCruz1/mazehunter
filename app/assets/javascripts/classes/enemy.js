class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame){
    super(scene, x, y, texture, frame);
    console.log("hello");
  }
}