"use strict";

let mechs = [];
let selectedAfterglow = null;
function init() {
  initTooltip();
  createMetadataLookup();
  loadParams();
}

window.addEventListener('load', async () => {
  init();
  // initDropdowns();
  addEventlisteners();
  populateAfterglowDropdown();
  updatePreview();
  loadMechs();
});

function populateAfterglowDropdown() {
  let select = document.getElementById('afterglow');
  let html = '';
  Object.keys(afterglowColors).forEach((afterglow)=>{
    let color = afterglowColors[afterglow];
    let selected = selectedAfterglow == afterglow ? 'selected' : '';

    html += '<option '+selected+' value="'+color.join(',')+'">'+afterglow+'</option>';
  })
  select.innerHTML = html;
}

function setParams(engine, head, body, legs, left_arm, right_arm, headColor, bodyColor, legsColor, left_armColor, right_armColor, color_strength, afterglow_name){
  window.history.pushState("", "", window.location.href.split('?')[0] + '?' 
  + 'engine=' + engine + '&' 
  + 'head=' + head + '&' 
  + 'body=' + body + '&' 
  + 'legs=' + legs + '&' 
  + 'left_arm=' + left_arm + '&' 
  + 'right_arm=' + right_arm + '&' 
  + 'headColor=' + headColor + '&' 
  + 'bodyColor=' + bodyColor + '&' 
  + 'legsColor=' + legsColor + '&' 
  + 'left_armColor=' + left_armColor + '&' 
  + 'right_armColor=' + right_armColor + '&' 
  + 'color_strength=' + color_strength + '&' 
  + 'afterglow=' + afterglow_name);
}

function loadParams(){
  var url = new URL(window.location);
  var engine = url.searchParams.get("engine");
  var head = url.searchParams.get("head");
  var body = url.searchParams.get("body");
  var legs = url.searchParams.get("legs");
  var left_arm = url.searchParams.get("left_arm");
  var right_arm = url.searchParams.get("right_arm");
  var headColor = url.searchParams.get("headColor");
  var bodyColor = url.searchParams.get("bodyColor");
  var legsColor = url.searchParams.get("legsColor");
  var left_armColor = url.searchParams.get("left_armColor");
  var right_armColor = url.searchParams.get("right_armColor");
  var color_strength = url.searchParams.get("color_strength");
  selectedAfterglow = url.searchParams.get("afterglow");
  if(engine){
    document.getElementById('engine_style').value = engine;
  }
  if(head){
    document.getElementById('head_style').value = head;
  }
  if(body){
    document.getElementById('body_style').value = body;
  }
  if(legs){
    document.getElementById('legs_style').value = legs;
  }
  if(left_arm){
    document.getElementById('left_arm_style').value = left_arm;
  }
  if(right_arm){
    document.getElementById('right_arm_style').value = right_arm;
  }

  if(headColor){
    document.getElementById('head_style_color').value = '#' + headColor;
  }
  if(bodyColor){
    document.getElementById('body_style_color').value = '#' + bodyColor;
  }
  if(legsColor){
    document.getElementById('legs_style_color').value = '#' + legsColor;
  }
  if(left_armColor){
    document.getElementById('left_arm_style_color').value = '#' + left_armColor;
  }
  if(right_armColor){
    document.getElementById('right_arm_style_color').value = '#' + right_armColor;
  }

  partColors['head'] = '#' + headColor;
  partColors['body'] = '#' + bodyColor;
  partColors['legs'] = '#' + legsColor;
  partColors['left_arm'] = '#' + left_armColor;
  partColors['right_arm'] = '#' + right_armColor;
  
  if(color_strength){
    document.getElementById('color_strength').value = color_strength;
    updateColorStrength();
  }
}

function loadMechs(){
  try{
    let saved = JSON.parse(localStorage.getItem('saved_mechs'));
    // saved = [];
    if(saved){
      console.log('loaded:', saved);
      mechs = saved;
      buildMechTable();
    }
  } catch(err){
    console.log('err:', err);
  }
}

