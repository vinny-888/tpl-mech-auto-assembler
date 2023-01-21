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
  dataModel.useStyles = true;
  init();
  progressDiv = document.getElementById('progress');
  // refreshAccountData();
  if(loadCached){
    loadTop100();
  }
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
  let count1 = 0;
  let count2 = 0;
  // "partsCount":{"Engine":0,"Head":2897,"Body":3357,"Leg":3611,"Arm":3357}
  revealedStatsData.forEach((wallet)=>{
    if(wallet.partsCount['Engine'] > 0 &&
      wallet.partsCount['Head'] > 0 &&
      wallet.partsCount['Body'] > 0 &&
      wallet.partsCount['Leg'] > 0 &&
      wallet.partsCount['Arm'] > 0 &&
      wallet.totalAfterglows == 0){
        count1+=wallet.partsCount['Engine'];
    }
    if((wallet.partsCount['Engine'] > 0 ||
    wallet.partsCount['Head'] > 0 ||
    wallet.partsCount['Body'] > 0 ||
    wallet.partsCount['Leg'] > 0 ||
    wallet.partsCount['Arm'] > 0) &&
    wallet.totalAfterglows == 0){
      count2+=wallet.partsCount['Engine'];
    }
  })
  console.log('count1', count1);
  console.log('count2', count2);

  displayTables();
  for(let i =0; i<100; i++){
    let data = revealedStatsData[i];
    setTimeout(()=>{
      updateTable((i+1), data.address, data);
    },0);
  }

  let engineCount = 0;
  let armCount = 0;
  let neverClaimed = {};
  let accountsCount =0;
  revealedStatsData.forEach((data)=>{
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
    revealedStatsData.forEach((data, index)=>{
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
    
    let count = stats_wallets.length;
    let counter = 0;
    let totalSupply = await getRevealedMechTotalSupply();
    for(let i=0; i<count; i++){
      let address = stats_wallets[i];
      let cachedData = localStorage.getItem(address);
      if(!cachedData){
        console.log('Fetching: ', i);
        await fetchAccountData(address, totalSupply);
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
  let totalMixedMechs = 0;
  let totalMixedMechsNoAfterglow = 0;
  let totalParts = {};
  revealedStatsData.forEach((data)=>{
    let fullMechs = data.fullMechs;
    let mixedMechs = data.mixedMechsPartialCount;
    let mixedMechsNoAfterglow = data.mixedMechsPartialNoModelCount;
    let modelParts = data.modelParts;

    Object.keys(fullMechs).forEach((model)=>{
      if(!totalFullMechs[model]){
        totalFullMechs[model] = 0;
      }
      STYLE_ORDER[model].forEach((style)=>{
        totalFullMechs[model] += (fullMechs[model] && fullMechs[model][style] ? fullMechs[model][style].length : 0);
      });
    });

    totalMixedMechs += mixedMechs;

    totalMixedMechsNoAfterglow += mixedMechsNoAfterglow;

    // Object.keys(mixedMechs).forEach((model)=>{
    //   if(!totalMixedMechs[model]){
    //     totalMixedMechs[model] = 0;
    //   }
    //   STYLE_ORDER[model].forEach((style)=>{
    //     totalMixedMechs[model] += (mixedMechs[model] && mixedMechs[model][style] ? mixedMechs[model][style].length : 0);
    //   });
    // });

    // Object.keys(mixedMechsNoAfterglow).forEach((model)=>{
    //   if(!totalMixedMechsNoAfterglow[model]){
    //     totalMixedMechsNoAfterglow[model] = 0;
    //   }
    //   STYLE_ORDER[model].forEach((style)=>{
    //     totalMixedMechsNoAfterglow[model] += (mixedMechsNoAfterglow[model] && mixedMechsNoAfterglow[model][style] ? mixedMechsNoAfterglow[model][style].length : 0);
    //   });
    // });

    Object.keys(modelParts).forEach((model)=>{
      if(!totalParts[model]){
        totalParts[model] = {};
      }
      PARTS_ORDER.forEach((part)=>{
        STYLE_ORDER[model].forEach((style)=>{
          if(!totalParts[model][part]){
            totalParts[model][part] = 0;
          }
          totalParts[model][part] += (modelParts[model][part] && modelParts[model][part][style] ? modelParts[model][part][style] : 0);
        })
      })
    });

    // if(data.address == '0xa6B750fbb80FFDB9e77458466562a4c5627877ba'){
    //   RARITY_ORDER.forEach((model)=>{
    //     buildUnclaimedPartCountsTotalTable(data.modelParts, model);
    //   });
    //   buildTotalUnclaimedPartCountsTotalTable(data.modelParts);
    // }
  });

  RARITY_ORDER.forEach((model)=>{
    buildUnclaimedPartCountsTotalTable(totalParts, model);
  });
  buildTotalUnclaimedPartCountsTotalTable(totalParts);

  console.log('totalFullMechs', totalFullMechs);
  console.log('totalMixedMechs', totalMixedMechs);
  // console.log('totalMixedMechsNoAfterglow', totalMixedMechsNoAfterglow);
  console.log('totalParts', totalParts);

  RARITY_ORDER.forEach((model)=>{
    buildMechCountsTable(totalFullMechs, totalMixedMechs, totalMixedMechsNoAfterglow, model);
    buildTotalPartCountsTable(model);
  });
  buildTotalPartCountsTotalTable();

  buildMechCountsTable(totalFullMechs, totalMixedMechs, totalMixedMechsNoAfterglow, 'Total');
}

function countMechModelsLive(){
  let totalFullMechs = {};
  let totalMixedMechs = {};
  let totalMixedMechsNoAfterglow = {};
  let totalParts = {};
  Object.keys(allWalletData).forEach((address)=>{
    let fullMechs = allWalletData[address].fullMechs;
    let mixedMechs = allWalletData[address].mixedMechsPartialCount;
    let mixedMechsNoAfterglow = allWalletData[address].mixedMechsPartialNoModelCount;
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
        STYLE_ORDER[model].forEach((style)=>{
          if(!totalParts[model][part]){
            totalParts[model][part] = 0;
          }
          totalParts[model][part] += (modelParts[model][part] && modelParts[model][part][style] ? modelParts[model][part][style] : 0);
        })
      })
    });
    
  });

  console.log('totalFullMechs', totalFullMechs);
  console.log('totalMixedMechs', totalMixedMechs);
  console.log('mixedMechsNoAfterglow', mixedMechsNoAfterglow);
  console.log('totalParts', totalParts);

  RARITY_ORDER.forEach((model)=>{
    buildMechCountsTable(totalFullMechs, totalMixedMechs, mixedMechsNoAfterglow, model);
    buildTotalPartCountsTable(model);
  });
  buildTotalPartCountsTotalTable();

}

function updateTable(row, address, cachedData){
    if(cachedData){
        wallets[address] = cachedData.totalParts;
        totalFullMechs += cachedData.fullMechsCount;
        // totalMixedMechs += cachedData.mixedMechsCount;
        // totalMixedMechsNoAfterglow += cachedData.mixedMechsNoAfterglowCount;
        totalMixedMechsPartial += cachedData.mixedMechsPartialCount;
        totalMixedMechsPartialNoModel += cachedData.mixedMechsPartialNoModelCount;
        
        buildPartCountsTable(row, 
          address, 
          cachedData.totalParts, 
          // cachedData.totalAfterglows, 
          cachedData.partsCount, 
          cachedData.fullMechsCount, 
          cachedData.fullEnforcerMechsCount, 
          cachedData.fullRavagerMechsCount,
          cachedData.fullBehemothMechsCount,
          cachedData.fullLupisMechsCount,
          cachedData.fullNexusMechsCount,
          // cachedData.mixedMechsCount, 
          // cachedData.mixedMechsNoAfterglowCount, 
          cachedData.mixedMechsPartialCount, 
          cachedData.mixedMechsPartialNoModelCount, 
          cachedData.remainingParts);
    } else if(dataModel.owners[address].modelParts) {
      let modelParts = JSON.parse(JSON.stringify(dataModel.owners[address].modelParts));

      let totalParts = getRemainingPartsStyles(address);

      let partsCount = getPartCounts(address);
      
      let fullMechs = buildFullModelMechStyles(address);
      let mixedMechsPartial = buildMixedMechsStyles(address, false, true, false);
      // Build *partial* mechs and show missing parts
      let mixedMechsPartialNoModel = buildNoModelMixedMechsStyles(address, false, true, true);

      // // Build remaining parts table
      let remainingParts = getRemainingPartsStyles(address);


      // Builds the wallet inventory parts tables
      wallets[address] = totalParts;
      let fullMechsCount = countMechsStyles(fullMechs);
      let fullEnforcerMechsCount = countMechsStyles(fullMechs, 'Enforcer');
      let fullRavagerMechsCount = countMechsStyles(fullMechs, 'Ravager');
      let fullBehemothMechsCount = countMechsStyles(fullMechs, 'Behemoth');
      let fullLupisMechsCount = countMechsStyles(fullMechs, 'Lupis');
      let fullNexusMechsCount = countMechsStyles(fullMechs, 'Nexus');
      // let mixedMechsCount = countMechs(mixedMechs);
      // let mixedMechsNoAfterglowCount = countMechs(mixedMechsNoAfterglow);
      let mixedMechsPartialCount = countMechs(mixedMechsPartial);
      let mixedMechsPartialNoModelCount = countMechs(mixedMechsPartialNoModel);
      totalFullMechs += fullMechsCount;
      // totalMixedMechs += mixedMechsCount;
      // totalMixedMechsNoAfterglow += mixedMechsNoAfterglowCount;
      // totalMixedMechsPartial += mixedMechsPartialCount;
      // totalMixedMechsPartialNoModel += mixedMechsPartialNoModelCount;
      buildPartCountsTable(row, 
        address, 
        totalParts, 
        // totalAfterglows, 
        partsCount, 
        fullMechsCount, 
        fullEnforcerMechsCount, 
        fullRavagerMechsCount,
        fullBehemothMechsCount,
        fullLupisMechsCount,
        fullNexusMechsCount,
        // mixedMechsCount, 
        // mixedMechsNoAfterglowCount, 
        mixedMechsPartialCount, 
        mixedMechsPartialNoModelCount, 
        remainingParts);

      if(localStorage.getItem(address) == null){
        allData[address] = {
          totalParts,
          partsCount,
          // totalAfterglows,
          fullMechsCount,
          fullEnforcerMechsCount,
          fullRavagerMechsCount,
          fullBehemothMechsCount,
          fullLupisMechsCount,
          fullNexusMechsCount,
          // mixedMechsCount,
          // mixedMechsNoAfterglowCount,
          mixedMechsPartialCount,
          mixedMechsPartialNoModelCount,
          remainingParts,
          fullMechs,
          // mixedMechs,
          // mixedMechsNoAfterglow,
          modelParts
        };
        window.localStorage.setItem(address, JSON.stringify(allData[address]));
      }
    }

    highlightZeros();
    highlightTotal();
    displayTables();
    progressDiv.innerHTML = ' - Loaded ' + row + '/962';
}

function buildPartCountsTable(row, 
  address, 
  totalParts, 
  // totalAfterglows, 
  partsCount, 
  fullMechsCount, 
  fullEnforcerMechsCount, 
  fullRavagerMechsCount,
  fullBehemothMechsCount,
  fullLupisMechsCount,
  fullNexusMechsCount,
  // mixedMechsCount, 
  // mixedMechsNoAfterglowCount, 
  mixedMechsPartialCount, 
  mixedMechsPartialNoModelCount, 
  remainingParts){
  const clone = templateCounts.content.cloneNode(true);
  clone.querySelector(".row").textContent = row;
  clone.querySelector(".wallet").innerHTML = '<a href="index.html?wallet=' + address + '">' + address + '</a>';
  // clone.querySelector(".builder").innerHTML = '<a href="builder.html?wallet=' + address + '">Builder</a>';
  clone.querySelector(".count").textContent = totalParts;
  
  Object.keys(partsCount).forEach((part)=>{
    clone.querySelector("."+part).textContent = partsCount[part];
  });

  // clone.querySelector(".afterglows").textContent = totalAfterglows;
  clone.querySelector(".full").textContent = fullMechsCount;

  clone.querySelector(".fullE").textContent = fullEnforcerMechsCount;
  clone.querySelector(".fullR").textContent = fullRavagerMechsCount;
  clone.querySelector(".fullB").textContent = fullBehemothMechsCount;
  clone.querySelector(".fullL").textContent = fullLupisMechsCount;
  clone.querySelector(".fullN").textContent = fullNexusMechsCount;

  // clone.querySelector(".mixed").textContent = mixedMechsCount;
  // clone.querySelector(".mixed_no_afterglow").textContent = mixedMechsNoAfterglowCount;
  clone.querySelector(".mixed").textContent = mixedMechsPartialCount;
  clone.querySelector(".completed").textContent = mixedMechsPartialCount + fullMechsCount;
  clone.querySelector(".partial").textContent = mixedMechsPartialNoModelCount;
  clone.querySelector(".unused").textContent = remainingParts;
  countsContainer.appendChild(clone);
}

function buildMechCountsTable(fullMechs, mixedMechs, mixedMechsNoAfterglow, model){
  const clone = templateMechCounts.content.cloneNode(true);
  clone.querySelector(".model").textContent = model;
  if(model != 'Total'){
    clone.querySelector(".full").textContent = fullMechs[model];
    clone.querySelector(".mixed").textContent = '';
    clone.querySelector(".mixed_no_afterglow").textContent = '';
    clone.querySelector(".total").textContent = fullMechs[model];
  } else {
    let totalFull = 0;
    RARITY_ORDER.forEach((model)=>{
      totalFull += fullMechs[model];
    });
    clone.querySelector(".full").textContent = totalFull;
    clone.querySelector(".mixed").textContent = mixedMechs;
    clone.querySelector(".mixed_no_afterglow").textContent = mixedMechsNoAfterglow;
    clone.querySelector(".total").textContent = totalFull+mixedMechs+mixedMechsNoAfterglow;
  }
  mechCountsContainer.appendChild(clone);
}

function buildTotalPartCountsTable(model){
  const clone = templatePartCounts.content.cloneNode(true);
  clone.querySelector(".model").textContent = model;
  let total = 0;
  PARTS_ORDER.forEach((part)=>{
      clone.querySelector("."+part).textContent = total_parts[model][part];
      total += total_parts[model][part];
  });
  clone.querySelector(".total").textContent = total;
  partCountsContainer.appendChild(clone);
}

function buildTotalPartCountsTotalTable(){
  const clone = templatePartCounts.content.cloneNode(true);
  clone.querySelector(".model").textContent = 'Total';
  let totals = {};
  RARITY_ORDER.forEach((model)=>{
    PARTS_ORDER.forEach((part)=>{
        if(!totals[part]){
          totals[part] = 0;
        }
        totals[part] += total_parts[model][part];
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
      let count = 0;
      // STYLE_ORDER[model].forEach((style)=>{
        count+=modelParts[model][part];
      // })
      clone.querySelector("."+part).textContent = count;
      total += count;
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
      // STYLE_ORDER[model].forEach((style)=>{
        if(!totals[part]){
          totals[part] = 0;
        }
        totals[part] += modelParts[model][part];
      // });
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

function countMechsStyles(mechs, type){
  let count = 0;
  Object.keys(mechs).forEach((model)=>{
    Object.keys(mechs[model]).forEach((style)=>{
      if(!type || model == type){
        count += mechs[model][style].length;
      }
    });
  });
  return count;
}

function countMechs(mechs, type){
  let count = 0;
  Object.keys(mechs).forEach((model)=>{
    if(!type || model == type){
      count += mechs[model].length;
    }
  });
  return count;
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

async function fetchAccountData(address, totalSupply) {
  if(!dataModel.owners[address]){
    dataModel.owners[address] = {};
  }
  let revealedTokenIds = await populateWalletMechPartsStyles(address, totalSupply);

  // Populate the modelParts lookup
  revealedTokenIds.forEach((tokenId)=>{
    // let metadata = await getRevealedMechTokenMetadata(tokenId);
    // let model = BODY_PART_MODEL_MAPPING[metadata.model];
    // let part = BODY_PART_MAPPING[metadata.partType];
    let tokenMetadata = revealedMetadata[''+tokenId];
    if(tokenMetadata){
      if(!dataModel.owners[address].modelParts){
        dataModel.owners[address].modelParts = {};
      }
      let model = tokenMetadata.attributes.find((att)=> att.trait_type == 'Model').value;
      let part = tokenMetadata.attributes.find((att)=> att.trait_type == 'Part').value;
      if(part == 'Legs'){
        part = 'Leg';
      }
      let style = tokenMetadata.attributes.find((att)=> att.trait_type == 'Style').value;
      if(!dataModel.owners[address].modelParts[model]){
        dataModel.owners[address].modelParts[model] = {};
      }
      if(!dataModel.owners[address].modelParts[model][part]){
        dataModel.owners[address].modelParts[model][part] = {};
      }
      if(!dataModel.owners[address].modelParts[model][part][style]){
        dataModel.owners[address].modelParts[model][part][style] = 0;
      }
      dataModel.owners[address].modelParts[model][part][style]++;
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
      if(!dataModel.owners[address].walletParts){
        dataModel.owners[address].walletParts = {};
      }
      dataModel.owners[address].walletParts[tokenId] = {
        tokenId,
        model,
        part,
        style,
        count: dataModel.owners[address].modelParts[model][part][style]
      };
    }
  });

  // // Build the model part count map
  // dataModel.owners[address].walletParts.forEach((part)=>{
  //   if(!dataModel.owners[address].modelParts){
  //     dataModel.owners[address].modelParts = {
  //       Enforcer: {},
  //       Ravager: {},
  //       Lupis: {},
  //       Behemoth: {},
  //       Nexus: {}
  //     };
  //   }
  //   dataModel.owners[address].modelParts[part.model][part.part][part.style] = part.count;
  // });
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

function getRemainingPartsStyles(address){
  let remainingCount = 0;
  RARITY_ORDER.forEach((model)=>{
      if(dataModel.owners[address].modelParts[model]){
          Object.keys(dataModel.owners[address].modelParts[model]).forEach((part)=>{
          STYLE_ORDER[model].forEach((style)=>{
            if(dataModel.owners[address].modelParts[model][part][style] > 0){
                remainingCount += dataModel.owners[address].modelParts[model][part][style];
            }
          });
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