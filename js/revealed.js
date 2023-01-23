"use strict";
let totalFullMechs = {};
let totalMixedMechs = {};
let totalMixedMechsNoAfterglow = {};
let totalParts = {};

function init() {
  initContracts();
  initTooltip();
  createMetadataLookup();
}

window.addEventListener('load', async () => {
  dataModel.useStyles = true;
  init();
  calculateTotals();
  var url = new URL(window.location);
  var wallet = url.searchParams.get("wallet");
  if(wallet){
    document.querySelector("#address").value = wallet;
    refreshAccountData();
  }
  document.querySelector("#btn-query").addEventListener("click", refreshAccountData);
});

async function refreshAccountData() {
  let address = document.querySelector("#address").value;
  if(address == ''){
    alert('You must enter a wallet address first!');
    return;
  }
  window.history.pushState("", "", window.location.href.split('?')[0] + '?wallet=' + address);
  document.getElementById('builder_url').href = 'builder.html?wallet='+address;
  document.getElementById('home_url').href = 'index.html?wallet='+address;

  
  // dataModel.useStyles = document.querySelector('#use_styles').checked;
  document.querySelector("#connected").style.display = "none";
  document.querySelector("#info").style.display = "none";
  document.querySelector("#info2").style.display = "none";
  document.querySelector("#instructions").style.display = "none";

  await fetchAccountData(provider);
  buildTablesAndMechs();
}

