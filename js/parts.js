"use strict";

let allData = {};
function init() {
  initTooltip();
  createMetadataLookup();
}

window.addEventListener('load', async () => {
  dataModel.useStyles = true;
  init();
  buildPartTable();
  
  displayTables();
});

function validateMetadata(){
  let tokens = [];
  Object.keys(revealedMetadata).forEach((token)=>{

    let metadata = revealedMetadata[token];
    let metadataEndurance = metadata.attributes.find((att)=> att.trait_type == 'Endurance').value;
    let metadataSpeed = metadata.attributes.find((att)=> att.trait_type == 'Speed').value;
    let metadataPower = metadata.attributes.find((att)=> att.trait_type == 'Power').value;

    let compare = meta_parts[metadata.name];
    let compareEndurance = compare.find((att)=> att.trait_type == 'Endurance').value;
    let compareSpeed = compare.find((att)=> att.trait_type == 'Speed').value;
    let comparePower = compare.find((att)=> att.trait_type == 'Power').value;

    if(compareEndurance != metadataEndurance || compareSpeed != metadataSpeed || comparePower != metadataPower){
      //, JSON.stringify(metadata.attributes), JSON.stringify(compare.attributes));
      tokens.push(token, metadata);
    }
  });
  console.log(tokens);
}

function displayTables(){
  document.querySelector("#connected").style.display = "block";
}

