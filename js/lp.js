let lostParadigmData = [];
let uniqueAttributes = null;
let templateAfterglow = null;
let afterglowContainer = null;
let start = 0;
let end = 20;
let myIds = null;
let myLPs = [];
let autoScroll = null;
let sort_type = 'matching';
let rarityStats = {};
let wallet = null;

window.addEventListener('load', async () => {
    initLPContracts();
    initTooltip();
    addEventlisteners();
    getRarityCounts();
    getMissingRarityCounts();
    var url = new URL(window.location);
    wallet = url.searchParams.get("wallet");
    document.querySelector("#btn-query").addEventListener("click", refreshAccountData);
    document.querySelector("#btn-all").addEventListener("click", loadAll);
    document.querySelector("#btn-filter").addEventListener("click", filter);

    // uniqueAttributes = getUniqueAttributes();
    templatelp = document.querySelector("#template-lp");
    lpContainer = document.querySelector("#lp-tbody");

    refresh();
});

function refresh(){
    let tokenID = document.getElementById('filter').value;
    if(tokenID == ''){
        if(wallet){
            document.querySelector("#address").value = wallet;
            refreshAccountData();
        } else {
            loadAll();
        }
    } else {
        filter();
    }
}

function filter(){
    let tokenID = document.getElementById('filter').value;
    if(tokenID == ''){
        refresh();
    } else {
        let data = [lp_data.find((token)=>token.name.split(' ')[2] == tokenID)];
        let allData = sortData(lp_data);
        data.forEach((token)=>{
            token.rank = allData.indexOf(token);
        });

        document.getElementById('lp-tbody').innerHTML = '';
        document.getElementById('lp_count').innerHTML = data.length;
        clearInterval(autoScroll);
        buildTable(data, 0, 1);
    }
}

function loadAll(){
    document.getElementById('filter').value = '';
    wallet = null;
    let el = document.getElementById('tableDiv');

    let allData = sortData(lp_data);
    allData.forEach((token)=>{
        token.rank = allData.indexOf(token);
    });

    clearInterval(autoScroll);
    autoScroll = setInterval(()=>{
        if(el.scrollHeight - (window.innerHeight + document.body.scrollTop) < 500){
            loadMore(allData);
        }
    }, 300)

    document.getElementById('lp-tbody').innerHTML = '';
    document.getElementById('lp_count').innerHTML = allData.length;
    buildTable(allData, start, end);
}

function sortData(data){
    let dataSorted = [].concat(data);
    let info = document.getElementById('progress');
    if(sort_type == 'matching'){
        info.innerHTML = 'Sorted by count of matching traits then by base rarity when count is equal.';
        dataSorted.sort((a, b) => {
            if(countMaxMatchingAttributes(b) == countMaxMatchingAttributes(a)){
                return getBaseRarity(a) - getBaseRarity(b);
            }
            return countMaxMatchingAttributes(b) - countMaxMatchingAttributes(a);
        })
    } else if(sort_type == 'rarity' || sort_type == 'extended_rarity'){
        dataSorted.sort((a, b) => {
            if(sort_type == 'rarity' ){
                info.innerHTML = 'Sorted by rarity of base traits all LPs have in common.';
        
                let totalA = getBaseRarity(a);
                let totalB = getBaseRarity(b);
    
                return totalA - totalB;
            } else if(sort_type == 'extended_rarity'){
                info.innerHTML = 'Sorted by rarity of all traits, LPs missing a trait get penalized. Rare traits increase score.';

                let totalA = getBaseRarity(a) + getExtendedRarity(a);
                let totalB = getBaseRarity(b) + getExtendedRarity(b);
    
                return totalA - totalB;
            }
        })
    } 
    else if(sort_type == 'destination'){
        info.innerHTML = 'Sorted by Destination rarity.';
        dataSorted.sort((a, b) => {
            return getRarityAttribute(a, 'Destination') - getRarityAttribute(b, 'Destination');
        })
    } else if(sort_type == 'planet'){
        info.innerHTML = 'Sorted by Planet rarity.';
        dataSorted.sort((a, b) => {
            return getRarityAttribute(a, 'Planet') - getRarityAttribute(b, 'Planet');
        })
    } else if(sort_type == 'road'){
        info.innerHTML = 'Sorted by Road rarity.';
        dataSorted.sort((a, b) => {
            return getRarityAttribute(a, 'Road') - getRarityAttribute(b, 'Road');
        })
    } else if(sort_type == 'sky'){
        info.innerHTML = 'Sorted by Sky rarity.';
        dataSorted.sort((a, b) => {
            return getRarityAttribute(a, 'Sky') - getRarityAttribute(b, 'Sky');
        })
    }
    return dataSorted;
}

