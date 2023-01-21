"use strict";

let allData = {};
function init() {
  initTooltip();
}

window.addEventListener('load', async () => {
  dataModel.useStyles = true;
  init();
  buildPartTable();
  
  displayTables();
});

function displayTables(){
  document.querySelector("#connected").style.display = "block";
}

function buildPartTable(){

  let parts = {};
  let modelStyleParts = {};
  Object.keys(meta_parts).forEach((name)=>{
    let meta = meta_parts[name];
    let model = meta.find((att)=> att.trait_type == 'Model').value;
    let style = meta.find((att)=> att.trait_type == 'Style').value;
    let part = meta.find((att)=> att.trait_type == 'Part').value;
    let endurance = meta.find((att)=> att.trait_type == 'Endurance').value;
    let speed = meta.find((att)=> att.trait_type == 'Speed').value;
    let power = meta.find((att)=> att.trait_type == 'Power').value;

    if(!parts[model]){
      parts[model] = {};
    }
    if(!parts[model][part]){
      parts[model][part] = [];
    }
    parts[model][part].push({
      style,
      endurance,
      speed,
      power
    });

    if(!modelStyleParts[model]){
      modelStyleParts[model] = {};
    }
    if(!modelStyleParts[model][style]){
      modelStyleParts[model][style] = {};
    }
    modelStyleParts[model][style][part] = {
      endurance,
      speed,
      power
    }
  });

  let maxMechs = {};

  RARITY_ORDER.forEach((model)=>{
    if(!maxMechs[model]){
      maxMechs[model] = {};
    }
    PARTS_ORDER.forEach((part)=>{
      if(part == 'Leg'){
        part = 'Legs';
      }
      let partsArr = parts[model][part];
      partsArr.sort((a,b)=>{
        let aTotal = a.endurance + a.speed + a.power;
        let bTotal = b.endurance + b.speed + b.power;
        return bTotal - aTotal;
      });
      partsArr.forEach((sortedPart, index)=>{
        let style = sortedPart.style;
        let endurance = sortedPart.endurance;
        let speed = sortedPart.speed;
        let power = sortedPart.power;

        // Highest Stat Part
        if(index == 0){
          maxMechs[model][part] = {
            style,
            endurance,
            speed,
            power
          }
        }
        buildPartCountsTable(model, part, style, endurance, speed, power);
      });
    });
  });
  

  RARITY_ORDER.forEach((model)=>{
      let mech = maxMechs[model];
      buildMaxMechTable(model, mech);
  });

  //Build full mechs
  let fullMechs = {};
  RARITY_ORDER.forEach((model)=>{
    if(!fullMechs[model]){
      fullMechs[model] = {};
    }
    STYLE_ORDER[model].reverse().forEach((style) => {
      let mech = modelStyleParts[model][style];
      buildFullMechTable(model, style, mech);
      // PARTS_ORDER.forEach((part)=>{
      //   modelStyleParts[model][style][part];
      // });
    });
  });
}

function buildPartCountsTable(
  model, 
  part, 
  style, 
  endurance, 
  power, 
  speed
  ){
  const clone = templateCounts.content.cloneNode(true);
  clone.querySelector(".image").innerHTML = partsRevealedImage(part, model, style);
  clone.querySelector(".model").innerHTML = model;
  clone.querySelector(".part").textContent = part;
  clone.querySelector(".style").textContent = style;
  clone.querySelector(".endurance").textContent = endurance;
  clone.querySelector(".power").textContent = power;
  clone.querySelector(".speed").textContent = speed;
  clone.querySelector(".total").textContent = endurance + power + speed;
  
  countsContainer.appendChild(clone);
}

function buildMaxMechTable(
  model, 
  mech
  ){
  const clone = templateMax.content.cloneNode(true);
  clone.querySelector(".model").textContent = model;
  clone.querySelector(".style").textContent = mech.Engine.style;
  clone.querySelector(".engine").innerHTML = partsRevealedImage('Engine', model, mech.Engine.style);
  clone.querySelector(".head").innerHTML = partsRevealedImage('Head', model, mech.Head.style);
  clone.querySelector(".body").innerHTML = partsRevealedImage('Body', model, mech.Body.style);
  clone.querySelector(".legs").innerHTML = partsRevealedImage('Legs', model, mech.Legs.style);
  clone.querySelector(".arm").innerHTML = partsRevealedImage('Arm', model, mech.Arm.style);
  let totalEndurance = mech.Engine.endurance + mech.Head.endurance + mech.Body.endurance + mech.Legs.endurance + mech.Arm.endurance*2;
  clone.querySelector(".endurance").textContent = totalEndurance;
  let totalSpeed = mech.Engine.speed + mech.Head.speed + mech.Body.speed + mech.Legs.speed + mech.Arm.speed*2;
  clone.querySelector(".speed").textContent = totalSpeed;
  let totalPower = mech.Engine.power + mech.Head.power + mech.Body.power + mech.Legs.power + mech.Arm.power*2;
  clone.querySelector(".power").textContent = totalPower;
  clone.querySelector(".total").textContent = totalEndurance + totalSpeed + totalPower;
  
  maxMechContainer.appendChild(clone);
}