function buildPartTable(){

  let parts = {};
  let modelStyleParts = {};
  let allParts = {};
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

    if(!allParts[part]){
      allParts[part] = [];
    }
    allParts[part].push(
      {
        model,
        style,
        endurance,
        speed,
        power
      }
    );
  });

  // Total power mechs
  let maxMechs = {};

  // Single Power Mechs
  let maxEnduranceMechs = {};
  let maxSpeedMechs = {};
  let maxPowerMechs = {};

  // Frankenstats Mechs
  let maxFrankenstatEnduranceMechs = {};
  let maxFrankenstatSpeedMechs = {};
  let maxFrankenstatPowerMechs = {};

  // Max Power Mechs
  RARITY_ORDER.forEach((model)=>{
    if(!maxMechs[model]){
      maxMechs[model] = {};
    }
    if(!maxEnduranceMechs[model]){
      maxEnduranceMechs[model] = {};
    }
    if(!maxSpeedMechs[model]){
      maxSpeedMechs[model] = {};
    }
    if(!maxPowerMechs[model]){
      maxPowerMechs[model] = {};
    }
    PARTS_ORDER.forEach((part)=>{
      if(part == 'Leg'){
        part = 'Legs';
      }
      let partsMaxArr = [].concat(parts[model][part]);
      partsMaxArr.sort((a,b)=>{
        let aTotal = a.endurance + a.speed + a.power;
        let bTotal = b.endurance + b.speed + b.power;
        return bTotal - aTotal;
      });
      partsMaxArr.forEach((sortedPart, index)=>{
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


      let partsMaxEnduranceArr = [].concat(parts[model][part]);
      partsMaxEnduranceArr.sort((a,b)=>{
        let aTotal = a.endurance;
        let bTotal = b.endurance;
        return bTotal - aTotal;
      });

      partsMaxEnduranceArr.forEach((sortedPart, index)=>{
        let style = sortedPart.style;
        let endurance = sortedPart.endurance;
        let speed = sortedPart.speed;
        let power = sortedPart.power;

        // Highest Stat Part
        if(index == 0){
          maxEnduranceMechs[model][part] = {
            style,
            endurance,
            speed,
            power
          }
        }
      });

      let partsMaxSpeedArr = [].concat(parts[model][part]);
      partsMaxSpeedArr.sort((a,b)=>{
        let aTotal = a.speed;
        let bTotal = b.speed;
        return bTotal - aTotal;
      });

      partsMaxSpeedArr.forEach((sortedPart, index)=>{
        let style = sortedPart.style;
        let endurance = sortedPart.endurance;
        let speed = sortedPart.speed;
        let power = sortedPart.power;

        // Highest Stat Part
        if(index == 0){
          maxSpeedMechs[model][part] = {
            style,
            endurance,
            speed,
            power
          }
        }
      });

      let partsMaxPowerArr = [].concat(parts[model][part]);
      partsMaxPowerArr.sort((a,b)=>{
        let aTotal = a.power;
        let bTotal = b.power;
        return bTotal - aTotal;
      });

      partsMaxPowerArr.forEach((sortedPart, index)=>{
        let style = sortedPart.style;
        let endurance = sortedPart.endurance;
        let speed = sortedPart.speed;
        let power = sortedPart.power;

        // Highest Stat Part
        if(index == 0){
          maxPowerMechs[model][part] = {
            style,
            endurance,
            speed,
            power
          }
        }
      });

    });
  });

  // Max Power Mechs
  RARITY_ORDER.forEach((model)=>{
    PARTS_ORDER.forEach((part)=>{
      if(part == 'Leg'){
        part = 'Legs';
      }
      
      // Non Frankenstat
      {
        let partsMaxArr = [].concat(parts[model][part]);
        {
          partsMaxArr.sort((a,b)=>{
            let aTotal = a.endurance + a.speed + a.power;
            let bTotal = b.endurance + b.speed + b.power;
            return bTotal - aTotal;
          });
          partsMaxArr.forEach((sortedPart, index)=>{
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
        }

        // Same Model Max
        let partsMaxEnduranceArr = [].concat(parts[model][part]);
        {
          partsMaxEnduranceArr.sort((a,b)=>{
            let aTotal = a.endurance;
            let bTotal = b.endurance;
            return bTotal - aTotal;
          });

          partsMaxEnduranceArr.forEach((sortedPart, index)=>{
            let style = sortedPart.style;
            let endurance = sortedPart.endurance;
            let speed = sortedPart.speed;
            let power = sortedPart.power;

            // Highest Stat Part
            if(index == 0){
              maxEnduranceMechs[model][part] = {
                style,
                endurance,
                speed,
                power
              }
            }
          });
        }

        let partsMaxSpeedArr = [].concat(parts[model][part]);
        {
          partsMaxSpeedArr.sort((a,b)=>{
            let aTotal = a.speed;
            let bTotal = b.speed;
            return bTotal - aTotal;
          });

          partsMaxSpeedArr.forEach((sortedPart, index)=>{
            let style = sortedPart.style;
            let endurance = sortedPart.endurance;
            let speed = sortedPart.speed;
            let power = sortedPart.power;

            // Highest Stat Part
            if(index == 0){
              maxSpeedMechs[model][part] = {
                style,
                endurance,
                speed,
                power
              }
            }
          });
        }

        let partsMaxPowerArr = [].concat(parts[model][part]);
        {
          partsMaxPowerArr.sort((a,b)=>{
            let aTotal = a.power;
            let bTotal = b.power;
            return bTotal - aTotal;
          });

          partsMaxPowerArr.forEach((sortedPart, index)=>{
            let style = sortedPart.style;
            let endurance = sortedPart.endurance;
            let speed = sortedPart.speed;
            let power = sortedPart.power;

            // Highest Stat Part
            if(index == 0){
              maxPowerMechs[model][part] = {
                style,
                endurance,
                speed,
                power
              }
            }
          });
        }
      }

      let limit = 5;

      // Mixed Model Max
      let partsFrankenstatMaxEnduranceArr = [].concat(allParts[part]);
      {
        partsFrankenstatMaxEnduranceArr.sort((a,b)=>{
          let aTotal = a.endurance;
          let bTotal = b.endurance;
          return bTotal - aTotal;
        });

        partsFrankenstatMaxEnduranceArr.forEach((sortedPart, index)=>{
          let style = sortedPart.style;
          let endurance = sortedPart.endurance;
          let speed = sortedPart.speed;
          let power = sortedPart.power;

          // Highest Stat Part
          if(endurance >= limit){
            if(!maxFrankenstatEnduranceMechs[part]){
              maxFrankenstatEnduranceMechs[part] = [];
            }
            maxFrankenstatEnduranceMechs[part].push({
              model: sortedPart.model,
              style,
              endurance,
              speed,
              power
            });
          }
        });
      }

      let partsFrankenstatMaxSpeedArr = [].concat(allParts[part]);
      {
        partsFrankenstatMaxSpeedArr.sort((a,b)=>{
          let aTotal = a.speed;
          let bTotal = b.speed;
          return bTotal - aTotal;
        });

        partsFrankenstatMaxSpeedArr.forEach((sortedPart, index)=>{
          let style = sortedPart.style;
          let endurance = sortedPart.endurance;
          let speed = sortedPart.speed;
          let power = sortedPart.power;

          // Highest Stat Part
          if(speed >= limit){
            if(!maxFrankenstatSpeedMechs[part]){
              maxFrankenstatSpeedMechs[part] = [];
            }
            maxFrankenstatSpeedMechs[part].push({
              model: sortedPart.model,
              style,
              endurance,
              speed,
              power
            });
          }
        });
      }

      let partsMaxFrankenstatPowerArr = [].concat(allParts[part]);
      {
        partsMaxFrankenstatPowerArr.sort((a,b)=>{
          let aTotal = a.power;
          let bTotal = b.power;
          return bTotal - aTotal;
        });

        partsMaxFrankenstatPowerArr.forEach((sortedPart, index)=>{
          let style = sortedPart.style;
          let endurance = sortedPart.endurance;
          let speed = sortedPart.speed;
          let power = sortedPart.power;

          // Highest Stat Part
          if(power >= limit){
            if(!maxFrankenstatPowerMechs[part]){
              maxFrankenstatPowerMechs[part] = [];
            }
            maxFrankenstatPowerMechs[part].push({
              model: sortedPart.model,
              style,
              endurance,
              speed,
              power
            });
          }
        });
      }
    });
  });

  let enduranceMechs = [];
  let speedMechs = [];
  let powerMechs = [];

  let enduranceStillRunning = true;
  while(enduranceStillRunning){
    let mechEndurance = {};
    PARTS_ORDER.forEach((partType)=>{
      if(partType == 'Leg'){
        partType = 'Legs';
      }
      for(let i=0; i<maxFrankenstatEnduranceMechs[partType].length; i++){
        let part = maxFrankenstatEnduranceMechs[partType][i];
        let newPartType = partType;
        if(partType == 'Arm'){
          if(!mechEndurance['left_arm']){
            newPartType = 'left_arm';
          } else {
            newPartType = 'right_arm';
          }
        }
        if(!mechEndurance[newPartType]){
          mechEndurance[newPartType] = part;
          maxFrankenstatEnduranceMechs[partType].splice(i, 1);
          delete maxFrankenstatEnduranceMechs[partType][i];
        }
        if(Object.keys(mechEndurance).length == 6){
          enduranceMechs.push(mechEndurance);
          // console.log('Before: ', maxFrankenstatEnduranceMechs[partType]);
          // console.log('After: ', maxFrankenstatEnduranceMechs[partType]);
          break;
        }
      }
    });
    if(Object.keys(mechEndurance).length != 6){
      enduranceStillRunning = false;
    }
  }
  let speedStillRunning = true;
  while(speedStillRunning){
    let mechSpeed = {};
    PARTS_ORDER.forEach((partType)=>{
      if(partType == 'Leg'){
        partType = 'Legs';
      }
      for(let i=0; i<maxFrankenstatSpeedMechs[partType].length; i++){
        let part = maxFrankenstatSpeedMechs[partType][i];
        let newPartType = partType;
        if(partType == 'Arm'){
          if(!mechSpeed['left_arm']){
            newPartType = 'left_arm';
          } else {
            newPartType = 'right_arm';
          }
        }
        if(!mechSpeed[newPartType]){
          mechSpeed[newPartType] = part;
          maxFrankenstatSpeedMechs[partType].splice(i, 1);
        }
        if(Object.keys(mechSpeed).length == 6){
          speedMechs.push(mechSpeed);
          break;
        }
      }
    });
    if(Object.keys(mechSpeed).length != 6){
      speedStillRunning = false;
    }
  }
  let powerStillRunning = true;
  while(powerStillRunning){
    let mechPower = {};
    PARTS_ORDER.forEach((partType)=>{
      if(partType == 'Leg'){
        partType = 'Legs';
      }
      for(let i=0; i<maxFrankenstatPowerMechs[partType].length; i++){
        let part = maxFrankenstatPowerMechs[partType][i];
        let newPartType = partType;
        if(partType == 'Arm'){
          if(!mechPower['left_arm']){
            newPartType = 'left_arm';
          } else {
            newPartType = 'right_arm';
          }
        }
        if(!mechPower[newPartType]){
          mechPower[newPartType] = part;
          maxFrankenstatPowerMechs[partType].splice(i, 1);
        }
        if(Object.keys(mechPower).length == 6){
          powerMechs.push(mechPower);
          break;
        }
      }
    });
    if(Object.keys(mechPower).length != 6){
      powerStillRunning = false;
    }
  }

  // Mixed Single Level
  buildMaxMechTableArr(enduranceMechs, frankenstatEnduranceMechContainer);

  buildMaxMechTableArr(speedMechs, frankenstatSpeedMechContainer);

  buildMaxMechTableArr(powerMechs, frankenstatPowerMechContainer);
  
  // Builds Tables
  RARITY_ORDER.forEach((model)=>{
      let mech = maxMechs[model];

      // Max Total
      buildMaxMechTable(model, mech, maxMechContainer);

      // Max Single
      let mechEndurance = maxEnduranceMechs[model];
      buildMaxMechTable(model, mechEndurance, maxEnduranceMechContainer);

      let mechSpeed = maxSpeedMechs[model];
      buildMaxMechTable(model, mechSpeed, maxSpeedMechContainer);

      let mechPower = maxPowerMechs[model];
      buildMaxMechTable(model, mechPower, maxPowerMechContainer);

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
  mech,
  container
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
  
  container.appendChild(clone);
}

function buildMaxMechTableArr(
  mechs,
  container
  ){
    mechs.forEach((mech)=>{
      const clone = templateMaxMixed.content.cloneNode(true);
      clone.querySelector(".model").textContent = mech.Engine.model;
      clone.querySelector(".style").textContent = mech.Engine.style;
      clone.querySelector(".engine").innerHTML = partsRevealedImage('Engine', mech.Engine.model, mech.Engine.style);
      clone.querySelector(".head").innerHTML = partsRevealedImage('Head', mech.Head.model, mech.Head.style);
      clone.querySelector(".body").innerHTML = partsRevealedImage('Body', mech.Body.model, mech.Body.style);
      clone.querySelector(".legs").innerHTML = partsRevealedImage('Legs', mech.Legs.model, mech.Legs.style);
      clone.querySelector(".left_arm").innerHTML = partsRevealedImage('Arm', mech.left_arm.model, mech.left_arm.style);
      clone.querySelector(".right_arm").innerHTML = partsRevealedImage('Arm', mech.right_arm.model, mech.right_arm.style);
      let totalEndurance = mech.Engine.endurance + mech.Head.endurance + mech.Body.endurance + mech.Legs.endurance + mech.left_arm.endurance + mech.right_arm.endurance;
      clone.querySelector(".endurance").textContent = totalEndurance;
      let totalSpeed = mech.Engine.speed + mech.Head.speed + mech.Body.speed + mech.Legs.speed + mech.left_arm.speed + mech.right_arm.speed;
      clone.querySelector(".speed").textContent = totalSpeed;
      let totalPower = mech.Engine.power + mech.Head.power + mech.Body.power + mech.Legs.power + mech.left_arm.power + mech.right_arm.power;
      clone.querySelector(".power").textContent = totalPower;
      clone.querySelector(".total").textContent = totalEndurance + totalSpeed + totalPower;
      
      container.appendChild(clone);
    })
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