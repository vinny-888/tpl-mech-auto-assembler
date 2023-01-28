"use strict";

let mechs = [];
function init() {
  initTooltip();
  createMetadataLookup();
}

window.addEventListener('load', async () => {
  init();
  // initDropdowns();
  addEventlisteners();
  updatePreview();
  loadMechs();
});

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
  let engine = document.getElementById('engine_style');
  let head = document.getElementById('head_style');
  let body = document.getElementById('body_style');
  let legs = document.getElementById('legs_style');
  let left_arm = document.getElementById('left_arm_style');
  let right_arm = document.getElementById('right_arm_style');

  engine.onchange = updatePreview;
  head.onchange = updatePreview;
  body.onchange = updatePreview;
  legs.onchange = updatePreview;
  left_arm.onchange = updatePreview;
  right_arm.onchange = updatePreview;
}

function updatePreview(){
  let engine = document.getElementById('engine_style');
  let head = document.getElementById('head_style');
  let body = document.getElementById('body_style');
  let legs = document.getElementById('legs_style');
  let left_arm = document.getElementById('left_arm_style');
  let right_arm = document.getElementById('right_arm_style');

  let engine_style = engine.value;
  let head_style = head.value;
  let body_style = body.value;
  let legs_style = legs.value;
  let left_arm_style = left_arm.value;
  let right_arm_style = right_arm.value;

  let enduranceTotal = 0;
  let speedTotal = 0;
  let powerTotal = 0;
  Object.keys(meta_parts).forEach((key, index)=>{
    let metadata = meta_parts[key];
    let model = metadata.find((att)=> att.trait_type == 'Model').value;
    let style = metadata.find((att)=> att.trait_type == 'Style').value;
    let part = metadata.find((att)=> att.trait_type == 'Part').value;
    let endurance = metadata.find((att)=> att.trait_type == 'Endurance').value;
    let speed = metadata.find((att)=> att.trait_type == 'Speed').value;
    let power = metadata.find((att)=> att.trait_type == 'Power').value;

    if((part == 'Engine' && engine_style == style) || 
      (part == 'Head' && head_style == style) ||
      (part == 'Body' && body_style == style) ||
      (part == 'Legs' && legs_style == style) ||
      (part == 'Arm' && left_arm_style == style) ||
      (part == 'Arm' && right_arm_style == style)){
      enduranceTotal+=endurance;
      speedTotal+=speed;
      powerTotal+=power;
    }
  });

  
  document.getElementById('endurance_total').innerHTML = enduranceTotal;
  document.getElementById('speed_total').innerHTML = speedTotal;
  document.getElementById('power_total').innerHTML = powerTotal;
  document.getElementById('stats_total').innerHTML = enduranceTotal + speedTotal + powerTotal;

  showPreview(head_style, body_style, legs_style, left_arm_style, right_arm_style);
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
    var ctx = resize_canvas.getContext("2d");
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