function buildFullMechTable(
  model, 
  style,
  mech
  ){
  const clone = templateFullMech.content.cloneNode(true);
  clone.querySelector(".model").textContent = model;
  clone.querySelector(".style").textContent = style;
  clone.querySelector(".engine").innerHTML = partsRevealedImage('Engine', model, style);
  clone.querySelector(".head").innerHTML = partsRevealedImage('Head', model, style);
  clone.querySelector(".body").innerHTML = partsRevealedImage('Body', model, style);
  clone.querySelector(".legs").innerHTML = partsRevealedImage('Legs', model, style);
  clone.querySelector(".arm").innerHTML = partsRevealedImage('Arm', model, style);
  let totalEndurance = mech.Engine.endurance + mech.Head.endurance + mech.Body.endurance + mech.Legs.endurance + mech.Arm.endurance*2;
  clone.querySelector(".endurance").textContent = totalEndurance;
  let totalSpeed = mech.Engine.speed + mech.Head.speed + mech.Body.speed + mech.Legs.speed + mech.Arm.speed*2;
  clone.querySelector(".speed").textContent = totalSpeed;
  let totalPower = mech.Engine.power + mech.Head.power + mech.Body.power + mech.Legs.power + mech.Arm.power*2;
  clone.querySelector(".power").textContent = totalPower;
  clone.querySelector(".total").textContent = totalEndurance + totalSpeed + totalPower;
  
  fullMechContainer.appendChild(clone);
}


function getPartCounts(address){
  let partCounts = {};
  RARITY_ORDER.forEach((model)=>{
    PARTS_ORDER.forEach((part)=>{
      STYLE_ORDER[model].forEach((style)=>{
        if(!partCounts[part]){
          partCounts[part] = 0;
        }
        if(dataModel.owners[address].modelParts[model] && dataModel.owners[address].modelParts[model][part] && dataModel.owners[address].modelParts[model][part][style]){
          partCounts[part] += dataModel.owners[address].modelParts[model][part][style];
        }
      });
    });
  });
  return partCounts;
}

function reset(){
  resetModel();
  // Purge UI elements any previously loaded accounts
  countsContainer.innerHTML = '';
}

function highlightZeros(){
  var table = document.getElementById("countsTable");
  var cells = table.getElementsByTagName("td");
  for (var i = 0; i < cells.length; i++) {
    if (parseInt(cells[i].textContent, 10) === 0 && cells[i].textContent.indexOf('0x') == -1) {
      cells[i].style.color = "orange";
    }
  }
}

function highlightTotal(){
  let color = '#71d0c6';
  let backgroundColor = '#181818';
  var table1 = document.getElementById("mechCountsTable");
  var table2 = document.getElementById("partCountsTable");
  var table3 = document.getElementById("unclaimedPartCountsTable");
  var cells1 = table1.getElementsByTagName("tr");
  cells1[cells1.length-1].style.backgroundColor = backgroundColor;
  cells1[cells1.length-1].style.color = color;
  cells1[cells1.length-1].style.fontWeight = 'bold';
  var cells1a = table1.getElementsByTagName("td");
  for (var i = 3; i < cells1a.length; i+=4) {
    cells1a[i].style.backgroundColor = backgroundColor;
    cells1a[i].style.color = color;
    cells1a[i].style.fontWeight = 'bold';
  }
  
  var cells2 = table2.getElementsByTagName("tr");
  cells2[cells2.length-1].style.backgroundColor = backgroundColor;
  cells2[cells2.length-1].style.color = color;
  cells2[cells2.length-1].style.fontWeight = 'bold';
  var cells2a = table2.getElementsByTagName("td");
  for (var i = 6; i < cells2a.length; i+=7) {
    cells2a[i].style.backgroundColor = backgroundColor;
    cells2a[i].style.color = color;
    cells2a[i].style.fontWeight = 'bold';
  }

  var cells3 = table3.getElementsByTagName("tr");
  cells3[cells3.length-1].style.backgroundColor = backgroundColor;
  cells3[cells3.length-1].style.color = color;
  cells3[cells3.length-1].style.fontWeight = 'bold';
  var cells3a = table3.getElementsByTagName("td");
  for (var i = 6; i < cells3a.length; i+=7) {
    cells3a[i].style.backgroundColor = backgroundColor;
    cells3a[i].style.color = color;
    cells3a[i].style.fontWeight = 'bold';
  }
}