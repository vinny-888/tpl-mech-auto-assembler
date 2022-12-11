"use strict";
let completedMechs = {};
let selectedBroker = null;
let progressDiv = null;

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
function init() {
  initContracts()
  initTooltip();
}

window.addEventListener('load', async () => {
  init();
  addEventlisteners();
  progressDiv = document.getElementById('progress');
  var url = new URL(window.location);
  var wallet = url.searchParams.get("wallet");
  if(wallet){
    document.querySelector("#address").value = wallet;
    displayTables();
    refreshAccountData();
  }
  document.querySelector("#btn-query").addEventListener("click", refreshAccountData);
});

async function refreshAccountData() {
  document.querySelector("#connected").style.display = "none";
  document.querySelector("#instructions").style.display = "none";

  let address = document.querySelector("#address").value;
  if(address == ''){
    alert('You must enter a wallet address first!');
    return;
  }
  window.history.pushState("", "", window.location.href.split('?')[0] + '?wallet=' + address);
  document.getElementById('home_url').href = 'index.html?wallet='+address;
  document.getElementById('lp_url').href = 'lp.html?wallet='+address;

  await fetchAccountData(address);
  updateTable( address);

  refreshTables();

  if(dataModel.cyberBrokers.length > 0){
    selectCyberbroker(dataModel.cyberBrokers[0].tokenId);
    selectedBroker = dataModel.cyberBrokers[0].tokenId;
  }
}

function refreshTables(){
  let fullMechs = JSON.parse(JSON.stringify(completedMechs.fullMechs));
  let mixedMechs = JSON.parse(JSON.stringify(completedMechs.mixedMechs));
  let mixedMechsNoAfterglow = JSON.parse(JSON.stringify(completedMechs.mixedMechsNoAfterglow));
  let afterglows = JSON.parse(JSON.stringify(dataModel.walletAfterglows));

  dataModel.cyberBrokers.forEach((broker)=>{
    if(!broker.mech){
      let model = getNextMech(fullMechs, mixedMechs, mixedMechsNoAfterglow);
      broker.mech = model;
    }
    if(!broker.afterglow){
      let afterglow = getNextAfterglow(afterglows);
      broker.afterglow = afterglow;
    }
  });

  buildCyberbrokerTable();
}

function buildMechSelect(fullMechs, mixedMechs, mixedMechsNoAfterglow, selectedModel){
  let models = [];
  for(let i=0;i<RARITY_ORDER.length; i++){
    let model = RARITY_ORDER[i];
    if(fullMechs[model] && fullMechs[model].length > 0){
        if(models.indexOf(model) == -1){
          models.push(model);
        }
    } else if(mixedMechs[model] && mixedMechs[model].length > 0){
        if(models.indexOf(model) == -1){
          models.push(model);
        }
    } else if(mixedMechsNoAfterglow[model] && mixedMechsNoAfterglow[model].length > 0){
        if(models.indexOf(model) == -1){
          models.push(model);
        }
    }
  }
  let modelHtml = ''
  models.forEach((model)=>{
    let selected = '';
    if(selectedModel == model){
      selected = 'selected';
    }
    modelHtml += '<option value="'+model+'" '+selected+'>'+model+'</option>';
  });
  document.querySelector("#mech_model").innerHTML = modelHtml;
}

function buildAfterglowSelect(afterglows, selectedAfterglow){
  let afterglowHtml = '';
  afterglows.forEach((afterglow)=>{
    let selected = '';
    if(selectedAfterglow == afterglow.name){
      selected = 'selected';
    }
    if(afterglow.count > 0){
      afterglowHtml += '<option value="'+afterglow.name+'" '+selected+'>'+afterglow.name+'</option>';
    }
  });
  document.querySelector("#afterglow_type").innerHTML = afterglowHtml;
}

