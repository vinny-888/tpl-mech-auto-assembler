let total = 500;
let directionsArr = [
    'walkForward',
    'walkLeft',
    'walkBackward',
    'walkRight',
    'idleForward',
    'idleLeft',
    'idleBackward',
    'idleRight',
];
class AllScene extends Phaser.Scene {
    constructor() {
        super({ key: 'AllScene' });
    }
}

AllScene.prototype.preload = function() {
    this.load.image('background', 'assets/background.png');

    for(let i=0; i<total; i++){
        this.load.spritesheet('player'+i, 'https://cb-media.sfo3.cdn.digitaloceanspaces.com/pixelbrokers/current/sprites/'+i+'.png', { frameWidth: 96, frameHeight: 96 });
    }
    this.load.image('platform', 'assets/platform.png');
}

AllScene.prototype.create = function() {
    this.speed = 100;
    this.directions = [];

    this.addGround();
    this.addBackground();
    this.addPlayers();

}

AllScene.prototype.addPlayers = function() {
    this.players = [];
    for(let i=0; i<total; i++){
        setTimeout(()=>{
            this.players[i] = this.physics.add.sprite((800/total)*i, Math.random()*100, 'player'+i);
            this.players[i].body.airAcceleration = 600;
            this.players[i].target = this.players[i].y+410;
            this.players[i].body.setSize(20, 48);
            this.players[i].body.setOffset(40, 30);
            this.addWalkAnimations(i);
            // this.players[i].anims.play(directionsArr[Math.round(Math.random()*directionsArr.length-1)]+i, true);
            this.players[i].anims.play('walkForward'+i, true);
        }, Math.random()*10000);
    }
}

AllScene.prototype.addGround = function() {
    this.ground = this.add.tileSprite(0, 600, 800 * 2, 32, 'platform').setOrigin(0, 1).setScale(2);
}

AllScene.prototype.addBackground = function() {
    this.background = this.add.tileSprite(0, 0, 800 * 500, 600, 'background').setOrigin(0, 0).setScrollFactor(0.5);
}

AllScene.prototype.update = function() {
    for(let i=0; i<total; i++){
        if(this.players[i] && this.players[i].y >= this.players[i].target){
            this.players[i].y = this.players[i].target;
            this.players[i].body.allowGravity = false;
        }
    }
}

AllScene.prototype.addWalkAnimations = function(index) {
    this.anims.create({
        key: 'walkForward'+index,
        frames: this.anims.generateFrameNumbers('player'+index, { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'walkLeft'+index,
        frames: this.anims.generateFrameNumbers('player'+index, { start: 6, end: 11 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'walkBackward'+index,
        frames: this.anims.generateFrameNumbers('player'+index, { start: 12, end: 17 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'walkRight'+index,
        frames: this.anims.generateFrameNumbers('player'+index, { start: 18, end: 23 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'idleForward'+index,
        frames: this.anims.generateFrameNumbers('player'+index, { start: 24, end: 29 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'idleLeft'+index,
        frames: this.anims.generateFrameNumbers('player'+index, { start: 30, end: 35 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'idleBackward'+index,
        frames: this.anims.generateFrameNumbers('player'+index, { start: 36, end: 41 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'idleRight'+index,
        frames: this.anims.generateFrameNumbers('player'+index, { start: 42, end: 48 }),
        frameRate: 10,
        repeat: -1
    });
}