let canvas = null;
var ctx = null;
let width = 1600;
let height = 1760;
let BASE_URL = 'https://cb-media.sfo3.cdn.digitaloceanspaces.com/mechs/templates/';

let style_urls = {
    action_bot_3000: 'action_bot_3000.webp',
    alatyr: 'alatyr.webp',
    amalgam: 'amalgam.webp',
    arcane_guardian: 'arcane_guardian.webp',
    astra_machina: 'astra_machina.webp',
    bladerunner: 'bladerunner.webp',
    buildy_bot: 'buildy_bot.webp',
    'camm-e': 'camm-e.webp',
    chopshop: 'chopshop.webp',
    creative_deviant: 'creative_deviant.webp',
    cyberknight: 'cyberknight.webp',
    cyberracer: 'cyberracer.webp',
    deadpoint: 'deadpoint.webp',
    demolisher: 'demolisher.webp',
    dj_lux: 'dj_lux.webp',
    draconian: 'draconian.webp',
    fathom: 'fathom.webp',
    forgotten_friend: 'forgotten_friend.webp',
    gigazilla: 'gigazilla.webp',
    hellspawn: 'hellspawn.webp',
    hoarfrost: 'hoarfrost.webp',
    incarnate: 'incarnate.webp',
    lonestar: 'lonestar.webp',
    lycan_x: 'lycan_x.webp',
    magi: 'magi.webp',
    major_gunner: 'major_gunner.webp',
    marrow_lord: 'marrow_lord.webp',
    masamune: 'masamune.webp',
    mecha_kong: 'mecha_kong.webp',
    missingno: 'missingno..webp',
    'mr._grif': 'mr._grif.webp',
    'nekochan!': 'nekochan!.webp',
    'nekogrowl!': 'nekogrowl!.webp',
    nullstatic: 'nullstatic.webp',
    oberon: 'oberon.webp',
    ouroboros: 'ouroboros.webp',
    queen_andromeda: 'queen_andromeda.webp',
    red_alert: 'red_alert.webp',
    scheherazade: 'scheherazade.webp',
    shopbot: 'shopbot.webp',
    sir_furnace_cogswell: 'sir_furnace_cogswell.webp',
    the_duchess: 'the_duchess.webp',
    the_goddess: 'the_goddess.webp',
    the_oni_king: 'the_oni_king.webp',
    the_sentinel: 'the_sentinel.webp',
    wasteland_warlord: 'wasteland_warlord.webp',
    wasteland_wonder: 'wasteland_wonder.webp',
    witchwood: 'witchwood.webp',
    wowee: 'wowee.webp',
    xxliquidatorxx: 'xxliquidatorxx.webp',
};

function createCanvas(){
    canvas = document.getElementById('renderCanvas');
    ctx = canvas.getContext('2d');
}

function render(head, body, legs, left_arm, right_arm){
    ctx.clearRect(0, 0, width, height);
    renderHead(head);
    renderLegs(legs);
    renderLeftArm(left_arm);
    renderRightArm(right_arm);
    renderBody(body);
}

function renderHead(head){
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(400, 0);
    ctx.lineTo(width/2, 400);
    ctx.lineTo(width-400, 0);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(head, 0, 0);
    ctx.restore();
}

function renderBody(body){
    let sizeX = 180;
    let sizeY = 100;
    let offsetY = -300;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(width/2-sizeX+100, height/2+offsetY-sizeY-100);

    ctx.lineTo(width/2+sizeX-100, height/2+offsetY-sizeY-100);

    ctx.lineTo(width/2+sizeX, height/2+offsetY+sizeY);
    
    ctx.lineTo(width/2, height/2+offsetY+sizeY+200);

    ctx.lineTo(width/2-sizeX, height/2+offsetY+sizeY);

    ctx.lineTo(width/2-sizeX+100, height/2+offsetY-sizeY-100);

    ctx.closePath();
    ctx.clip();
    ctx.drawImage(body, 0, 0);
    ctx.restore();
}

