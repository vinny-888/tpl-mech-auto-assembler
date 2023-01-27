"use strict";

function init() {
  initTooltip();
  createMetadataLookup();
}

window.addEventListener('load', async () => {
  init();
  initDropdowns();
  addEventlisteners();
  updatePreview();
});

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

