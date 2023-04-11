class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }
    // ...
}

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }
    // ...
}

// StartScene
StartScene.prototype.preload = function() {
    this.load.image('startButton', 'assets/startButton.png');
    this.load.image('background', 'assets/background.png');
}

StartScene.prototype.create = function() {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    this.background = this.add.tileSprite(0, 0, 800, 600, 'background').setOrigin(0, 0).setScrollFactor(1);

    this.add.text(centerX, 40, 'PixelBroker Run', {
        fontSize: '32px',
        color: '#ffffff'
    }).setOrigin(0.5);

    const startButton = this.add.image(centerX, centerY, 'startButton').setInteractive();
    startButton.on('pointerdown', () => {
        this.scene.start('MainScene');
    });
}

function go(){
    let id = document.querySelector("#token").value;
    window.location = window.location.href.split('?')[0] + '?id=' + id;
}

// MainScene
MainScene.prototype.preload = function() {
    this.load.image('background', 'assets/background.png');
    var url = new URL(window.location);
    var id = url.searchParams.get("id");
    if(id){
        document.querySelector("#token").value = id;
    } else {
        id = 0;
    }
    this.load.spritesheet('player', 'https://cb-media.sfo3.cdn.digitaloceanspaces.com/pixelbrokers/current/sprites/'+id+'.png', { frameWidth: 96, frameHeight: 96 });
    this.load.image('platform', 'assets/platform.png');
    this.load.image('square', 'assets/square.png');
}

MainScene.prototype.scrollBackground = function() {
    const camX = this.cameras.main.scrollX;
    const camY = this.cameras.main.scrollY;
    this.background.tilePositionX = (camX * 0.5) % this.background.width;
    this.background.tilePositionY = (camY * 0.5) % this.background.height;
}

MainScene.prototype.create = function() {
    this.speed = 100;
    this.jumping = false;
    this.direction = 'idleForward';
    this.jumpLocation = 0;

    this.ground = this.add.tileSprite(0, 600, 800 * 2, 32, 'platform').setOrigin(0, 1).setScale(2);
    this.background = this.add.tileSprite(0, 0, 800 * 40, 600, 'background').setOrigin(0, 0).setScrollFactor(0.5);
    this.player = this.physics.add.sprite(352, 600, 'player');
    this.player.body.setSize(20, 48);

    // Set an offset for the player's physics body (x, y)

    this.player.body.setOffset(40, 30);

    // Initialize the score and create a text object to display it
    this.score = 0;
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' }).setScrollFactor(0);

    // Initialize the squares group and spawn a square at a random interval
    this.squares = this.physics.add.group();
    this.spawnSquare();
    this.physics.add.collider(this.player, this.squares, this.collectSquare, null, this);

    // Create animations
    this.anims.create({
        key: 'walkForward',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'walkLeft',
        frames: this.anims.generateFrameNumbers('player', { start: 6, end: 11 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'walkBackward',
        frames: this.anims.generateFrameNumbers('player', { start: 12, end: 17 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'walkRight',
        frames: this.anims.generateFrameNumbers('player', { start: 18, end: 23 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'idleForward',
        frames: this.anims.generateFrameNumbers('player', { start: 24, end: 29 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'idleLeft',
        frames: this.anims.generateFrameNumbers('player', { start: 30, end: 35 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'idleBackward',
        frames: this.anims.generateFrameNumbers('player', { start: 36, end: 41 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'idleRight',
        frames: this.anims.generateFrameNumbers('player', { start: 42, end: 48 }),
        frameRate: 10,
        repeat: -1
    });

    this.player.anims.play('idleForward', true);

    // Add keyboard input
    this.cursors = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        space: Phaser.Input.Keyboard.KeyCodes.SPACE
    });

    this.cameras.main.setBounds(0, 0, 800 * 40, 600);
    this.cameras.main.startFollow(this.player);
}

MainScene.prototype.updateScore = function() {
    this.scoreText.setText('Score: ' + this.score);
}


MainScene.prototype.update = function() {
    this.scrollBackground();
    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-this.speed);
        this.player.anims.play('walkLeft', true);
        this.direction = 'idleLeft';
    }
    if (this.cursors.right.isDown) {
        this.player.setVelocityX(this.speed);
        this.player.anims.play('walkRight', true);
        this.direction = 'idleRight';
    } 

    if(!this.jumping){
        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-this.speed);
            this.player.anims.play('walkBackward', true);
            this.direction = 'idleBackward';
        }
        if (this.cursors.down.isDown) {
            this.player.setVelocityY(this.speed);
            this.player.anims.play('walkForward', true);
            this.direction = 'idleForward';
        } 
    }
    if(!this.cursors.left.isDown && !this.cursors.right.isDown){
        this.player.setVelocityX(0);
    }
    if(!this.cursors.up.isDown && !this.cursors.down.isDown && !this.jumping){
        this.player.setVelocityY(0);
    }
    if(!this.cursors.left.isDown && 
        !this.cursors.right.isDown && 
        !this.cursors.up.isDown &&
        !this.cursors.down.isDown) {
        if(!this.jumping){
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
        }
        this.player.anims.play(this.direction, true);
    }

    // Custom checks for the player's x and y positions
    this.player.x = Math.min(Math.max(this.player.x, 0), 800 * 40);
    if(!this.jumping){
        if (this.cursors.space.isDown){
            this.player.setVelocityY(-200);
            this.jumping = true;
            this.jumpLocation = this.player.y;
            this.player.body.allowGravity = true;
            console.log('Jump:', this.jumpLocation);
        }
        this.jumpLocation = this.player.y;
        this.player.y = Math.min(Math.max(this.player.y, 480), 540);
    } else {
        // landed when they took off
        if(this.player.y > this.jumpLocation){
            console.log('Jump END:');
            this.jumping = false;
            this.player.body.allowGravity = false;
        }
        this.player.y = Math.min(this.player.y, this.jumpLocation);
    }

    // hack to stop the jittering at ground level
    if(this.player.y > 539){
        this.player.y = 539;
    }

    this.ground.x = this.player.x - 400;
}

MainScene.prototype.collectSquare = function(player, square) {
    square.disableBody(true, true);
    this.score += 10;
    this.updateScore();

    // If all squares are collected, spawn a new square
    if (this.squares.countActive() === 0) {
        this.spawnSquare();
        this.speed += 1;
    }
}

MainScene.prototype.spawnSquare = function() {
    const square = this.squares.create(this.player.x + (400 * Math.random()), 400 + (100 * Math.random()), 'square');
    square.setBounceY(Phaser.Math.FloatBetween(0.1, 0.2));
    square.body.setAllowGravity(false);
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [StartScene, MainScene]
};
const game = new Phaser.Game(config);