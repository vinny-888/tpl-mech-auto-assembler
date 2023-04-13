class Tomato extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, 'player');

        this.scene = config.scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        this.setScale(1);
        // this.body.setSize(14, 20);
        // this.body.setOffset(2, 5);

        this.body.setSize(20, 48);
        this.body.setOffset(40, 30);
        this.body.setBounce(0.2);

        this.jumping = false;

        this.addWalkAnimations();

        this.anims.play('idleForward');
        this.prevMov = 'idleForward';

        this.hitDelay = false;

        this.cursor = this.scene.input.keyboard.createCursorKeys();

        this.life = 3;

        

    }

    
    addWalkAnimations() {
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

    update() {
        if(this.cursor.left.isDown) {
            this.body.setVelocityX(-200);
            this.flipX = true;
            if(this.prevMov !== 'walkLeft' && !this.jumping) {
                this.prevMov = 'walkLeft';
                this.anims.play('walkLeft');
            }
        } else if(this.cursor.right.isDown) {
            this.body.setVelocityX(200);
            this.flipX = false;
            if(this.prevMov !== 'walkRight' && !this.jumping) {
                this.prevMov = 'walkRight';
                this.anims.play('walkRight');
            }

        } else if(this.cursor.down.isDown && !this.jumping) {
            this.body.setVelocityX(0);
            // this.body.setSize(14, 15);
            // this.body.setOffset(2, 10);

            if(this.prevMov !== 'walkForward' && !this.jumping) {
                this.prevMov = 'walkForward';
                this.anims.play('walkForward');
            }

        }
        else {
            this.body.setVelocityX(0);
            // this.body.setSize(14, 20);
            // this.body.setOffset(2, 5);
            if(this.prevMov !== 'idleForward' && !this.jumping) {
                this.prevMov = 'idleForward';
                this.anims.play('idleForward');
            }
        }

        if(Phaser.Input.Keyboard.JustDown(this.cursor.up) && !this.jumping) {
            this.jumping = true;
            this.body.setVelocityY(-800);
            if(this.prevMov !== 'walkForward') {
                this.prevMov = 'walkForward';
                this.anims.play('walkForward');
            }
        } else if(this.body.blocked.down) {
            this.jumping = false;
        }
    }

    bombCollision() {
        if(!this.hitDelay) {
            this.hitDelay = true;

            this.scene.sound.play('draw');
            this.life--;
            this.scene.registry.events.emit('remove_life');

            if(this.life === 0) {
                this.scene.registry.events.emit('game_over');
            }

            this.setTint(0x1abc9c);
            this.scene.time.addEvent({
                delay: 600,
                callback: () => {
                    this.hitDelay = false;
                    this.clearTint();
                }
            });
        }
    }
}

export default Tomato;