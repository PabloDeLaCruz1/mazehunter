//= require easystar
//= require scenes/preload
//= require classes/enemy
//= require game_editor/editor.js

let config = {
  type: Phaser.AUTO,
  width: 960,
  height: 960,
  parent: "game-container",
  physics: {
      default: 'arcade',
      arcade: {
          debug: true, // DEBUGGING for testing, remove in production
          gravity: {
              y: 0
          },
      }
  },
  scene: [PreLoadScene, EditorScene],
};