function getExtendedRarity(token){
    let centerStage = getRarityAttribute(token, 'Center Stage');
    let eastLandmark = getRarityAttribute(token, 'East Landmark');
    let eastVenue = getRarityAttribute(token, 'East Venue');
    let westLandmark = getRarityAttribute(token, 'West Landmark');
    let westVenue = getRarityAttribute(token, 'West Venue');
    let traveler = getRarityAttribute(token, 'Traveler');
    let interaction = getRarityAttribute(token, 'Interaction');
    let aircraft = getRarityAttribute(token, 'Aircraft');
    let stray = getRarityAttribute(token, 'Stray');
    let parked = getRarityAttribute(token, 'Parked');
    let contender = getRarityAttribute(token, 'Contender');
    let rival = getRarityAttribute(token, 'Rival');
    let challenger = getRarityAttribute(token, 'Challenger');
    let incumbent = getRarityAttribute(token, 'Incumbent');
    let encounter = getRarityAttribute(token, 'Encounter');
    let mech = getRarityAttribute(token, 'Mech');
    let pet = getRarityAttribute(token, 'Pet');
    let crashed = getRarityAttribute(token, 'Crashed');
    return centerStage + eastLandmark + eastVenue + westLandmark + westVenue + traveler + interaction 
        + aircraft + stray + parked + contender + rival + challenger + incumbent + encounter + mech + pet + crashed;
}

function getBaseRarity(token){
    let eastLandscape = getRarityAttribute(token, 'East Landscape');
    let westLandscape = getRarityAttribute(token, 'West Landscape');
    let eastCityScape = getRarityAttribute(token, 'East City Scape');
    let westCityScape = getRarityAttribute(token, 'West City Scape');
    let destination = getRarityAttribute(token, 'Destination');
    let planet = getRarityAttribute(token, 'Planet');
    let road = getRarityAttribute(token, 'Road');
    let sky = getRarityAttribute(token, 'Sky');
    let hasEastLandscape = getAttribute(token, 'East Landscape') != 'missing';
    let hasWestLandscape = getAttribute(token, 'West Landscape') != 'missing';
    let eastScore = hasEastLandscape ? eastLandscape : eastCityScape;
    let westScore = hasWestLandscape ? westLandscape : westCityScape;
    return destination + planet + road + sky + eastScore + westScore;
}

function getRarity(token){
    rarityStats['Planet']
}

function getRarityAttribute(token, att){
    let trait_type = getAttribute(token, att);
    return rarityStats[att][trait_type];
}

async function refreshAccountData() {
    let address = document.querySelector("#address").value;
    if(address == ''){
      alert('You must enter a wallet address first!');
      return;
    }
    window.history.pushState("", "", window.location.href.split('?')[0] + '?wallet=' + address);
    document.getElementById('builder_url').href = 'builder.html?wallet='+address;
    document.getElementById('home_url').href = 'index.html?wallet='+address;

    wallet = address;
    
    // Get the token balances
    myIds = await getLostParadigmsTokenBalance(address);

    myLPs = [];
    lp_data.forEach((token)=>{
        let index = token.name.split(' ')[2];
        if(myIds.indexOf(index) != -1){
            myLPs.push(token);
        }
    });
    let data = sortData(myLPs);
    let allData = sortData(lp_data);
    data.forEach((token)=>{
        token.rank = allData.indexOf(token);
    });
    clearInterval(autoScroll);
    document.getElementById('lp-tbody').innerHTML = '';
    document.getElementById('lp_count').innerHTML = data.length;
    buildTable(data, 0, data.length);
}

function getIndex(data, token){
    let index = token.name.split(' ')[2];
    allData.find((t)=>t.name == token.name);
}

function loadMore(data){
    start+=10;
    end+=10;
    buildTable(data, start, end);
}