function renderLegs(legs){
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.moveTo(0, height-300);
    ctx.lineTo(width/2, 400);
    ctx.lineTo(width, height-300);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(legs, 0, 0);
    ctx.restore();
}

function renderLeftArm(left_arm){
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(400, 0);
    ctx.lineTo(width/2, 400);
    ctx.lineTo(0, height-300);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(left_arm, 0, 0);
    ctx.restore();
}

function renderRightArm(right_arm){
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(width, 0);
    ctx.moveTo(width-400, 0);
    ctx.lineTo(width/2, 400);
    ctx.lineTo(width, height-300);
    ctx.lineTo(width, 0);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(right_arm, 0, 0);
    ctx.restore();
}

function showPreview(head, body, legs, left_arm, right_arm){
    if(!canvas){
        createCanvas();
    }

    // Create an image element
    var headImg = null;
    var bodyImg = null;
    var legsImg = null;
    var left_armImg = null;
    var right_armImg = null;

    if(head == 'CAMM-E'){
        head = 'camm-e';
    }
    if(body == 'CAMM-E'){
        body = 'camm-e';
    }
    if(legs == 'CAMM-E'){
        legs = 'camm-e';
    }
    if(right_arm == 'CAMM-E'){
        right_arm = 'camm-e';
    }
    if(left_arm == 'CAMM-E'){
        left_arm = 'camm-e';
    }

    head = head.toLowerCase().replaceAll(' ', '-').replaceAll('-', '_');
    body = body.toLowerCase().replaceAll(' ', '-').replaceAll('-', '_');
    legs = legs.toLowerCase().replaceAll(' ', '-').replaceAll('-', '_');
    left_arm = left_arm.toLowerCase().replaceAll(' ', '-').replaceAll('-', '_');
    right_arm = right_arm.toLowerCase().replaceAll(' ', '-').replaceAll('-', '_');

    if(head != ''){
        headImg = document.createElement('IMG');
        headImg.src = BASE_URL + style_urls[head.toLowerCase()];
    }
    if(body != ''){
        bodyImg = document.createElement('IMG');
        bodyImg.src = BASE_URL + style_urls[body.toLowerCase()];
    }

    if(legs != ''){
        legsImg = document.createElement('IMG');
        legsImg.src = BASE_URL + style_urls[legs.toLowerCase()];
    }

    if(left_arm != ''){
        left_armImg = document.createElement('IMG');
        left_armImg.src = BASE_URL + style_urls[left_arm.toLowerCase()];
    }

    if(right_arm != ''){
        right_armImg = document.createElement('IMG');
        right_armImg.src = BASE_URL + style_urls[right_arm.toLowerCase()];
    }
    createImages(headImg, bodyImg, legsImg, left_armImg, right_armImg);
}

function createImages(head, body, legs, left_arm, right_arm){
    let loadedCount = 0;
    if(head){
        head.onload = function () {
            loadedCount++;
            if(loadedCount == 5){
                render(head, body, legs, left_arm, right_arm);
            }
        }
    } else {
        loadedCount++;
    }
    if(legs){
        legs.onload = function () {
            loadedCount++;
            if(loadedCount == 5){
                render(head, body, legs, left_arm, right_arm);
            }
        }
    } else {
        loadedCount++;
    }
    if(left_arm){
        left_arm.onload = function () {
            loadedCount++;
            if(loadedCount == 5){
                render(head, body, legs, left_arm, right_arm);
            }
        }
    } else {
        loadedCount++;
    }
    if(right_arm){
        right_arm.onload = function () {
            loadedCount++;
            if(loadedCount == 5){
                render(head, body, legs, left_arm, right_arm);
            }
        }
    } else {
        loadedCount++;
    }
    if(body){
        body.onload = function () {
            loadedCount++;
            if(loadedCount == 5){
                render(head, body, legs, left_arm, right_arm);
            }
        }
    } else {
        loadedCount++;
    }
}