function showMech(index){
  let mech = mechs[index];
  document.getElementById('engine_style').value = mech.engine;
  document.getElementById('head_style').value = mech.head;
  document.getElementById('body_style').value = mech.body;
  document.getElementById('legs_style').value = mech.legs;
  document.getElementById('left_arm_style').value = mech.left_arm;
  document.getElementById('right_arm_style').value = mech.right_arm;
  document.getElementById('afterglow').value = mech.afterglow;

  document.getElementById('head_style_color').value = '#' + mech.headColor;
  document.getElementById('body_style_color').value = '#' + mech.bodyColor;
  document.getElementById('legs_style_color').value = '#' + mech.legsColor;
  document.getElementById('left_arm_style_color').value = '#' + mech.left_armColor;
  document.getElementById('right_arm_style_color').value = '#' + mech.right_armColor;
  
  document.getElementById('color_strength').value = mech.color_strength;
  updateColorStrength();

  updatePreview();
}

function removeMech(index){
  mechs.splice(index, 1);
  saveMechs();
  buildMechTable();
}

const getBase64StringFromDataURL = (dataURL) =>
    dataURL.replace('data:', '').replace(/^.+,/, '');

function saveMech(){
  let canvas = document.getElementById('renderCanvas');
  let resize_canvas = document.getElementById('resize_canvas');
  resample_single(canvas, resize_canvas, 160, 176);//, 
  setTimeout(()=>{
    // (resezed_canvas)=>{
    let engine = document.getElementById('engine_style').value;
    let head = document.getElementById('head_style').value;
    let body = document.getElementById('body_style').value;
    let legs = document.getElementById('legs_style').value;
    let left_arm = document.getElementById('left_arm_style').value;
    let right_arm = document.getElementById('right_arm_style').value;

    let headColor = document.getElementById('head_style_color').value.replace('#', '');
    let bodyColor = document.getElementById('body_style_color').value.replace('#', '');
    let legsColor = document.getElementById('legs_style_color').value.replace('#', '');
    let left_armColor = document.getElementById('left_arm_style_color').value.replace('#', '');
    let right_armColor = document.getElementById('right_arm_style_color').value.replace('#', '');

    let color_strength = document.getElementById('color_strength').value;

    let afterglow = document.getElementById('afterglow').value;
    let img = resize_canvas.toDataURL();

    let endurance = document.getElementById('endurance_total').innerHTML;
    let speed = document.getElementById('speed_total').innerHTML;
    let power = document.getElementById('power_total').innerHTML;
    let total = document.getElementById('stats_total').innerHTML;

    // let img = getBase64StringFromDataURL(dataURL);
    mechs.push({
      engine,
      head,
      body,
      legs,
      left_arm,
      right_arm,
      headColor,
      bodyColor,
      legsColor,
      left_armColor,
      right_armColor,
      color_strength,
      afterglow,
      img,
      endurance,
      speed,
      power,
      total
    });

    saveMechs()
  }, 100)

  // TODO add to UI

}

function saveMechs(){
  localStorage.setItem('saved_mechs', JSON.stringify(mechs));
  console.log('saved:', mechs);
  buildMechTable();
}

function initDropdowns(){
  let engine = document.getElementById('engine_style');
  let head = document.getElementById('head_style');
  let body = document.getElementById('body_style');
  let legs = document.getElementById('legs_style');
  let left_arm = document.getElementById('left_arm_style');
  let right_arm = document.getElementById('right_arm_style');
  
  Object.keys(meta_parts).forEach((key, index)=>{
    let metadata = meta_parts[key];
    let model = metadata.find((att)=> att.trait_type == 'Model').value;
    let style = metadata.find((att)=> att.trait_type == 'Style').value;
    let part = metadata.find((att)=> att.trait_type == 'Part').value;

    let html = '<option value="'+(style)+'" '+(index == 0 ? 'selected' : '')+'>'+(style)+'</option>';

    if(part == 'Engine'){
      engine.innerHTML += html;
    } else if(part == 'Head'){
      head.innerHTML += html;
    } else if(part == 'Body'){
      body.innerHTML += html;
    } else if(part == 'Legs'){
      legs.innerHTML += html;
    } else if(part == 'Arm'){
      left_arm.innerHTML += html;
      right_arm.innerHTML += html;
    }
  });
}

function addEventlisteners(){
  let full_style = document.getElementById('full_style');
  let engine = document.getElementById('engine_style');
  let head = document.getElementById('head_style');
  let body = document.getElementById('body_style');
  let legs = document.getElementById('legs_style');
  let left_arm = document.getElementById('left_arm_style');
  let right_arm = document.getElementById('right_arm_style');
  let afterglow = document.getElementById('afterglow');

  full_style.onchange = updatePreviewFull;
  engine.onchange = updatePreview;
  head.onchange = updatePreview;
  body.onchange = updatePreview;
  legs.onchange = updatePreview;
  left_arm.onchange = updatePreview;
  right_arm.onchange = updatePreview;
  afterglow.onchange = updatePreview;
}

