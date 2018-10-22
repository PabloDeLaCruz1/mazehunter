let config = {
    type: Phaser.AUTO,
    width: 2280,
    height: 1710,
    parent: "game-container",
    physics: {
        default: 'arcade',
        arcade: {
            // debug: true, // for testing, remove in production
            gravity: {
                y: 0
            },
        }
    },
    scene: [PreLoadScene, MenuScene, GameScene],
};
let player = {
    // type: "",
    // inventory: []
};

let items = {

}
let player2;
let myPlayer;
let cursors;
let score = 0;
let scoreText;
let light;
var gameOver = false;