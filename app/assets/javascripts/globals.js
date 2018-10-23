// let hitBomb = function (player, bomb) {
//     this.physics.pause();

//     player.setTint(0xff0000);

//     player.anims.play('turn');

//     gameOver = true;
// }

let collectItem = function (player, item) {

    console.log(player);
    
    console.log(`${item.name} added to inventory`);

    
    item.destroy();
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
    data.x = Phaser.Math.Between(data.x - 2, data.x + 2);
    data.y = Phaser.Math.Between(data.y - 1, data.y + 1);

    return data;
}
let config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 850,
    parent: "game-container",
    physics: {
        default: 'arcade',
        arcade: {
            //debug: true, // for testing, remove in production
            gravity: {
                y: 0
            },
        }
    },
    scene: [PreLoadScene, MenuScene, GameScene, HowToScene, EndingScene],
};
let player = {
    // type: "",
    // inventory: []
};

let items = {

}
let myPlayer;
let cursors;
let scoreText;
let lightlet 
let gameOver = false;
let diamond;
let lives_text;
let timer_text;
let points_text;
let lives = 3;
let timer;
let points = 0;
let graphics;
let sword;
let diamondCollectSound;
let swordCollectSound;
let zombie_death;
let player_death;
let game_over; 
let fadeInOut;
// let tomb_stone;

//Stats bar variables
let diamondContainer;
let attackContainer;
let timerContainer;
let livesContainer;
let statsBar;
let stats_diamonds;
let img_diamond;
let stats_timer;
let img_timer;
let stats_lives;
let img_lives;
