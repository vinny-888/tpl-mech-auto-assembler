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
    scene: [StartScene, MainScene],
    zoom: 1.5
    // postUpdate: postUpdate
};
const game = new Phaser.Game(config);

function changePixelBroker(){
    let id = document.querySelector("#token").value;
    window.location = window.location.href.split('?')[0] + '?id=' + id;
}