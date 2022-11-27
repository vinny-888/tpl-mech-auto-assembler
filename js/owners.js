"use strict";

let wallets = {};
let allData = {};
let totalFullMechs = 0;
let totalMixedMechs = 0;
let totalMixedMechsNoAfterglow = 0;
let totalMixedMechsPartial = 0;
let totalMixedMechsPartialNoModel = 0;
let remainingParts = 0;
let progressDiv = null;
function init() {
  initContracts();
  initTooltip();
}

window.addEventListener('load', async () => {
  init();
  progressDiv = document.getElementById('progress');
  // refreshAccountData();
  document.querySelector("#btn-query").addEventListener("click", refreshAccountData);
  countMechModels();
  displayTables();
});

function getSortedKeysTotalParts(obj) {
  var keys = Object.keys(obj);
  return keys.sort(function(a,b){return obj[b].totalParts-obj[a].totalParts});
}

function download(){
  let keys = getSortedKeysTotalParts(allWalletData);
  let sortedWallets = [];
  keys.forEach((address)=>{
    allWalletData[address].address = address;
    sortedWallets.push(allWalletData[address]);
  })
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sortedWallets));
  var dlAnchorElem = document.getElementById('downloadAnchorElem');
  dlAnchorElem.setAttribute("href",     dataStr     );
  dlAnchorElem.setAttribute("download", "data.json");
  dlAnchorElem.click();
}

function downloa2(){
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allData));
  var dlAnchorElem = document.getElementById('downloadAnchorElem');
  dlAnchorElem.setAttribute("href",     dataStr     );
  dlAnchorElem.setAttribute("download", "data.json");
  dlAnchorElem.click();
}

async function refreshAccountData() {
  reset();
  displayTables();
  let loadCached = true;
  if(loadCached){
    walletOwnerData.forEach((data, index)=>{
      setTimeout(()=>{
        updateTable((index+1), data.address, data);
      },0);
    })
    // Object.keys(allWalletData).forEach((address, index)=>{
    //   setTimeout(()=>{
    //     updateTable((index+1), address, allWalletData[address]);
    //   },0);
    // })
  } else {
    
    let count = owners_wallets.length;
    let counter = 0;
    for(let i=0; i<count; i++){
      let address = owners_wallets[i];
      let cachedData = localStorage.getItem(address);
      if(!cachedData){
        console.log('Fetching: ', i);
        await fetchAccountData(address);
        updateTable((i+1), address);

        if(i == count-1){
          countMechModels();
          console.log('Total Full Mechs: ', totalFullMechs, 'Total Mixed Mechs', totalMixedMechs, 'Total Mixed Mechs No Afterglow', totalMixedMechsNoAfterglow, 'Total Partial Mixed Mechs', totalMixedMechsPartial, 'Total Partial Mixed Mechs No Model', totalMixedMechsPartialNoModel);
        }
        counter++;
      } else {
        let cachedDataItem = JSON.parse(cachedData);
        allData[address] = cachedDataItem;
        setTimeout(()=>{
          updateTable((i+1), address, cachedDataItem);
          if(i == count-1){
            countMechModels();
            console.log('Total Full Mechs: ', totalFullMechs, 'Total Mixed Mechs', totalMixedMechs, 'Total Mixed Mechs No Afterglow', totalMixedMechsNoAfterglow, 'Total Partial Mixed Mechs', totalMixedMechsPartial, 'Total Partial Mixed Mechs No Model', totalMixedMechsPartialNoModel);
          }
        }, 0);
      }
    }
  }
}

function countMechModels(){
  let totalFullMechs = {};
  let totalMixedMechs = {};
  walletOwnerData.forEach((data)=>{
    let fullMechs = data.fullMechs;
    let mixedMechs = data.mixedMechs;

    Object.keys(fullMechs).forEach((model)=>{
      if(!totalFullMechs[model]){
        totalFullMechs[model] = 0;
      }
      totalFullMechs[model] += fullMechs[model].length;
    });

    Object.keys(mixedMechs).forEach((model)=>{
      if(!totalMixedMechs[model]){
        totalMixedMechs[model] = 0;
      }
      totalMixedMechs[model] += mixedMechs[model].length;
    });
  });

  console.log('totalFullMechs', totalFullMechs);
  console.log('totalMixedMechs', totalMixedMechs);

  RARITY_ORDER.forEach((model)=>{
    buildMechCountsTable(totalFullMechs, totalMixedMechs, model);
  });

  buildMechCountsTable(totalFullMechs, totalMixedMechs, 'Total');
}

