"use strict";

function init() {
  initContracts()
  initTooltip();
}

window.addEventListener('load', async () => {
  init();
  document.querySelector("#btn-query").addEventListener("click", refreshAccountData);
});

async function refreshAccountData() {
  document.querySelector("#connected").style.display = "none";
  document.querySelector("#info").style.display = "none";
  document.querySelector("#info2").style.display = "none";
  document.querySelector("#instructions").style.display = "none";

  await fetchAccountData(provider);
  buildTablesAndMechs();
}

function buildTablesAndMechs(){
    buildPartsTable();
    buildPartCountsTable();
    buildAfterglowTable();
    buildFullMechTable();
    
    countMixedModelMechParts();
    countRemainingParts();

    buildFullMixedMechs();

    let mixedMechs = buildPartialMixedMechs(dataModel.mixedModelMechCountParts, false);
    buildMixedMechsTable(mixedMechs);
    buildMixedModelMechsSummaryTable(mixedMechs);

    let mixedMechsNoAfterglow = buildPartialMixedMechs(dataModel.mixedModelMechCountPartsNoAfterglow, false);
    buildMixedMechNoAfterglowTable(mixedMechsNoAfterglow);

    calculatePossibleMechsFromRemainingParts();

    let mixedMechsPartial = buildPartialMixedMechs(dataModel.partialMechCountParts, true);
    buildPartialMechTable(mixedMechsPartial);

    buildRemainingPartsTable();

    displayTables();
}

function resetWalletAndTables(){
  dataModel.remainingParts = {};
  dataModel.fullModelMechs = {
    Enforcer: {},
    Ravenger: {},
    Lupis: {},
    Behemoth: {},
    Nexus: {}
  };
  // Purge UI elements any previously loaded accounts
  accountContainer.innerHTML = '';
  afterglowContainer.innerHTML = '';
  fullContainer.innerHTML = '';
  mixedContainer.innerHTML = '';
  mixedmechContainer.innerHTML = '';
  remainingContainer.innerHTML = '';
  mixedmechNoAfterglowContainer.innerHTML = '';
  mixedmechPartialContainer.innerHTML = '';
  countsContainer.innerHTML = '';
}

function fixAndSortParts(){
  /* Combine lupis arms with pirate lupis arms */
  dataModel.walletParts[1].count += dataModel.walletParts[19].count;
  // Remove the extra arms
  dataModel.walletParts.splice(19, 1);

  /* Sort by Model and Part in Rarity Order not Alphabetical */
  dataModel.walletParts.sort((a, b) => {
    if(a.model == b.model){
      return a.part.localeCompare(b.part);
    }
    return weights[a.model] - weights[b.model];
  })
}

async function fetchAccountData() {
  let address = document.querySelector("#address").value;
  if(address == ''){
    alert('You must enter a wallet address first!');
    return;
  }

  // reset model and tables
  resetWalletAndTables();

  dataModel.walletParts = await populateWalletMechParts(address);
  dataModel.totalParts = countParts(dataModel.walletParts);
  document.querySelector("#part_count").innerHTML = '('+dataModel.totalParts+')';

  dataModel.walletAfterglows = await populateWalletAfterglows(address);
  dataModel.totalAfterglows = countParts(dataModel.walletAfterglows);
  document.querySelector("#afterglow_count").innerHTML = '('+dataModel.totalAfterglows+')';

  // Combine lupis arms and sort by rarity
  fixAndSortParts();

  // Build the model part count map
  dataModel.walletParts.forEach((part)=>{
    dataModel.fullModelMechs[part.model][part.part] = part.count;
  });
}

function countMixedModelMechParts(){
  Object.keys(dataModel.mixedModelMechCountParts).forEach((mech)=>{
    dataModel.mixedModelMechCountParts[mech].forEach((parts)=>{
      parts.forEach((part)=>{
        if(!dataModel.mixedModelMechs[part.model][part.part]){
          dataModel.mixedModelMechs[part.model][part.part] = 0;
        }
        dataModel.mixedModelMechs[part.model][part.part]++;
      });
    })
  })
}

function countRemainingParts(){
  Object.keys(dataModel.fullModelMechs).forEach((model)=>{
    let fullMechParts = dataModel.fullModelMechs[model];
    dataModel.remainingParts[model] = {
      Arm: fullMechParts['Arm'] - dataModel.fullModelMechCounts[model]*2 - (dataModel.mixedModelMechs[model]['Arm'] ? dataModel.mixedModelMechs[model]['Arm'] : 0),
      Legs: fullMechParts['Legs'] - dataModel.fullModelMechCounts[model] - (dataModel.mixedModelMechs[model]['Legs'] ? dataModel.mixedModelMechs[model]['Legs'] : 0),
      Head: fullMechParts['Head'] - dataModel.fullModelMechCounts[model] - (dataModel.mixedModelMechs[model]['Head'] ? dataModel.mixedModelMechs[model]['Head']  : 0),
      Body: fullMechParts['Body'] - dataModel.fullModelMechCounts[model] - (dataModel.mixedModelMechs[model]['Body'] ? dataModel.mixedModelMechs[model]['Body']  : 0),
      Engine: fullMechParts['Engine'] - dataModel.fullModelMechCounts[model] - (dataModel.mixedModelMechs[model]['Engine'] ?  dataModel.mixedModelMechs[model]['Engine'] : 0)
    };
  });
}

function calculatePossibleMechsFromRemainingParts(){
  rarityOrder.forEach((model)=>{
    let fullMechParts = dataModel.remainingParts[model];
    let partCounts = {
      Arm: 0,
      Legs: 0,
      Head: 0,
      Body: 0,
      Engine: 0
    };
    Object.keys(fullMechParts).forEach((part)=>{
      let count = parseInt(fullMechParts[part]);
      if(part != 'Arm'){
        partCounts[part] = count;
      } else {
        partCounts[part] = count;
      }
    });

    let engineCount = partCounts['Engine'];
    for(let i=0; i< engineCount; i++){
      let partOne = '';
      let partTwo = '';
      Object.keys(partCounts).forEach((part)=>{
        if(part != 'Engine'){
          if(partOne == '' && partCounts[part] > 0){
            partOne = part;
          } else if(partTwo == ''  && partCounts[part] > 0){
            if(partOne != part || (partOne == partTwo && partCounts[part] > 1)){
              partTwo = part;
            }
          }
        }
      })

      if(partOne != '' && partTwo != ''){
        if(!dataModel.partialMechCountParts[model]){
          dataModel.partialMechCountParts[model] = [];
        }
        partCounts[partOne]--;
        partCounts[partTwo]--;
        dataModel.partialMechCounts[model]++;
        dataModel.partialMechCountParts[model].push([
          {
            model: model,
            part: partOne
          },
          {
            model: model,
            part: partTwo
          },
        ]);
        dataModel.remainingAfterglows--;
      }
    }
  })
}

function displayTables(){
  document.querySelector("#info").display = 'none';
  document.querySelector("#info2").display = 'none';
  document.querySelector("#instructions").display = 'none';
  document.querySelector("#connected").style.display = "block";
}