function buildMechCountsTable(fullMechs, mixedMechs, mixedMechsNoAfterglow, model){
  const clone = templateMechCounts.content.cloneNode(true);
  clone.querySelector(".model").textContent = model;
  if(model != 'Total'){
    let fullCount = fullMechs[model] ? fullMechs[model] : 0;
    let mixedNoAfterglowCount = mixedMechsNoAfterglow[model] ? mixedMechsNoAfterglow[model] : 0;
    let mixedCount =  mixedMechs[model] ? mixedMechs[model] : 0;
    clone.querySelector(".full").textContent = fullCount;
    clone.querySelector(".mixed").textContent = mixedCount;
    clone.querySelector(".mixed_no_afterglow").textContent = mixedNoAfterglowCount;
    clone.querySelector(".total").textContent = fullCount + mixedCount + mixedNoAfterglowCount;
  } else {
    let totalFull = 0;
    let totalMixed = 0;
    let totalMixedNoAfterglow = 0;
    RARITY_ORDER.forEach((model)=>{
      let fullCount = fullMechs[model] ? fullMechs[model] : 0;
      let mixedNoAfterglowCount = mixedMechsNoAfterglow[model] ? mixedMechsNoAfterglow[model] : 0;
      let mixedCount =  mixedMechs[model] ? mixedMechs[model] : 0;
      totalFull += fullCount;
      totalMixed += mixedNoAfterglowCount;
      totalMixedNoAfterglow += mixedCount;
    });
    clone.querySelector(".full").textContent = totalFull;
    clone.querySelector(".mixed").textContent = totalMixed;
    clone.querySelector(".mixed_no_afterglow").textContent = totalMixedNoAfterglow;
    clone.querySelector(".total").textContent = totalFull+totalMixed+totalMixedNoAfterglow;
    document.querySelector("#mech_count").innerHTML = '('+(totalFull+totalMixed+totalMixedNoAfterglow)+')';
  }
  mechCountsContainer.appendChild(clone);
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

async function fetchAccountData(address) {

  // reset model, data and tables
  reset();

  dataModel.walletParts = await populateWalletMechParts(address);

  dataModel.walletAfterglows = await populateWalletAfterglows(address);
  dataModel.remainingAfterglows = countParts(dataModel.walletAfterglows);

  // Combine lupis arms and sort by rarity
  fixAndSortParts();

  // Build the model part count map
  dataModel.walletParts.forEach((part)=>{
    dataModel.modelParts[part.model][part.part] = part.count;
  });
  progressDiv.innerHTML = 'Getting Tokens...';
  let tokenIds = await getCyberbrokerTokenBalance(address);
  progressDiv.innerHTML = ' - Loaded 0/'+tokenIds.length;
  for(let i=0; i<tokenIds.length; i++){
    let tokenId = tokenIds[i];
    let broker = {};
    broker.tokenId = tokenId;
    
    let uri = await getCyberbrokerTokenURI(tokenId);
    uri = uri.replace('data:application/json;utf8,', '');
    broker.uri = JSON.parse(uri);
    dataModel.cyberBrokers.push(broker);
    progressDiv.innerHTML = ' - Loaded '+(i+1)+'/'+tokenIds.length;
  }
}

function reset(){
  resetModel();
  // Purge UI elements any previously loaded accounts
  cyberbrokerCountsContainer.innerHTML = '';
}

function countMechModels(fullMechs, mixedMechs, mixedMechsNoAfterglow){
  let totalFullMechs = {};
  let totalMixedMechs = {};
  let totalMixedMechsNoAfterglow = {};
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

  console.log('totalFullMechs', totalFullMechs);
  console.log('totalMixedMechs', totalMixedMechs);
  console.log('totalMixedMechsNoAfterglow', totalMixedMechsNoAfterglow);

  RARITY_ORDER.forEach((model)=>{
    buildMechCountsTable(totalFullMechs, totalMixedMechs, totalMixedMechsNoAfterglow, model);
  });
  buildMechCountsTable(totalFullMechs, totalMixedMechs, totalMixedMechsNoAfterglow, 'Total');
}

function updateTable(address){

  // Build *full* mechs of same model table
  let fullMechs = buildFullMechs(address);

  // Build *mixed* mechs **with** afterglow
  let mixedMechs = buildMixedMechs(address, true, false, false);

  // Build *mixed* mechs **without** afterglows
  let mixedMechsNoAfterglow = buildMixedMechs(address, false, false, false);

  completedMechs = {
    fullMechs,
    mixedMechs,
    mixedMechsNoAfterglow
  };

  countMechModels(fullMechs, mixedMechs, mixedMechsNoAfterglow);

  highlightZeros();
  highlightTotal();
  displayTables();
}

function displayTables(){
  document.querySelector("#connected").style.display = "block";
}

function highlightZeros(){
  var table = document.getElementById("mechCountsTable");
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
  var cells1 = table1.getElementsByTagName("tr");
  cells1[cells1.length-1].style.backgroundColor = backgroundColor;
  cells1[cells1.length-1].style.color = color;
  cells1[cells1.length-1].style.fontWeight = 'bold';
  var cells1a = table1.getElementsByTagName("td");
  for (var i = 4; i < cells1a.length; i+=5) {
    cells1a[i].style.backgroundColor = backgroundColor;
    cells1a[i].style.color = color;
    cells1a[i].style.fontWeight = 'bold';
  }
}

function selectCyberbroker(tokenId){
  console.log('Selected CyberBroker', tokenId);

  // document.querySelector("#builder_img").setAttribute('src', 'https://ipfs.io/ipfs/QmcsrQJMKA9qC9GcEMgdjb9LPN99iDNAg8aQQJLJGpkHxk/'+tokenId+'.svg');

  let broker = dataModel.cyberBrokers.find((broker)=>broker.tokenId == tokenId);
  let mech = broker.mech ? broker.mech : 'missing';
  let grid = document.getElementById('mechGrid')
  grid.innerHTML = buildMechGrid(mech, tokenId);

  let colors = afterglowColors[broker.afterglow];
  let color = 'background-color: '+colors[0]+';';
  if(colors.length == 2){
    color = 'background-image: linear-gradient(to bottom, '+colors[0]+', '+colors[1]+');';
    color += 'background-image: -webkit-linear-gradient(to bottom, '+colors[0]+', '+colors[1]+');';
    color += 'background-image: -moz-linear-gradient(to bottom, '+colors[0]+', '+colors[1]+');';
  }
  grid.style = color;
  let afterglow = broker.afterglow ? broker.afterglow+'.avif' : 'missing.png';
  document.querySelector("#engine_img").setAttribute('src', './images/parts/'+mech+'_Engine.png');
  document.querySelector("#afterglow_img").setAttribute('src', './images/afterglows/'+afterglow);
  showBuilderDiv();
  Array.from(document.getElementsByClassName('clickable')).forEach((row)=>{
    row.classList.remove('selected');
  })
  document.querySelector('#cyberbroker_' + tokenId).classList.add('selected');
  
  selectedBroker = tokenId;

  let fullMechs = JSON.parse(JSON.stringify(completedMechs.fullMechs));
  let mixedMechs = JSON.parse(JSON.stringify(completedMechs.mixedMechs));
  let mixedMechsNoAfterglow = JSON.parse(JSON.stringify(completedMechs.mixedMechsNoAfterglow));
  buildMechSelect(fullMechs, mixedMechs, mixedMechsNoAfterglow, broker.mech);

  let afterglows = JSON.parse(JSON.stringify(dataModel.walletAfterglows));
  buildAfterglowSelect(afterglows, broker.afterglow);
}

function showBuilderDiv(){
  document.querySelector("#builderDiv").style.display = 'block';
  document.querySelector("#builderDivEmpty").style.display = 'none';
}

function addEventlisteners(){
  document.querySelector("#mech_model").addEventListener('change', (event)=>{
    let val = document.querySelector("#mech_model").value;
    console.log('mech_model changed', val);
    let broker = dataModel.cyberBrokers.find((broker)=>broker.tokenId == selectedBroker);
    broker.mech = val;
    refreshTables();
    selectCyberbroker(selectedBroker);
  })
  document.querySelector("#afterglow_type").addEventListener('change', (event)=>{
    let val = document.querySelector("#afterglow_type").value;
    console.log('afterglow_type changed', val);
    let broker = dataModel.cyberBrokers.find((broker)=>broker.tokenId == selectedBroker);
    broker.afterglow = val;
    refreshTables();
    selectCyberbroker(selectedBroker);
  })
}

function buildMechGrid(model, tokenId){

  let head = './images/parts/'+model+'_Head.png';
  let body = './images/parts/'+model+'_Body.png';
  let engine = './images/parts/'+model+'_Engine.png';
  let arm = './images/parts/'+model+'_Arm.png';
  let leg = './images/parts/'+model+'_Leg.png';
  let broker = 'https://ipfs.io/ipfs/QmcsrQJMKA9qC9GcEMgdjb9LPN99iDNAg8aQQJLJGpkHxk/'+tokenId+'.svg'
  

  let html = `<div class="wrapper">
                <div></div>
                <div><img class="partGrid" src="${head}"></div>
                <div></div>
              </div>
              <div class="wrapper">
                <div><img class="partGrid" src="${arm}"></div>
                <div><img class="partGrid" src="${broker}"></div>
                <div><img class="partGrid" src="${arm}"></div>
              </div>
              <!--<div class="wrapper">
                <div></div>
                <div><img class="partGrid" src="${engine}"></div>
                <div></div>
              </div>-->
              <div class="wrapper">
                <div></div>
                <div><img class="partGrid" src="${body}"></div>
                <div></div>
              </div>
              <div class="wrapper">
                <div></div>
                <div><img class="partGrid" src="${leg}"></div>
                <div></div>
              </div>`;
  return html;
}