function getSelectedText(elementId) {
  var elt = document.getElementById(elementId);

  if (elt.selectedIndex == -1)
      return null;

  return elt.options[elt.selectedIndex].text;
}

function updatePreviewFull(){
  let fullStyle = getSelectedText('full_style');
  document.getElementById('engine_style').value = fullStyle;
  document.getElementById('head_style').value = fullStyle;
  document.getElementById('body_style').value = fullStyle;
  document.getElementById('legs_style').value = fullStyle;
  document.getElementById('left_arm_style').value = fullStyle;
  document.getElementById('right_arm_style').value = fullStyle;
  updatePreview();
}

function updatePreview(){
  let engine = document.getElementById('engine_style');
  let head = document.getElementById('head_style');
  let body = document.getElementById('body_style');
  let legs = document.getElementById('legs_style');
  let left_arm = document.getElementById('left_arm_style');
  let right_arm = document.getElementById('right_arm_style');
  let afterglow = document.getElementById('afterglow');


  let headColor = document.getElementById('head_style_color').value.replace('#', '');
  let bodyColor = document.getElementById('body_style_color').value.replace('#', '');
  let legsColor = document.getElementById('legs_style_color').value.replace('#', '');
  let left_armColor = document.getElementById('left_arm_style_color').value.replace('#', '');
  let right_armColor = document.getElementById('right_arm_style_color').value.replace('#', '');

  let color_strength = document.getElementById('color_strength').value;

  let engine_style = engine.value;
  let head_style = head.value;
  let body_style = body.value;
  let legs_style = legs.value;
  let left_arm_style = left_arm.value;
  let right_arm_style = right_arm.value;
  let afterglow_style = afterglow.value;

  setParams(engine_style, head_style, body_style, legs_style, left_arm_style, right_arm_style, headColor, bodyColor, legsColor, left_armColor, right_armColor, color_strength, getSelectedText('afterglow'));

  let enduranceTotal = 0;
  let speedTotal = 0;
  let powerTotal = 0;

  let engineFound = false;
  let headFound = false;
  let bodyFound = false;
  let legsFound = false;
  let leftArmFound = false;
  let rightArmFound = false;
  Object.keys(meta_parts).forEach((key, index)=>{
    let metadata = meta_parts[key];
    let model = metadata.find((att)=> att.trait_type == 'Model').value;
    let style = metadata.find((att)=> att.trait_type == 'Style').value;
    let part = metadata.find((att)=> att.trait_type == 'Part').value;
    let endurance = metadata.find((att)=> att.trait_type == 'Endurance').value;
    let speed = metadata.find((att)=> att.trait_type == 'Speed').value;
    let power = metadata.find((att)=> att.trait_type == 'Power').value;

    if(!engineFound && part == 'Engine' && engine_style == style){
        enduranceTotal+=endurance;
        speedTotal+=speed;
        powerTotal+=power;
        engineFound = true;
    }

    if(!headFound && part == 'Head' && head_style == style){
        enduranceTotal+=endurance;
        speedTotal+=speed;
        powerTotal+=power;
        headFound = true;
    }

    if(!bodyFound && part == 'Body' && body_style == style){
        enduranceTotal+=endurance;
        speedTotal+=speed;
        powerTotal+=power;
        bodyFound = true;
    }

    if(!legsFound && part == 'Legs' && legs_style == style){
        enduranceTotal+=endurance;
        speedTotal+=speed;
        powerTotal+=power;
        legsFound = true;
    }

    if(!leftArmFound && part == 'Arm' && left_arm_style == style){
      enduranceTotal+=endurance;
      speedTotal+=speed;
      powerTotal+=power;
      leftArmFound = true;
    }
    if(!rightArmFound && part == 'Arm' && right_arm_style == style){
      enduranceTotal+=endurance;
      speedTotal+=speed;
      powerTotal+=power;
      rightArmFound = true;
    }
  });

  
  document.getElementById('endurance_total').innerHTML = enduranceTotal;
  document.getElementById('speed_total').innerHTML = speedTotal;
  document.getElementById('power_total').innerHTML = powerTotal;
  document.getElementById('stats_total').innerHTML = enduranceTotal + speedTotal + powerTotal;

  showPreview(head_style, body_style, legs_style, left_arm_style, right_arm_style, afterglow_style);
}

