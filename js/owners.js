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
let loadCached = true;
function init() {
  if(!loadCached){
    document.getElementById('download').style.display = 'block';
    initContracts();
  }
  initTooltip();
}

window.addEventListener('load', async () => {
  init();
  progressDiv = document.getElementById('progress');
  // refreshAccountData();
  loadTop100();
  document.querySelector("#btn-query").addEventListener("click", refreshAccountData);
  if(loadCached){
    countMechModels();
  }
  displayTables();
});

function getSortedKeysTotalParts(obj) {
  var keys = Object.keys(obj);
  return keys.sort(function(a,b){return obj[b].totalParts-obj[a].totalParts});
}

function getSortedWallets(walletData){
  let keys = getSortedKeysTotalParts(walletData);
  let sortedWallets = [];
  keys.forEach((address)=>{
    walletData[address].address = address;
    sortedWallets.push(walletData[address]);
  })
  // var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sortedWallets));
  // var dlAnchorElem = document.getElementById('downloadAnchorElem');
  // dlAnchorElem.setAttribute("href",     dataStr     );
  // dlAnchorElem.setAttribute("download", "data.js");
  // dlAnchorElem.click();
  return sortedWallets;
}

function download(){
  let sortedWallets = getSortedWallets(allData)
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sortedWallets));
  var dlAnchorElem = document.getElementById('downloadAnchorElem');
  dlAnchorElem.setAttribute("href",     dataStr     );
  dlAnchorElem.setAttribute("download", "data.js");
  dlAnchorElem.click();
}

function loadTop100(){
  displayTables();
  for(let i =0; i<100; i++){
    let data = orderedCachedWalletData[i];
    setTimeout(()=>{
      updateTable((i+1), data.address, data);
    },0);
  }

  let engineCount = 0;
  let armCount = 0;
  let neverClaimed = {};
  let accountsCount =0;
  orderedCachedWalletData.forEach((data)=>{
    if(data){
      let count = 0;
      let count2 = 0;
      Object.keys(data.modelParts).forEach((model)=>{
        ['Head', 'Body', 'Leg'].forEach((part)=>{
          count += data.modelParts[model][part];
        });
        ['Engine', 'Arm'].forEach((part)=>{
          count2 += data.modelParts[model][part];
        });
      })
      // Has not claimed any parts
      if(count == 0 && count2 != 0){
        accountsCount++;
        Object.keys(data.modelParts).forEach((model)=>{
          if(!neverClaimed[model]){
            neverClaimed[model] = {};
          }
          if(!neverClaimed[model]['Engine']){
            neverClaimed[model]['Engine'] = 0;
          }
          if(!neverClaimed[model]['Arm']){
            neverClaimed[model]['Arm'] = 0;
          }
          neverClaimed[model]['Engine'] += data.modelParts[model]['Engine'];
          neverClaimed[model]['Arm'] += data.modelParts[model]['Arm'];
          engineCount += data.modelParts[model]['Engine'];
          armCount += data.modelParts[model]['Arm'];
        });
      }
    }
  })

  console.log('engineCount', engineCount, 'armCount', armCount);
  console.log('accountsCount', accountsCount,'neverClaimed', neverClaimed);

}
async function refreshAccountData() {
  reset();
  displayTables();
  if(loadCached){
    orderedCachedWalletData.forEach((data, index)=>{
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
  let totalMixedMechsNoAfterglow = {};
  let totalParts = {};
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

    if(data.address == '0xa6B750fbb80FFDB9e77458466562a4c5627877ba'){
      RARITY_ORDER.forEach((model)=>{
        buildUnclaimedPartCountsTotalTable(data.modelParts, model);
      });
      buildTotalUnclaimedPartCountsTotalTable(data.modelParts);
    }
  });

  console.log('totalFullMechs', totalFullMechs);
  console.log('totalMixedMechs', totalMixedMechs);
  console.log('totalMixedMechsNoAfterglow', totalMixedMechsNoAfterglow);
  console.log('totalParts', totalParts);

  RARITY_ORDER.forEach((model)=>{
    buildMechCountsTable(totalFullMechs, totalMixedMechs, totalMixedMechsNoAfterglow, model);
    buildTotalPartCountsTable(totalParts, model);
  });
  buildTotalPartCountsTotalTable(totalParts);

  buildMechCountsTable(totalFullMechs, totalMixedMechs, totalMixedMechsNoAfterglow, 'Total');
}

function countMechModelsLive(){
  let totalFullMechs = {};
  let totalMixedMechs = {};
  let totalMixedMechsNoAfterglow = {};
  let totalParts = {};
  Object.keys(allWalletData).forEach((address)=>{
    let fullMechs = allWalletData[address].fullMechs;
    let mixedMechs = allWalletData[address].mixedMechs;
    let mixedMechsNoAfterglow = allWalletData[address].mixedMechsNoAfterglow;
    let modelParts = allWalletData[address].modelParts;

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
  console.log('mixedMechsNoAfterglow', mixedMechsNoAfterglow);
  console.log('totalParts', totalParts);

  RARITY_ORDER.forEach((model)=>{
    buildMechCountsTable(totalFullMechs, totalMixedMechs, mixedMechsNoAfterglow, model);
    buildTotalPartCountsTable(totalParts, model);
  });
  buildTotalPartCountsTotalTable(totalParts);

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
      let modelParts = JSON.parse(JSON.stringify(dataModel.owners[address].modelParts));
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
          mixedMechsNoAfterglow,
          modelParts
        };
        window.localStorage.setItem(address, JSON.stringify(allData[address]));
      }
    }

    highlightZeros();
    highlightTotal();
    displayTables();
    progressDiv.innerHTML = ' - Loaded ' + row + '/4423';
}