function countMechModels2(){
  let totalFullMechs = {};
  let totalMixedMechs = {};
  Object.keys(allWalletData).forEach((address)=>{
    let fullMechs = allWalletData[address].fullMechs;
    let mixedMechs = allWalletData[address].mixedMechs;

    Object.keys(fullMechs).forEach((model)=>{
      if(!totalFullMechs[model]){
        totalFullMechs[model] = 0;
      }
      totalFullMechs[model] += fullMechs[model].length;
    });

    Object.keys(mixedMechs).forEach((model)=>{
      if(!totalMixedMechs[model]){
        totalMixedMechs[model] = 0;
      }
      totalMixedMechs[model] += mixedMechs[model].length;
    });
  });

  console.log('totalFullMechs', totalFullMechs);
  console.log('totalMixedMechs', totalMixedMechs);

  RARITY_ORDER.forEach((model)=>{
    buildMechCountsTable(totalFullMechs, totalMixedMechs, model);
  });
}

function updateTable(row, address, cachedData){
    if(cachedData){
      wallets[address] = cachedData.totalParts;
      totalFullMechs += cachedData.fullMechsCount;
      totalMixedMechs += cachedData.mixedMechsCount;
      totalMixedMechsNoAfterglow += cachedData.mixedMechsNoAfterglowCount;
      totalMixedMechsPartial += cachedData.mixedMechsPartialCount;
      totalMixedMechsPartialNoModel += cachedData.mixedMechsPartialNoModelCount;
      
      buildPartCountsTable(row, address, cachedData.totalParts, cachedData.totalAfterglows, cachedData.partsCount, cachedData.fullMechsCount, cachedData.mixedMechsCount, cachedData.mixedMechsNoAfterglowCount, cachedData.mixedMechsPartialCount, cachedData.mixedMechsPartialNoModelCount, cachedData.remainingParts);
    } else {
      let totalParts = getRemainingParts(address);
      let totalAfterglows = countAfterglows(address);

      let partsCount = getPartCounts(address);

      // Build *full* mechs of same model table
      let fullMechs = buildFullMechs(address);

      // Build *mixed* mechs **with** afterglow
      let mixedMechs = buildMixedMechs(address, true, false, false);

      // Build *mixed* mechs **without** afterglows
      let mixedMechsNoAfterglow = buildMixedMechs(address, false, false, false);

      // Build *partial* mechs and show missing parts
      let mixedMechsPartial = buildMixedMechs(address, false, true, false);

      // Build *partial* mechs and show missing parts
      let mixedMechsPartialNoModel = buildMixedMechs(address, false, true, true);

      // Build remaining parts table
      let remainingParts = getRemainingParts(address);

      // Builds the wallet inventory parts tables
      wallets[address] = totalParts;
      let fullMechsCount = countMechs(fullMechs);
      let mixedMechsCount = countMechs(mixedMechs);
      let mixedMechsNoAfterglowCount = countMechs(mixedMechsNoAfterglow);
      let mixedMechsPartialCount = countMechs(mixedMechsPartial);
      let mixedMechsPartialNoModelCount = countMechs(mixedMechsPartialNoModel);
      totalFullMechs += fullMechsCount;
      totalMixedMechs += mixedMechsCount;
      totalMixedMechsNoAfterglow += mixedMechsNoAfterglowCount;
      totalMixedMechsPartial += mixedMechsPartialCount;
      totalMixedMechsPartialNoModel += mixedMechsPartialNoModelCount;
      buildPartCountsTable(row, address, totalParts, totalAfterglows, partsCount, fullMechsCount, mixedMechsCount, mixedMechsNoAfterglowCount, mixedMechsPartialCount, mixedMechsPartialNoModelCount, remainingParts);

      if(localStorage.getItem(address) == null){
        allData[address] = {
          totalParts,
          partsCount,
          totalAfterglows,
          fullMechsCount,
          mixedMechsCount,
          mixedMechsNoAfterglowCount,
          mixedMechsPartialCount,
          mixedMechsPartialNoModelCount,
          remainingParts,
          fullMechs,
          mixedMechs,
          mixedMechsNoAfterglow
        };
        window.localStorage.setItem(address, JSON.stringify(allData[address]));
      }
    }

    showZeros();
    displayTables();
    progressDiv.innerHTML = ' - Loaded ' + row + '/4439';
}