function buildMechTable(){
    savedMechContainer.innerHTML = '';
    mechs.forEach((mech, index)=>{
        const clone = templateMechs.content.cloneNode(true);
        let tr = clone.children[0];
        tr.id = 'mech_'+index;
        tr.onclick = ()=>{showMech(index)};
        tr.classList.add('clickable');
        clone.querySelector(".image").innerHTML = '<img src="'+mech.img+'"></img>';
        clone.querySelector(".engine").textContent = mech.engine;
        clone.querySelector(".head").textContent = mech.head;
        clone.querySelector(".body").textContent = mech.body;
        clone.querySelector(".legs").textContent = mech.legs;
        clone.querySelector(".left_arm").textContent = mech.left_arm;
        clone.querySelector(".right_arm").textContent = mech.right_arm;
        clone.querySelector(".endurance").textContent = mech.endurance;
        clone.querySelector(".speed").textContent = mech.speed;
        clone.querySelector(".power").textContent = mech.power;
        clone.querySelector(".total").textContent = mech.total;

        clone.querySelector(".remove").innerHTML = `<div style="text-align: center;">
            <button class="btn btn-dismantle" id="btn-query" onclick="removeMech('${index}')">-</button>
        </div>`;
        // clone.querySelector(".count").textContent = deal.has.count;
        savedMechContainer.appendChild(clone);
    })
    document.getElementById('mech_count').innerHTML = mechs.length;
}


/* Thumbnailer */
function resample_single(canvas, resize_canvas, width, height) {
  // document.body.appendChild(resize_canvas);
  // setTimeout(()=>{
    var width_source = canvas.width;
    var height_source = canvas.height;
    width = Math.round(width);
    height = Math.round(height);

    var ratio_w = width_source / width;
    var ratio_h = height_source / height;
    var ratio_w_half = Math.ceil(ratio_w / 2);
    var ratio_h_half = Math.ceil(ratio_h / 2);

    var ctxCanvas = canvas.getContext("2d");
    ctxCanvas.clearRect(0, 0, ctxCanvas.width, ctxCanvas.height);
    var ctx = resize_canvas.getContext("2d");
    ctx.clearRect(0, 0, resize_canvas.width, resize_canvas.height);
    var img = ctxCanvas.getImageData(0, 0, width_source, height_source);
    var img2 = ctx.createImageData(width, height);
    var data = img.data;
    var data2 = img2.data;

    for (var j = 0; j < height; j++) {
        for (var i = 0; i < width; i++) {
            var x2 = (i + j * width) * 4;
            var weight = 0;
            var weights = 0;
            var weights_alpha = 0;
            var gx_r = 0;
            var gx_g = 0;
            var gx_b = 0;
            var gx_a = 0;
            var center_y = (j + 0.5) * ratio_h;
            var yy_start = Math.floor(j * ratio_h);
            var yy_stop = Math.ceil((j + 1) * ratio_h);
            for (var yy = yy_start; yy < yy_stop; yy++) {
                var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
                var center_x = (i + 0.5) * ratio_w;
                var w0 = dy * dy; //pre-calc part of w
                var xx_start = Math.floor(i * ratio_w);
                var xx_stop = Math.ceil((i + 1) * ratio_w);
                for (var xx = xx_start; xx < xx_stop; xx++) {
                    var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
                    var w = Math.sqrt(w0 + dx * dx);
                    if (w >= 1) {
                        //pixel too far
                        continue;
                    }
                    //hermite filter
                    weight = 2 * w * w * w - 3 * w * w + 1;
                    var pos_x = 4 * (xx + yy * width_source);
                    //alpha
                    gx_a += weight * data[pos_x + 3];
                    weights_alpha += weight;
                    //colors
                    if (data[pos_x + 3] < 255)
                        weight = weight * data[pos_x + 3] / 250;
                    gx_r += weight * data[pos_x];
                    gx_g += weight * data[pos_x + 1];
                    gx_b += weight * data[pos_x + 2];
                    weights += weight;
                }
            }
            data2[x2] = gx_r / weights;
            data2[x2 + 1] = gx_g / weights;
            data2[x2 + 2] = gx_b / weights;
            data2[x2 + 3] = gx_a / weights_alpha;
        }
    }
    //clear and resize canvas
    // if (resize_canvas === true) {
        resize_canvas.width = width;
        resize_canvas.height = height;
    // } else {
    //     ctx.clearRect(0, 0, width_source, height_source);
    // }

    //draw
    ctx.putImageData(img2, 0, 0);
    // callback(resize_canvas);
  // } , 0);
}