"use strict";
let totalFullMechs = {};
let totalMixedMechs = {};
let totalMixedMechsNoAfterglow = {};
let totalParts = {};

function init() {
  initContracts();
  initTooltip();
}

window.addEventListener('load', async () => {
  init();
  calculateTotals();
  var url = new URL(window.location);
  var wallet = url.searchParams.get("wallet");
  if(wallet){
    document.querySelector("#address").value = wallet;
    refreshAccountData();
  }
  document.querySelector("#btn-query").addEventListener("click", refreshAccountData);

  getAccountRevealedParts('0xd387a6e4e84a6c86bd90c158c6028a58cc8ac459').then(console.log);

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
    let useBehemoth = document.querySelector('#use_behemoth').checked;
    dataModel.useLowest = document.querySelector('#use_lowest').checked;
    // Switch the rarity order when enabled
    if(useBehemoth){
      RARITY_ORDER = RARITY_ORDER_BEHEMOTH;
      MODEL_WEIGHTS = MODEL_WEIGHTS_BEHEMOTH;
    } else {
      RARITY_ORDER = ORIGINAL_RARITY_ORDER;
      MODEL_WEIGHTS = ORIGINAL_MODEL_WEIGHTS;
    }
    // Builds the wallet inventory parts tables
    buildPartCountsTable();
    buildPartsTable();
    buildAfterglowTable();

    // Build *full* mechs of same model table
    let fullMechs = buildFullMechs();
    buildFullMechTable(fullMechs);

    // Build *mixed* mechs **with** afterglow
    let mixedMechs = buildMixedMechs(true, false, false);
    buildMixedMechsTable(mixedMechs);
    buildMixedModelMechsSummaryTable(mixedMechs);

    // Build *mixed* mechs **without** afterglows
    let mixedMechsNoAfterglow = buildMixedMechs(false, false, false);
    buildMixedMechNoAfterglowTable(mixedMechsNoAfterglow);

    // Build *partial* mechs and show missing parts
    let mixedMechsPartial = buildMixedMechs(false, true, false);
    buildPartialMechTable(mixedMechsPartial);

    // Build *partial* mechs and show missing parts
    let mixedMechsPartialNoModel = buildMixedMechs(false, true, true);
    buildPartialMechNoModelTable(mixedMechsPartialNoModel);

    // Build remaining parts table
    buildRemainingPartsTable();

    displayTables();
}

function reset(){
  resetModel();
  // Purge UI elements any previously loaded accounts
  accountContainer.innerHTML = '';
  afterglowContainer.innerHTML = '';
  fullContainer.innerHTML = '';
  mixedContainer.innerHTML = '';
  mixedmechContainer.innerHTML = '';
  remainingContainer.innerHTML = '';
  mixedmechNoAfterglowContainer.innerHTML = '';
  mixedmechPartialContainer.innerHTML = '';
  mixedmechPartialNoModelContainer.innerHTML = '';
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
    return MODEL_WEIGHTS[a.model] - MODEL_WEIGHTS[b.model];
  })
}

async function fetchAccountData() {
  let address = document.querySelector("#address").value;
  if(address == ''){
    alert('You must enter a wallet address first!');
    return;
  }
  window.history.pushState("", "", window.location.href.split('?')[0] + '?wallet=' + address);
  document.getElementById('builder_url').href = 'builder.html?wallet='+address;
  document.getElementById('revealed_url').href = 'revealed.html?wallet='+address;
  document.getElementById('lp_url').href = 'lp.html?wallet='+address;
  // reset model, data and tables
  reset();

  dataModel.walletParts = await populateWalletMechParts(address);
  let totalParts = countParts(dataModel.walletParts);
  document.querySelector("#part_count").innerHTML = '('+totalParts+')';

  dataModel.walletAfterglows = await populateWalletAfterglows(address);
  dataModel.remainingAfterglows = countParts(dataModel.walletAfterglows);
  document.querySelector("#afterglow_count").innerHTML = '('+dataModel.remainingAfterglows+')';

  // Combine lupis arms and sort by rarity
  fixAndSortParts();

  // Build the model part count map
  dataModel.walletParts.forEach((part)=>{
    dataModel.modelParts[part.model][part.part] = part.count;
  });
}

function displayTables(){
  document.querySelector("#info").display = 'none';
  document.querySelector("#info2").display = 'none';
  document.querySelector("#instructions").display = 'none';
  document.querySelector("#connected").style.display = "block";
}

function dismantle(model){
  dataModel.dismantled[model]++;
  refreshAccountData();
}

function assemble(model){
  dataModel.dismantled[model]--;
  refreshAccountData();
}

function calculateTotals(){
  orderedCachedWalletData.forEach((data)=>{
    let fullMechs = data.fullMechs;
    let mixedMechs = data.mixedMechs;
    let mixedMechsNoAfterglow = data.mixedMechsNoAfterglow;
    let modelParts = data.modelParts;

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

    Object.keys(mixedMechsNoAfterglow).forEach((model)=>{
      if(!totalMixedMechsNoAfterglow[model]){
        totalMixedMechsNoAfterglow[model] = 0;
      }
      totalMixedMechsNoAfterglow[model] += mixedMechsNoAfterglow[model].length;
    });

    Object.keys(modelParts).forEach((model)=>{
      if(!totalParts[model]){
        totalParts[model] = {};
      }
      PARTS_ORDER.forEach((part)=>{
        if(!totalParts[model][part]){
          totalParts[model][part] = 0;
        }
        totalParts[model][part] += modelParts[model][part];
      })
    });
  });

  console.log('totalFullMechs', totalFullMechs);
  console.log('totalMixedMechs', totalMixedMechs);
  console.log('totalMixedMechsNoAfterglow', totalMixedMechsNoAfterglow);
  console.log('totalParts', totalParts);
}