function buildPartCountsTable(row, address, totalParts, totalAfterglows, partsCount, fullMechsCount, mixedMechsCount, mixedMechsNoAfterglowCount, mixedMechsPartialCount, mixedMechsPartialNoModelCount, remainingParts){
  const clone = templateCounts.content.cloneNode(true);
  clone.querySelector(".row").textContent = row;
  clone.querySelector(".wallet").innerHTML = '<a href="index.html?wallet=' + address + '">' + address + '</a>';
  clone.querySelector(".builder").innerHTML = '<a href="builder.html?wallet=' + address + '">Builder</a>';
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

function buildMechCountsTable(fullMechs, mixedMechs, mixedMechsNoAfterglow, model){
  const clone = templateMechCounts.content.cloneNode(true);
  clone.querySelector(".model").textContent = model;
  if(model != 'Total'){
    clone.querySelector(".full").textContent = fullMechs[model];
    clone.querySelector(".mixed").textContent = mixedMechs[model];
    clone.querySelector(".mixed_no_afterglow").textContent = mixedMechsNoAfterglow[model];
    clone.querySelector(".total").textContent = fullMechs[model]+mixedMechs[model]+ mixedMechsNoAfterglow[model];
  } else {
    let totalFull = 0;
    let totalMixed = 0;
    let totalMixedNoAfterglow = 0;
    RARITY_ORDER.forEach((model)=>{
      totalFull += fullMechs[model];
      totalMixed += mixedMechs[model];
      totalMixedNoAfterglow += mixedMechsNoAfterglow[model];
    });
    clone.querySelector(".full").textContent = totalFull;
    clone.querySelector(".mixed").textContent = totalMixed;
    clone.querySelector(".mixed_no_afterglow").textContent = totalMixedNoAfterglow;
    clone.querySelector(".total").textContent = totalFull+totalMixed+totalMixedNoAfterglow;
  }
  mechCountsContainer.appendChild(clone);
}

function buildTotalPartCountsTable(modelParts, model){
  const clone = templatePartCounts.content.cloneNode(true);
  clone.querySelector(".model").textContent = model;
  let total = 0;
  PARTS_ORDER.forEach((part)=>{
      clone.querySelector("."+part).textContent = modelParts[model][part];
      total += modelParts[model][part];
  });
  clone.querySelector(".total").textContent = total;
  partCountsContainer.appendChild(clone);
}

function buildTotalPartCountsTotalTable(modelParts){
  const clone = templatePartCounts.content.cloneNode(true);
  clone.querySelector(".model").textContent = 'Total';
  let totals = {};
  RARITY_ORDER.forEach((model)=>{
    PARTS_ORDER.forEach((part)=>{
        if(!totals[part]){
          totals[part] = 0;
        }
        totals[part] += modelParts[model][part];
    });
  });

  let total = 0;
  PARTS_ORDER.forEach((part)=>{
    clone.querySelector("."+part).textContent = totals[part];
    total += totals[part];
  });
  clone.querySelector(".total").textContent = total;
  partCountsContainer.appendChild(clone);
}

function buildUnclaimedPartCountsTotalTable(modelParts, model){
  const clone = templateUnclaimedPartCounts.content.cloneNode(true);
  clone.querySelector(".model").textContent = model;
  let total = 0;
  PARTS_ORDER.forEach((part)=>{
      clone.querySelector("."+part).textContent = modelParts[model][part];
      total += modelParts[model][part];
  });
  clone.querySelector(".total").textContent = total;
  unclaimedPartCountsContainer.appendChild(clone);
}

function buildTotalUnclaimedPartCountsTotalTable(modelParts){
  const clone = templateUnclaimedPartCounts.content.cloneNode(true);
  clone.querySelector(".model").textContent = 'Total';
  let totals = {};
  RARITY_ORDER.forEach((model)=>{
    PARTS_ORDER.forEach((part)=>{
        if(!totals[part]){
          totals[part] = 0;
        }
        totals[part] += modelParts[model][part];
    });
  });

  let total = 0;
  PARTS_ORDER.forEach((part)=>{
    clone.querySelector("."+part).textContent = totals[part];
    total += totals[part];
  });
  clone.querySelector(".total").textContent = total;
  unclaimedPartCountsContainer.appendChild(clone);
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
  for (var i = 4; i < cells1a.length; i+=5) {
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