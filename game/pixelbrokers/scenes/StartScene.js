class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }
}

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