function buildPartCountsTable(row, address, totalParts, totalAfterglows, partsCount, fullMechsCount, mixedMechsCount, mixedMechsNoAfterglowCount, mixedMechsPartialCount, mixedMechsPartialNoModelCount, remainingParts){
  const clone = templateCounts.content.cloneNode(true);
  clone.querySelector(".row").textContent = row;
  clone.querySelector(".wallet").textContent = address;
  clone.querySelector(".count").textContent = totalParts;
  
  Object.keys(partsCount).forEach((part)=>{
    clone.querySelector("."+part).textContent = partsCount[part];
  });

  clone.querySelector(".afterglows").textContent = totalAfterglows;
  clone.querySelector(".full").textContent = fullMechsCount;
  clone.querySelector(".mixed").textContent = mixedMechsCount;
  clone.querySelector(".mixed_no_afterglow").textContent = mixedMechsNoAfterglowCount;
  clone.querySelector(".engine_two").textContent = mixedMechsPartialCount;
  clone.querySelector(".two_plus").textContent = mixedMechsPartialNoModelCount;
  clone.querySelector(".unused").textContent = remainingParts;
  countsContainer.appendChild(clone);
}

function buildMechCountsTable(fullMechs, mixedMechs, model){
  const clone = templateMechCounts.content.cloneNode(true);
  clone.querySelector(".model").textContent = model;
  if(model != 'Total'){
    clone.querySelector(".full").textContent = fullMechs[model];
    clone.querySelector(".mixed").textContent = mixedMechs[model];
    clone.querySelector(".total").textContent = fullMechs[model]+mixedMechs[model];
  } else {
    let totalFull = 0;
    let totalMixed = 0;
    RARITY_ORDER.forEach((model)=>{
      totalFull += fullMechs[model];
      totalMixed += mixedMechs[model]
    });
    clone.querySelector(".full").textContent = totalFull;
    clone.querySelector(".mixed").textContent = totalMixed;
    clone.querySelector(".total").textContent = totalFull+totalMixed;
  }
  mechCountsContainer.appendChild(clone);
}

function countMechs(mechs){
  let count = 0;
  Object.keys(mechs).forEach((model)=>{
    count += mechs[model].length;
  });
  return count;
}
function getPartCounts(address){
  let partCounts = {};
  RARITY_ORDER.forEach((model)=>{
    PARTS_ORDER.forEach((part)=>{
      if(!partCounts[part]){
        partCounts[part] = 0;
      }
      partCounts[part] += dataModel.owners[address].modelParts[model][part];
    });
  });
  return partCounts;
}

function reset(){
  resetModel();
  // Purge UI elements any previously loaded accounts
  countsContainer.innerHTML = '';
}

function fixAndSortParts(address){
  /* Combine lupis arms with pirate lupis arms */
  dataModel.owners[address].walletParts[1].count += dataModel.owners[address].walletParts[19].count;
  // Remove the extra arms
  dataModel.owners[address].walletParts.splice(19, 1);

  /* Sort by Model and Part in Rarity Order not Alphabetical */
  dataModel.owners[address].walletParts.sort((a, b) => {
    if(a.model == b.model){
      return a.part.localeCompare(b.part);
    }
    return MODEL_WEIGHTS[a.model] - MODEL_WEIGHTS[b.model];
  })
}

async function fetchAccountData(address) {
  if(!dataModel.owners[address]){
    dataModel.owners[address] = {};
  }
  dataModel.owners[address].walletParts = await populateWalletMechParts(address);

  dataModel.owners[address].walletAfterglows = await populateWalletAfterglows(address);
  dataModel.owners[address].remainingAfterglows = countParts(dataModel.owners[address].walletAfterglows);

  // Combine lupis arms and sort by rarity
  fixAndSortParts(address);

  // Build the model part count map
  dataModel.owners[address].walletParts.forEach((part)=>{
    if(!dataModel.owners[address].modelParts){
      dataModel.owners[address].modelParts = {
        Enforcer: {},
        Ravager: {},
        Lupis: {},
        Behemoth: {},
        Nexus: {}
      };
    }
    dataModel.owners[address].modelParts[part.model][part.part] = part.count;
  });
}

function displayTables(){
  document.querySelector("#connected").style.display = "block";
}

function getRemainingParts(address){
  let remainingCount = 0;
  RARITY_ORDER.forEach((model)=>{
      if(dataModel.owners[address].modelParts[model]){
          Object.keys(dataModel.owners[address].modelParts[model]).forEach((part)=>{
          if(dataModel.owners[address].modelParts[model][part] > 0){
              remainingCount += dataModel.owners[address].modelParts[model][part];
          }
          });
      }
  });
  return remainingCount;
}

function countAfterglows(address){
  let afterglowCount = 0;
  // All Afterglows
  dataModel.owners[address].walletAfterglows.forEach((afterglow)=>{
      if(afterglow.count > 0){
        afterglowCount += afterglow.count;
      }
  });
  return afterglowCount;
}

function showZeros(){
  var table = document.getElementById("countsTable");
  var cells = table.getElementsByTagName("td");
  for (var i = 0; i < cells.length; i++) {
    if (parseInt(cells[i].textContent, 10) === 0 && cells[i].textContent.indexOf('0x') == -1) {
      cells[i].style.color = "orange";
    }
  }
}