function buildTablesAndMechs(){
    let usePartial = document.querySelector('#use_partial').checked;
    // let useBehemoth = document.querySelector('#use_behemoth').checked;
    // dataModel.useLowest = document.querySelector('#use_lowest').checked;
    // dataModel.useStyles = document.querySelector('#use_styles').checked;
    // Switch the rarity order when enabled
    if(useBehemoth){
      RARITY_ORDER = RARITY_ORDER_BEHEMOTH;
      MODEL_WEIGHTS = MODEL_WEIGHTS_BEHEMOTH;
    } else {
      RARITY_ORDER = ORIGINAL_RARITY_ORDER;
      MODEL_WEIGHTS = ORIGINAL_MODEL_WEIGHTS;
    }

    var url = new URL(window.location);
    var wallet = url.searchParams.get("wallet");

    let tables = [mechStatsNexusContainer,mechStatsLupisContainer,mechStatsBehemothContainer,mechStatsRavagerContainer,mechStatsEnforcerContainer ];
    RARITY_ORDER.forEach((model, index)=>{
      buildMechStats(model, tables[index]);
    });
    highlightTotal();

    // Builds the wallet inventory parts tables
    buildPartCountsTable();
    buildPartsStylesTable(wallet);
    buildAfterglowTable();

    // Build *full* mechs of same model table
    // let fullMechs = buildFullMechs();
    // buildFullMechTable(fullMechs);

    let fullMechs = [];

    if(dataModel.useStyles){
      fullMechs = buildFullModelMechStyles();
      buildFullMechStylesTable(fullMechs);
    } else {
      fullMechs = buildFullMechs();
      buildFullMechTable(fullMechs);
    }

    // Build *mixed* mechs **with** afterglow
    // let mixedMechs = buildMixedMechs(true, false, false);
    // buildMixedMechsTable(mixedMechs);
    // buildMixedModelMechsSummaryTable(mixedMechs);

    // // Build *mixed* mechs **without** afterglows
    // let mixedMechsNoAfterglow = buildMixedMechs(false, false, false);
    // buildMixedMechNoAfterglowTable(mixedMechsNoAfterglow);

    // Build *partial* mechs and show missing parts
    // let mixedMechsPartial = buildMixedMechs(false, true, false);
    if(usePartial){
      let mixedMechsPartial = buildMixedMechsStyles(false, true, false);
      buildPartialMechStylesTable(mixedMechsPartial);
    } else {
      document.querySelector("#partial_count").innerHTML = '(0)';
    }
    // Build *partial* mechs and show missing parts
    let sameModelMechs = buildSameModelMechsStyles(false, false, false);
    buildSameModelStylesTable(sameModelMechs);
    buildSameModelMechsStylesSummaryTable(sameModelMechs);

    let mixedModelMechs = [];
    let foundMechs = true;
    while(foundMechs){
      let mechs = buildMixedModelMechsStyles(false, false, false);
      mixedModelMechs.concat(mechs);
      if(Object.keys(mechs).length == 0){
        foundMechs = false;
      }
    }
    buildMixedModelStylesTable(mixedModelMechs);
    buildMixedModelMechsStylesSummaryTable(mixedModelMechs);


    let mixedModelPartialMechs = [];
    let foundPartialMechs = true;
    while(foundPartialMechs){
      let mechs = buildMixedModelMechsStyles(false, true, true);
      // mixedModelPartialMechs.concat(mechs);
      mixedModelPartialMechs = {
        ...mixedModelPartialMechs,
        ...mechs,
      };
      if(Object.keys(mechs).length == 0){
        foundPartialMechs = false;
      }
    }
    buildPartialMechTable2(mixedModelPartialMechs);
    buildPartialModelMechsSummaryTable(mixedModelPartialMechs);


    // Build remaining parts table
    buildRemainingPartsStylesTable(wallet);

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
  mixedmechSameModelContainer.innerHTML = '';
  mixedmechMixedModelContainer.innerHTML = '';
  countsContainer.innerHTML = '';
  mechStatsNexusContainer.innerHTML = '';
  mechStatsLupisContainer.innerHTML = '';
  mechStatsBehemothContainer.innerHTML = '';
  mechStatsRavagerContainer.innerHTML = '';
  mechStatsEnforcerContainer.innerHTML = '';
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
  document.getElementById('lp_url').href = 'lp.html?wallet='+address;
  // reset model, data and tables
  reset();

  // dataModel.walletParts = await populateWalletMechParts(address);

  let count =0;
  if(dataModel.useStyles){
    let totalSupply = await getRevealedMechTotalSupply();

    let revealedTokenIds = await getRevealedMechTokenBalance(address, totalSupply);
    revealedTokenIds.forEach((tokenId)=>{
      // let metadata = await getRevealedMechTokenMetadata(tokenId);
      // let model = BODY_PART_MODEL_MAPPING[metadata.model];
      // let part = BODY_PART_MAPPING[metadata.partType];
      let tokenMetadata = revealedMetadata[''+tokenId];
      if(tokenMetadata){
        let model = tokenMetadata.attributes.find((att)=> att.trait_type == 'Model').value;
        let part = tokenMetadata.attributes.find((att)=> att.trait_type == 'Part').value;
        if(part == 'Legs'){
          part = 'Leg';
        }
        let style = tokenMetadata.attributes.find((att)=> att.trait_type == 'Style').value;
        if(!dataModel.modelParts[model]){
          dataModel.modelParts[model] = {};
        }
        if(!dataModel.modelParts[model][part]){
          dataModel.modelParts[model][part] = {};
        }
        if(!dataModel.modelParts[model][part][style]){
          dataModel.modelParts[model][part][style] = 0;
        }
        dataModel.modelParts[model][part][style]++;
        count++;
      }
    })

    revealedTokenIds.forEach((tokenId)=>{
      let tokenMetadata = revealedMetadata[''+tokenId];
      if(tokenMetadata){
        let model = tokenMetadata.attributes.find((att)=> att.trait_type == 'Model').value;
        let part = tokenMetadata.attributes.find((att)=> att.trait_type == 'Part').value;
        if(part == 'Legs'){
          part = 'Leg';
        }
        let style = tokenMetadata.attributes.find((att)=> att.trait_type == 'Style').value;
        dataModel.walletParts[tokenId] = {
          tokenId,
          model,
          part,
          style,
          count: dataModel.modelParts[model][part][style]
        };
      }
    });
  } else {
    dataModel.walletParts = await populateWalletMechParts(address);
  }

  

  

  let totalParts = count;//countParts(dataModel.walletParts);
  document.querySelector("#part_count").innerHTML = '('+totalParts+')';

  dataModel.walletAfterglows = await populateWalletAfterglows(address);
  dataModel.remainingAfterglows = countParts(dataModel.walletAfterglows);
  document.querySelector("#afterglow_count").innerHTML = '('+dataModel.remainingAfterglows+')';

  // Combine lupis arms and sort by rarity
  if(!dataModel.useStyles){
    fixAndSortParts();
  }

  // Build the model part count map
  dataModel.walletParts.forEach((part)=>{
    if(dataModel.useStyles){
      // if(!dataModel.modelParts[part.model][part.part]){
      //   dataModel.modelParts[part.model][part.part] = {};
      // }
      // for(let i=0; i< part.count; i++){
      //   // let style = getRandomStyle();
      //   let style = 
      //   if(!dataModel.modelParts[part.model][part.part][style]){
      //     dataModel.modelParts[part.model][part.part][style] = 0;
      //   }
      //   dataModel.modelParts[part.model][part.part][style]++;
      // }
    } else {
      dataModel.modelParts[part.model][part.part] = part.count;
    }
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

function getOffsetTop( elem )
{
    var offsetTop = 0;
    do {
      if ( !isNaN( elem.offsetTop ) )
      {
        offsetTop += elem.offsetTop;
      }
    } while( elem = elem.offsetParent );
    return offsetTop;
}

function bigImg(e, elm, url){
  var top  = getOffsetTop(elm)  + "px";
  document.getElementById('full_size_image').setAttribute('src', url);
  document.getElementById('viewer').style.top = top;
  document.getElementById('viewer').style.display = 'block';
}

function smallImg(){
  document.getElementById('viewer').style.display = 'none';
}

function bigImgMixed(e, elm, head, body, legs, left_arm, right_arm){
  var top  = (getOffsetTop(elm)-200)  + "px";
  // document.getElementById('full_size_image').setAttribute('src', url);
  
  document.getElementById('viewer2').style.top = top;
  document.getElementById('viewer2').style.display = 'block';

  showPreview(head, body, legs, left_arm, right_arm);
}

function smallImgMixed(){
  document.getElementById('viewer2').style.display = 'none';
}

/*
let metadata = {};
for(let i=12002; i<=12392; i++){
    let index = i;
    setTimeout(()=>{
        fetch('https://m.cyberbrokers.com/eth/part/'+index)
          .then((response) => response.json())
          .then((data) => {
              console.log(index)
              metadata[data.tokenId] = data;
        });
    }, (index-12002) * 200);
}
*/

function highlightTotal(){
  let color = '#71d0c6';
  let backgroundColor = '#181818';
  var table1 = document.getElementById("mechCountsTableNexus");
  var table2 = document.getElementById("mechCountsTableLupis");
  var table3 = document.getElementById("mechCountsTableBehemoth");
  var table4 = document.getElementById("mechCountsTableRavager");
  var table5 = document.getElementById("mechCountsTableEnforcer");

  let tables = [table1, table2, table3, table4, table5];
  tables.forEach((table)=>{
    var cells1 = table.getElementsByTagName("tr");
    cells1[cells1.length-1].style.backgroundColor = backgroundColor;
    cells1[cells1.length-1].style.color = color;
    cells1[cells1.length-1].style.fontWeight = 'bold';
    var cells1a = table.getElementsByTagName("td");
    for (var i = 6; i < cells1a.length; i+=7) {
      cells1a[i].style.backgroundColor = backgroundColor;
      cells1a[i].style.color = color;
      cells1a[i].style.fontWeight = 'bold';
    }
  })
}