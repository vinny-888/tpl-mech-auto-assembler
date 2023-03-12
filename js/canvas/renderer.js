let canvas = null;
var ctx = null;
let width = 1600;
let height = 1760;
let glowScale = 1.43626570916;
let BASE_URL = '../tpl-mech-auto-assembler/images/templates/';
let BASE_GLOW_URL = '../tpl-mech-auto-assembler/images/masks/';
// let BASE_URL = '../images/templates/';
// let BASE_GLOW_URL = '../images/masks/';
let imageCache = {};
let imageGlowCache = {};
let style_urls = {
    action_bot_3000: 'action_bot_3000.webp',
    alatyr: 'alatyr.webp',
    amalgam: 'amalgam.webp',
    arcane_guardian: 'arcane_guardian.webp',
    astra_machina: 'astra_machina.webp',
    bladerunner: 'bladerunner.webp',
    buildy_bot: 'buildy_bot.webp',
    'camm_e': 'camm-e.webp',
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
let afterglowColors = {
    'The One': ['#4D00FF', '#FFD700'],
    'True Belief': ['#FF1493', '#DBD4D4'],
    'Deva\'s Breath': ['#FF00FF', '#CEFF00'], 
    'Wildstyle Monarch': ['#18F905', '#00DFFF'], 
    'Singularity Prophet': ['#808000', '#9D2B8B'], 
    'Quid Pro Quo': ['#8B0000', '#ECA506'], 
    'Blood Money': ['#FF0000', '#CF0039'], 
    'Xenoform Unknown': ['#BBFF00', '#2155FF'], 
    'Pink Parser': ['#FFC3D6', '#2D4460'], 
    'Bone and Flesh': ['#FFFFFF', '#BD3943'], 
    'Circuit Overload': ['#000080', '#00FF00'], 
    'Ethereal Dream': ['#ABFBFB', '#D92AD9'], 
    'Double Spend': ['#FF8C00', '#FFE200'], 
    'Tsujigiri Slash': ['#FF0000', '#1A1A1A'], 
    'Institutional Pedigree': ['#1E90FF', '#E6E6E6'], 
    'Eldritch Descent': ['#9510AC', '#1A37E6'], 
    'Closed Captioning': ['#00FFFF', '#1A1A1A'], 
    'Hallowed Grounds': ['#000000', '#007300'], 
    'Cosmic Squid Pink': ['#FF00FF'],
    'Stationary Green': ['#18F905'],
    'Broken Sky Blue': ['#00FFFF'],
    'Precious Cargo Green': ['#BBFF00'],
    'Enigma Yellow': ['#FFF000'],
    'Reaction Time Red': ['#FF0000'],
    'Phishing Gold': ['#FAC710'],
    'Existential Pink': ['#FFC3D6'],
    'Lost-in-the-Crowd Orange': ['#FF8C00'],
    'Escapist Magenta': ['#FF1493'],
    'Stonefaced Sapphire': ['#1E90FF'],
    'Fixer Plum': ['#9510AC'],
    'Backdoor Burgundy': ['#8B0000'],
    'Takedown Green': ['#808000'],
    'Seeker Green': ['#00806A'],
    'Abundant Blue': ['#000080'],
    'Tabula Rasa White': ['#FFFFFF'],
    'Common Lavender': ['#E6B6E6'],
    'Starter Green': ['#1DC267'],
    'ShaDAO Black': ['#000000']
  };

// Object.keys(style_urls).forEach((style)=>{
//     console.log(BASE_URL+style+'.webp');
// })

function createCanvas(){
    canvas = document.getElementById('renderCanvas');
    ctx = canvas.getContext('2d', {willReadFrequently: true});
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function render(head, body, legs, left_arm, right_arm, headGlow, bodyGlow, legsGlow, left_armGlow, right_armGlow, afterglow_style){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let canvasTemp = document.getElementById("temp_canvas");
    let ctxTemp = canvasTemp.getContext("2d");
    ctxTemp.clearRect(0, 0, canvasTemp.width, canvasTemp.height);


    let canvasOutput = document.getElementById("glow_resized_output_canvas");
    let ctxOutput = canvasOutput.getContext("2d");
    ctxOutput.clearRect(0, 0, canvasOutput.width, canvasOutput.height);

    if(head){
        renderHead(head, headGlow, afterglow_style);
    }
    if(legs){
        renderLegs(legs, legsGlow, afterglow_style);
    }
    if(left_arm){
        renderLeftArm(left_arm, left_armGlow, afterglow_style);
    }
    if(right_arm){
        renderRightArm(right_arm, right_armGlow, afterglow_style);
    }
    if(body){
        renderBody(body, bodyGlow, afterglow_style);
    }
    // if(glow){
    //     renderGlow(glow);
    // }
}

function renderGlow(glow, afterglow_style){

    let canvasSmallGlow = document.getElementById("glow_small_canvas");
    let ctxSmallGlow = canvasSmallGlow.getContext("2d");
    ctxSmallGlow.clearRect(0, 0, canvasSmallGlow.width, canvasSmallGlow.height);

    let resize_output_canvas = document.getElementById('glow_resized_output_canvas');
    let ctxResizedOutputGlow = resize_output_canvas.getContext("2d", {willReadFrequently: true});
    ctxResizedOutputGlow.clearRect(0, 0, resize_output_canvas.width, resize_output_canvas.height);

    let resize_canvas = document.getElementById('glow_resized_canvas');
    let ctxResizedGlow = resize_canvas.getContext("2d", {willReadFrequently: true});
    ctxResizedGlow.clearRect(0, 0, resize_canvas.width, resize_canvas.height);

    let canvasTemp = document.getElementById("temp_canvas");
    let ctxTemp = canvasTemp.getContext("2d");
    ctxTemp.clearRect(0, 0, canvasTemp.width, canvasTemp.height);

    if(!glow || glow.width == 0){
        return;
    }
    let sourceImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixelData = sourceImageData.data;

    ctxSmallGlow.drawImage(glow,0,0);

    resample_single(canvasSmallGlow, resize_canvas, 1600, 1760);
    
    let imgd = ctxResizedGlow.getImageData(0, 0, 1600, 1760);
    let pix = imgd.data;
    let uniqueColor = [255,0,0]; // Pink for an example, can change this value to be anything.
    if(afterglow_style){
        let colors =  afterglow_style.split(',');
        if(colors.length == 1){
            var aRgbHex = colors[0].replace('#', '').match(/.{1,2}/g);
            var aRgb = [
                parseInt(aRgbHex[0], 16),
                parseInt(aRgbHex[1], 16),
                parseInt(aRgbHex[2], 16)
            ];
            uniqueColor = aRgb;
            console.log('Color set: ', colors[0]);
        } else {
            // TODO
            var aRgbHex = colors[0].replace('#', '').match(/.{1,2}/g);
            var aRgb = [
                parseInt(aRgbHex[0], 16),
                parseInt(aRgbHex[1], 16),
                parseInt(aRgbHex[2], 16)
            ];
            uniqueColor = aRgb;
            console.log('Color set: ', colors[0]);
        }
    }
    let transparentColor = [255,255,255, 0];
    // Loops through all of the pixels and modifies the components.
    for (var i = 0, n = pix.length; i <n; i += 4) {
        if (pix[i] == 255 &&  
            pix[i+1] == 255 &&
            pix[i+2] == 255)
        {
            
            pixelData[i] = uniqueColor[0];   // Red component
            pixelData[i+1] = uniqueColor[1]; // Blue component
            pixelData[i+2] = uniqueColor[2]; // Green component

            pix[i] = uniqueColor[0];   // Red component
            pix[i+1] = uniqueColor[1]; // Blue component
            pix[i+2] = uniqueColor[2]; // Green component
        }
        else
        {
            pix[i] = transparentColor[0];   // Red component
            pix[i+1] = transparentColor[1]; // Blue component
            pix[i+2] = transparentColor[2]; // Green component
            pix[i+3] = transparentColor[3];
        }
        //pix[i+3] is the transparency.
    }
    ctxResizedOutputGlow.putImageData(imgd, 0, 0);
    ctxTemp.putImageData(sourceImageData, 0, 0);
    return [ctxTemp, ctxResizedOutputGlow];
}

function renderHead(head, headGlow, afterglow_style){
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(400, 0);
    // ctx.lineTo(width/2-200, 450);
    ctx.lineTo(width/2, 450);
    // ctx.lineTo(width/2+200, 450);
    ctx.lineTo(width-400, 0);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(head, 0, 0);
    renderGlow(headGlow, afterglow_style);
    let resize_output_canvas = document.getElementById('glow_resized_output_canvas');
    ctx.drawImage(resize_output_canvas, 0, 0);
    let canvasTemp = document.getElementById("temp_canvas");
    ctx.drawImage(canvasTemp, 0, 0);
    ctx.restore();
}

function renderBody(body, bodyGlow, afterglow_style){
    let sizeX = 180;
    let sizeY = 100;
    let offsetY = -300;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(width/2-sizeX+100, height/2+offsetY-sizeY-100);
    ctx.lineTo(width/2+sizeX-100, height/2+offsetY-sizeY-100);
    ctx.lineTo(width/2+sizeX, height/2+offsetY+sizeY);
    // ctx.lineTo(width/2, height/2+offsetY+sizeY+200);
    ctx.lineTo(width/2-sizeX, height/2+offsetY+sizeY);
    ctx.lineTo(width/2-sizeX+100, height/2+offsetY-sizeY-100);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(body, 0, 0);
    renderGlow(bodyGlow, afterglow_style);
    let resize_output_canvas = document.getElementById('glow_resized_output_canvas');
    ctx.drawImage(resize_output_canvas, 0, 0);
    let canvasTemp = document.getElementById("temp_canvas");
    ctx.drawImage(canvasTemp, 0, 0);
    ctx.restore();
}

function renderLegs(legs, legsGlow, afterglow_style){
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
    
    renderGlow(legsGlow, afterglow_style);

    let resize_output_canvas = document.getElementById('glow_resized_output_canvas');
    ctx.drawImage(resize_output_canvas, 0, 0);

    let canvasTemp = document.getElementById("temp_canvas");
    ctx.drawImage(canvasTemp, 0, 0);

    ctx.restore();
}

function renderLeftArm(left_arm, left_armGlow, afterglow_style){
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
    renderGlow(left_armGlow, afterglow_style);

    let resize_output_canvas = document.getElementById('glow_resized_output_canvas');
    ctx.drawImage(resize_output_canvas, 0, 0);

    let canvasTemp = document.getElementById("temp_canvas");
    ctx.drawImage(canvasTemp, 0, 0);

    ctx.restore();
}

function renderRightArm(right_arm, right_armGlow, afterglow_style){
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
    renderGlow(right_armGlow, afterglow_style);

    let resize_output_canvas = document.getElementById('glow_resized_output_canvas');
    ctx.drawImage(resize_output_canvas, 0, 0);

    let canvasTemp = document.getElementById("temp_canvas");
    ctx.drawImage(canvasTemp, 0, 0);

    ctx.restore();
}

function showPreview(head, body, legs, left_arm, right_arm, afterglow_style){
    if(!canvas){
        createCanvas();
        Object.keys(style_urls).forEach((key)=>{
            imageCache[key] = {};
            imageGlowCache[key] = {};
        })
    }

    // Create an image element
    var headImg = null;
    var headGlowImg = null;
    var bodyImg = null;
    var bodyGlowImg = null;
    var legsImg = null;
    var legsGlowImg = null;
    var left_armImg = null;
    var left_armGlowImg = null;
    var right_armImg = null;
    var right_armGlowImg = null;

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

    if(head == 'MissingNo.'){
        head = 'missingno';
    }
    if(body == 'MissingNo.'){
        body = 'missingno';
    }
    if(legs == 'MissingNo.'){
        legs = 'missingno';
    }
    if(right_arm == 'MissingNo.'){
        right_arm = 'missingno';
    }
    if(left_arm == 'MissingNo.'){
        left_arm = 'missingno';
    }

    head = head.toLowerCase().replaceAll(' ', '-').replaceAll('-', '_');
    body = body.toLowerCase().replaceAll(' ', '-').replaceAll('-', '_');
    legs = legs.toLowerCase().replaceAll(' ', '-').replaceAll('-', '_');
    left_arm = left_arm.toLowerCase().replaceAll(' ', '-').replaceAll('-', '_');
    right_arm = right_arm.toLowerCase().replaceAll(' ', '-').replaceAll('-', '_');

    if(head != ''){// && (typeof imageCache[head].head  === 'undefined')){
        headImg = null;
        delete headImg;
        headImg = document.createElement('IMG');
        headImg.src = BASE_URL + style_urls[head];

        headGlowImg = null;
        delete headGlowImg;
        headGlowImg = document.createElement('IMG');
        headGlowImg.src = BASE_GLOW_URL + style_urls[head].replace('.webp', '_EmissiveMask.png');
    } 
    // else if(head != ''){
    //     headImg = imageCache[head].head;
    //     headGlowImg = imageGlowCache[head].head;
    // }

    if(body != ''){// && (typeof imageCache[body].body  === 'undefined')){
        bodyImg = null;
        delete bodyImg;
        bodyImg = document.createElement('IMG');
        bodyImg.src = BASE_URL + style_urls[body];

        bodyGlowImg = null;
        delete bodyGlowImg;
        bodyGlowImg = document.createElement('IMG');
        bodyGlowImg.src = BASE_GLOW_URL + style_urls[body].replace('.webp', '_EmissiveMask.png');
    } 
    // else if(body != ''){
    //     bodyImg = imageCache[body].body;
    //     bodyGlowImg = imageGlowCache[body].body;
    // }

    if(legs != ''){// && (typeof imageCache[legs].legs  === 'undefined')){
        legsImg = null;
        delete legsImg;
        legsImg = document.createElement('IMG');
        legsImg.src = BASE_URL + style_urls[legs];

        legsGlowImg = null;
        delete legsGlowImg;
        legsGlowImg = document.createElement('IMG');
        legsGlowImg.src = BASE_GLOW_URL + style_urls[legs].replace('.webp', '_EmissiveMask.png');
    } 
    // else if(legs != ''){
    //     legsImg = imageCache[legs].legs;
    //     legsGlowImg = imageGlowCache[legs].legs;
    // }

    if(left_arm != ''){// && (typeof imageCache[left_arm].left_arm  === 'undefined')){
        left_armImg = null;
        delete left_armImg;
        left_armImg = document.createElement('IMG');
        left_armImg.src = BASE_URL + style_urls[left_arm];

        left_armGlowImg = null;
        delete left_armGlowImg;
        left_armGlowImg = document.createElement('IMG');
        left_armGlowImg.src = BASE_GLOW_URL + style_urls[left_arm].replace('.webp', '_EmissiveMask.png?v=1');
    }
    //  else if(left_arm != ''){
    //     left_armImg = imageCache[left_arm].left_arm;
    //     left_armGlowImg = imageGlowCache[left_arm].left_arm;
    // }

    if(right_arm != ''){// && (typeof imageCache[right_arm].right_arm  === 'undefined')){
        right_armImg = null;
        delete right_armImg;
        right_armImg = document.createElement('IMG');
        right_armImg.src = BASE_URL + style_urls[right_arm];

        right_armGlowImg = null;
        delete right_armGlowImg;
        right_armGlowImg = document.createElement('IMG');
        right_armGlowImg.src = BASE_GLOW_URL + style_urls[right_arm].replace('.webp', '_EmissiveMask.png?v=2');
    } 
    // else if(right_arm != ''){
    //     right_armImg = imageCache[right_arm].right_arm;
    //     right_armGlowImg = imageGlowCache[right_arm].right_arm;
    // }
    createImages(headImg, bodyImg, legsImg, left_armImg, right_armImg, head, body, legs, left_arm, right_arm, headGlowImg, bodyGlowImg, legsGlowImg, left_armGlowImg, right_armGlowImg, afterglow_style);
}

function createImages(head, body, legs, left_arm, right_arm, headName, bodyName, legsName, left_armName, right_armName, headGlow, bodyGlow, legsGlow, left_armGlow, right_armGlow, afterglow_style){
    let loadedCount = 0;
    let loadedTotal = 10;
    let allCached = 0;
    if(head){// && (typeof imageCache[headName].head  === 'undefined')){
        head.onload = function () {
            imageCache[headName].head = head;
            loadedCount++;
            if(loadedCount == loadedTotal){
                render(head, body, legs, left_arm, right_arm, headGlow, bodyGlow, legsGlow, left_armGlow, right_armGlow, afterglow_style);
            }
        }
        headGlow.onload = function () {
            imageGlowCache[headName].head = head;
            loadedCount++;
            if(loadedCount == loadedTotal){
                render(head, body, legs, left_arm, right_arm, headGlow, bodyGlow, legsGlow, left_armGlow, right_armGlow, afterglow_style);
            }
        }
        headGlow.onerror = function(){
            loadedCount++;
        }
    } else {
        loadedCount+=2;
        allCached+=2;
    }
    if(legs){// && (typeof imageCache[legsName].legs  === 'undefined')){
        legs.onload = function () {
            imageCache[legsName].legs = legs;
            loadedCount++;
            if(loadedCount == loadedTotal){
                render(head, body, legs, left_arm, right_arm, headGlow, bodyGlow, legsGlow, left_armGlow, right_armGlow, afterglow_style);
            }
        }
        legsGlow.onload = function () {
            imageGlowCache[legsName].legs = legs;
            loadedCount++;
            if(loadedCount == loadedTotal){
                render(head, body, legs, left_arm, right_arm, headGlow, bodyGlow, legsGlow, left_armGlow, right_armGlow, afterglow_style);
            }
        }
        legsGlow.onerror = function(){
            loadedCount++;
        }
    } else {
        loadedCount+=2;
        allCached+=2;
    }
    if(left_arm){// && (typeof imageCache[left_armName].left_arm  === 'undefined')){
        left_arm.onload = function () {
            imageCache[left_armName].left_arm = left_arm;
            loadedCount++;
            if(loadedCount == loadedTotal){
                render(head, body, legs, left_arm, right_arm, headGlow, bodyGlow, legsGlow, left_armGlow, right_armGlow, afterglow_style);
            }
        }
        left_armGlow.onload = function () {
            imageGlowCache[left_armName].left_arm = left_arm;
            loadedCount++;
            if(loadedCount == loadedTotal){
                render(head, body, legs, left_arm, right_arm, headGlow, bodyGlow, legsGlow, left_armGlow, right_armGlow, afterglow_style);
            }
        }
        left_armGlow.onerror = function(){
            loadedCount++;
        }
    } else {
        loadedCount+=2;
        allCached+=2;
    }
    if(right_arm){// && (typeof imageCache[right_armName].right_arm  === 'undefined')){
        right_arm.onload = function () {
            imageCache[right_armName].right_arm = right_arm;
            loadedCount++;
            if(loadedCount == loadedTotal){
                render(head, body, legs, left_arm, right_arm, headGlow, bodyGlow, legsGlow, left_armGlow, right_armGlow, afterglow_style);
            }
        }
        right_armGlow.onload = function () {
            imageGlowCache[right_armName].right_arm = right_arm;
            loadedCount++;
            if(loadedCount == loadedTotal){
                render(head, body, legs, left_arm, right_arm, headGlow, bodyGlow, legsGlow, left_armGlow, right_armGlow, afterglow_style);
            }
        }
        right_armGlow.onerror = function(){
            loadedCount++;
        }
    } else {
        loadedCount+=2;
        allCached+=2;
    }
    if(body){// && (typeof imageCache[bodyName].body  === 'undefined')){
        body.onload = function () {
            imageCache[bodyName].body = body;
            loadedCount++;
            if(loadedCount == loadedTotal){
                render(head, body, legs, left_arm, right_arm, headGlow, bodyGlow, legsGlow, left_armGlow, right_armGlow, afterglow_style);
            }
        }
        bodyGlow.onload = function () {
            imageGlowCache[bodyName].body = body;
            loadedCount++;
            if(loadedCount == loadedTotal){
                render(head, body, legs, left_arm, right_arm, headGlow, bodyGlow, legsGlow, left_armGlow, right_armGlow, afterglow_style);
            }
        }
        bodyGlow.onerror = function(){
            loadedCount++;
        }
    } else {
        loadedCount+=2;
        allCached+=2;
    }
    if(allCached == loadedTotal){
        render(head, body, legs, left_arm, right_arm, headGlow, bodyGlow, legsGlow, left_armGlow, right_armGlow, afterglow_style);
    }
}