function countMaxMatchingAttributes(token){
    let attCounts = {};
    token.attributes.forEach((att)=>{
        if(!attCounts[att.value]){
            attCounts[att.value] = 0;
        }
        attCounts[att.value]++;
    });
    let max = 0;
    let maxName = '';
    Object.keys(attCounts).forEach((att)=>{
        if(attCounts[att] > max){
            max = attCounts[att];
            maxName = att;
        }
    });
    return max;
}

async function getAllMetadata(){
    let url = 'https://metadata.lostparadigms.xyz/metadata/';
    for(let i=0; i<3333; i++){
        try {
            let res = await fetch(url + i + '.json');
            let metadata = await res.json();
            lostParadigmData.push(metadata);
            console.log('Got', i);
        } catch (error) {
            console.log(error);
        }
    }
    console.log('done', lostParadigmData);
}

function getUniqueAttributes(){
    let uniqueAtt = [];
    lp_data.forEach((token)=>{
        token.attributes.forEach((att)=>{
            if(uniqueAtt.indexOf(att.trait_type) == -1){
                uniqueAtt.push(att.trait_type);
            }
        })
    });
    return uniqueAtt;
}

function getAttribute(token, name){
    let value = null;
    for(let i=0; i<token.attributes.length; i++){
        if(token.attributes[i].trait_type == name){
            value = token.attributes[i].value;
            break;
        }
    }
    return value ? value : 'missing';
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

function bigImg(e, elm, index){
    var top  = getOffsetTop(elm)  + "px";
    let url = 'https://metadata.lostparadigms.xyz/images-half/'+index+'.png';
    document.getElementById('full_size_image').setAttribute('src', url);
    document.getElementById('viewer').style.top = top;
    document.getElementById('viewer').style.display = 'block';
}

function smallImg(){
    document.getElementById('viewer').style.display = 'none';
}

function buildTable(data, start, end){
    data.splice(start, end).forEach((token, i)=>{
        let index = token.name.split(' ')[2];
        const clone = templatelp.content.cloneNode(true);
        clone.querySelector(".token").innerHTML = '<a target="_blank" href="https://opensea.io/assets/ethereum/0x067154450e59e81ed6bad1bbee459bd7cc2236ea/'+index+'"><img onmouseover="bigImg(event, this, \''+index+'\')"  onmouseout="smallImg()" src="https://metadata.lostparadigms.xyz/images-half/'+index+'.png"></a>';

        clone.querySelector(".destination").textContent = getAttribute(token, 'Destination');
        if(token.rank){
            clone.querySelector(".rank").textContent = token.rank+1;
        } else {
            clone.querySelector(".rank").textContent = i+1;
        }

        let east = [];
        if(getAttribute(token, 'East Landscape') != 'missing'){
            // east.push('<span class="att_label">Landscape:</span> '+getAttribute(token, 'East Landscape'));
            east.push('<span title="Landcape" class="landscape">' + getAttribute(token, 'East Landscape') + '</span>');
        }
        if(getAttribute(token, 'East City Scape') != 'missing'){
            // east.push('<span class="att_label">City Scape:</span> '+getAttribute(token, 'East City Scape'));
            east.push('<span title="City Scape" class="cityscape">' + getAttribute(token, 'East City Scape') + '</span>');
        }
        clone.querySelector(".east").innerHTML = east.join('<br>');

        let west = [];
        if(getAttribute(token, 'West Landscape') != 'missing'){
            // west.push('<span class="att_label">Landscape:</span> '+getAttribute(token, 'West Landscape'));
            west.push('<span title="Landcape" class="landscape">' + getAttribute(token, 'West Landscape') + '</span>');
        }
        if(getAttribute(token, 'West City Scape') != 'missing'){
            // west.push('<span class="att_label">City Scape:</span> '+getAttribute(token, 'West City Scape'));
            west.push('<span title="City Scape" class="cityscape">' + getAttribute(token, 'West City Scape') + '</span>');
        }
        clone.querySelector(".west").innerHTML = west.join('<br>');

        clone.querySelector(".planet").textContent = getAttribute(token, 'Planet');
        clone.querySelector(".road").textContent = getAttribute(token, 'Road');

        clone.querySelector(".sky").textContent = getAttribute(token, 'Sky');

        let misc = [];
        if(getAttribute(token, 'Center Stage') != 'missing'){
            misc.push('<span class="att_label">Center Stage:</span> '+getAttribute(token, 'Center Stage'));
        }
        if(getAttribute(token, 'East Landmark') != 'missing'){
            misc.push('<span class="att_label">Landmark:</span> '+getAttribute(token, 'East Landmark'));
        }
        if(getAttribute(token, 'East Venue') != 'missing'){
            misc.push('<span class="att_label">Venue:</span> '+getAttribute(token, 'East Venue'));
        }
        if(getAttribute(token, 'West Landmark') != 'missing'){
            misc.push('<span class="att_label">Landmark:</span> '+getAttribute(token, 'West Landmark'));
        }
        if(getAttribute(token, 'West Venue') != 'missing'){
            misc.push('<span class="att_label">Venue:</span> '+getAttribute(token, 'West Venue'));
        }
        if(getAttribute(token, 'Traveler') != 'missing'){
            misc.push('<span class="att_label">Traveler:</span> '+getAttribute(token, 'Traveler'));
        }
        if(getAttribute(token, 'Interaction') != 'missing'){
            misc.push('<span class="att_label">Interaction:</span> '+getAttribute(token, 'Interaction'));
        }
        if(getAttribute(token, 'Aircraft') != 'missing'){
            misc.push('<span class="att_label">Aircraft:</span> '+getAttribute(token, 'Aircraft'));
        }
        if(getAttribute(token, 'Stray') != 'missing'){
            misc.push('<span class="att_label">Stray:</span> '+getAttribute(token, 'Stray'));
        }
        if(getAttribute(token, 'Parked') != 'missing'){
            misc.push('<span class="att_label">Parked:</span> '+getAttribute(token, 'Parked'));
        }
        if(getAttribute(token, 'Contender') != 'missing'){
            misc.push('<span class="att_label">Contender:</span> '+getAttribute(token, 'Contender'));
        }
        if(getAttribute(token, 'Rival') != 'missing'){
            misc.push('<span class="att_label">Rival:</span> '+getAttribute(token, 'Rival'));
        }
        if(getAttribute(token, 'Challenger') != 'missing'){
            misc.push('<span class="att_label">Challenger:</span> '+getAttribute(token, 'Challenger'));
        }
        if(getAttribute(token, 'Incumbent') != 'missing'){
            misc.push('<span class="att_label">Incumbent:</span> '+getAttribute(token, 'Incumbent'));
        }
        if(getAttribute(token, 'Encounter') != 'missing'){
            misc.push('<span class="att_label">Encounter:</span> '+getAttribute(token, 'Encounter'));
        }
        if(getAttribute(token, 'Mech') != 'missing'){
            misc.push('<span class="att_label">Mech:</span> '+getAttribute(token, 'Mech'));
        }
        if(getAttribute(token, 'Pet') != 'missing'){
            misc.push('<span class="att_label">Pet:</span> '+getAttribute(token, 'Pet'));
        }
        if(getAttribute(token, 'Crashed') != 'missing'){
            misc.push('<span class="att_label">Crashed:</span> '+getAttribute(token, 'Crashed'));
        }
        clone.querySelector(".misc").innerHTML = misc.join('<br>');

        lpContainer.appendChild(clone);
    });
}

function addEventlisteners(){
    document.querySelector("#sort").addEventListener('change', (event)=>{
        sort_type = document.querySelector("#sort").value;
        console.log('sort changed', sort_type);
        refresh();
    })
}

function getRarityCounts(){
    lp_data.forEach((token)=>{
        let index = token.name.split(' ')[2];
        token.attributes.forEach((att)=>{
            if(!rarityStats[att.trait_type]){
                rarityStats[att.trait_type] = {};
            }
            if(!rarityStats[att.trait_type][att.value]){
                rarityStats[att.trait_type][att.value] = 0;
            }
            rarityStats[att.trait_type][att.value]++;
        });
    });
    console.log('Rarity:', rarityStats);
}

function getMissingRarityCounts(){
    Object.keys(rarityStats).forEach((trait_type)=>{
        lp_data.forEach((token)=>{
            let hasAttribute = false;
            token.attributes.forEach((att)=>{
                if(att.trait_type == trait_type){
                    hasAttribute = true;
                }
            });
            if(!hasAttribute){
                if(!rarityStats[trait_type]){
                    rarityStats[trait_type] = {};
                }
                if(!rarityStats[trait_type]['missing']){
                    rarityStats[trait_type]['missing'] = 0;
                }
                rarityStats[trait_type]['missing']++;
            }
        });
    })
}