class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }
}

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
    this.load.image('block', 'assets/block.png');
}

MainScene.prototype.create = function() {
    this.minFallSpeed = 150;
    this.speed = 100;
    this.jumping = false;
    this.falling = false;
    this.direction = 'idleForward';
    this.jumpLocation = 0;
    this.onPlatform = false;
    this.prevOnPlatform = false;

    this.addGround();
    this.addBackground();
    this.addPlayer();
    this.addScore();
    this.addSquares();
    this.addPlatforms();
    this.addWalkAnimations();
    this.addControls();
    this.addCamera();

}

MainScene.prototype.update = function() {
    this.scrollBackground();
    this.handleInput();

    // hack to stop the jittering at ground level
    if(this.player.y >= 539){
        this.player.y = 538;
    }

    this.ground.x = this.player.x - 400;
    postUpdate();
}

function postUpdate() {
    // Check if the player is no longer on a platform
    if (this.prevOnPlatform && !this.onPlatform) {
        console.log('Player is no longer on a platform');
        if (this.player.body.velocity.y < minFallSpeed) {
            this.player.setVelocityY(minFallSpeed);
        }
    }

    // Update the previous playerOnPlatform state
    this.prevOnPlatform = this.onPlatform;

    // Reset the playerOnPlatform variable for the next frame
    this.onPlatform = false;
}

MainScene.prototype.scrollBackground = function() {
    const camX = this.cameras.main.scrollX;
    const camY = this.cameras.main.scrollY;
    this.background.tilePositionX = (camX * 0.5) % this.background.width;
    this.background.tilePositionY = (camY * 0.5) % this.background.height;
}

MainScene.prototype.updateScore = function() {
    this.scoreText.setText('Score: ' + this.score);
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

MainScene.prototype.addScore = function() {
    this.score = 0;
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' }).setScrollFactor(0);
}

MainScene.prototype.addPlayer = function() {
    this.player = this.physics.add.sprite(352, 600, 'player');
    this.player.body.airAcceleration = 600;
    this.player.body.setSize(20, 48);
    // Set an offset for the player's physics body (x, y)
    this.player.body.setOffset(40, 30);
    this.player.anims.play('idleForward', true);
}

MainScene.prototype.addGround = function() {
    this.ground = this.add.tileSprite(0, 600, 800 * 2, 32, 'platform').setOrigin(0, 1).setScale(2);
}

MainScene.prototype.addBackground = function() {
    this.background = this.add.tileSprite(0, 0, 800 * 500, 600, 'background').setOrigin(0, 0).setScrollFactor(0.5);
}

MainScene.prototype.addControls = function() {
     this.cursors = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        space: Phaser.Input.Keyboard.KeyCodes.SPACE,
        shift: Phaser.Input.Keyboard.KeyCodes.SHIFT
    });
}

MainScene.prototype.addCamera = function() {
    this.cameras.main.setBounds(0, 0, 800 * 40, 600);
    this.cameras.main.startFollow(this.player);
}

MainScene.prototype.addSquares = function() {
    this.squares = this.physics.add.group();
    // this.spawnSquare();
    this.physics.add.collider(this.player, this.squares, this.collectSquare, null, this);
}

MainScene.prototype.spawnSquare = function(x, y) {
    const square = this.squares.create(this.player.x + (x + 50 * Math.random()), y - (75 + 75 * Math.random()), 'square');
    square.body.setAllowGravity(false);

    this.physics.add.collider(this.player, this.squares, this.collectSquare, null, this);
}

MainScene.prototype.playerOnPlatform = function(player, block) {
    if (player.body.touching.down && block.body.touching.up) {
        this.stopJumping();
        this.onPlatform = true;
        this.falling = false;
    }
}

MainScene.prototype.addPlatforms = function() {
    this.blocks = this.physics.add.staticGroup();
    this.spawnPlatforms();
    this.physics.add.collider(this.player, this.blocks, this.playerOnPlatform, null, this);
}

MainScene.prototype.spawnPlatforms = function() {
    let lastLoc = 475;
    let dist = 120;
    for(let i=0;i<500; i++){
        let offset = 0;
        if(lastLoc < 100){
            offset = 50;
        } else if(i <= 5 && lastLoc > 475){
            offset = -50;
        } else if(i > 5 && lastLoc > 375){
            offset = -50;
        } else if(i > 25 && lastLoc > 300){
            offset = -50;
        } else if(i > 50 && lastLoc > 250){
            offset = -50;
        } else if(i > 100 && lastLoc > 200){
            offset = -50;
        }

        let y = lastLoc + (50+offset - (50 * Math.random()));

        let x = this.player.x + 200 + (dist * i+1);
        const block = this.blocks.create(x, y, 'block');
        block.setImmovable(true);
        lastLoc = y;

        this.spawnSquare(x, y);
    }
}

MainScene.prototype.startJumping = function() {
    this.player.body.allowGravity = true;
    this.jumping = true;
    this.jumpLocation = this.player.y;
    this.player.setVelocityY(-200);
}

MainScene.prototype.stopJumping = function() {
    this.jumping = false;
}

MainScene.prototype.handleInput = function() {
    if (this.cursors.shift.isDown){
        this.speed = 300;
    } else {
        this.speed = 100;
    }
    if(!this.jumping && !this.falling){
        if (this.cursors.up.isDown && !this.onPlatform) {
            this.player.setVelocityY(-this.speed);
            if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
                this.player.anims.play('walkBackward', true);
                this.direction = 'idleBackward';
            }
        }
        if (this.cursors.down.isDown && !this.onPlatform) {
            this.player.setVelocityY(this.speed);
            if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
                this.player.anims.play('walkForward', true);
                this.direction = 'idleForward';
            }
        } 
    }

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

    if(!this.cursors.left.isDown && !this.cursors.right.isDown){
        this.player.setVelocityX(0);
    }
    if(!this.cursors.up.isDown && !this.cursors.down.isDown && !this.jumping && !this.falling){
        this.player.setVelocityY(0);
    }
    if(!this.cursors.left.isDown && 
        !this.cursors.right.isDown && 
        !this.cursors.up.isDown &&
        !this.cursors.down.isDown) {
        if(!this.jumping && !this.falling){
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
            this.player.body.allowGravity = false;
        }
        this.player.anims.play(this.direction, true);
    }

    // Custom checks for the player's x and y positions
    this.player.x = Math.min(Math.max(this.player.x, 0), 800 * 40);
    if(!this.jumping){
        if (this.cursors.space.isDown && !this.falling){
            this.startJumping();
        }
        if(!this.onPlatform){
            console.log('!this.onPlatform');
            this.player.y = Math.min(Math.max(this.player.y, 480), 540);
        }
        // If not jumping and above the ground enable gravity
        if(this.player.y < 480){
            this.player.body.allowGravity = true;
            this.falling = true;
        } else {
            this.falling = false;
            this.onPlatform = false;
        }
    } else {
        // landed where they took off
        if(this.player.y > this.jumpLocation){
            console.log('this.player.y > this.jumpLocation');
            this.stopJumping();
            this.player.y = this.jumpLocation;
        }
        
    }
}

MainScene.prototype.addWalkAnimations = function() {
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
}