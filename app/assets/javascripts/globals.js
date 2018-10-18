let hitBomb = function (player, bomb) {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
}
let config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 800,
    parent: "game-container",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0
            },
        }
    },
    scene: [PreLoadScene, MenuScene, GameScene],
};
let player;
let cursors;
let score = 0;
let scoreText;
let light;