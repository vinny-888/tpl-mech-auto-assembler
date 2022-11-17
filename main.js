"use strict";

 const provider = web3.currentProvider;
 const mechTokenContract = "0xf4bacb2375654ef2459f427c8c6cf34573f75154";
 const afterglowTokenContract = "0xa47fb7c4edd3475ce66f49a66b9bf1edbc61e52d";
 const rarityOrder = ['Nexus', 'Behemoth', 'Lupis', 'Ravenger', 'Enforcer'];
 const partOrder = ['Engine', 'Head', 'Body', 'Legs', 'Arm'];

 let remainingParts = {};
 const balanceOfABI = [
    {
      "constant": true,
      "inputs": [
        {
          "internalType":"address",
          "name":"_owner",
          "type":"address"
        },
        {
          "internalType":"uint256",
          "name":"_id",
          "type":"uint256"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType":"uint256",
          "name":"",
          "type":"uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "accounts",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "ids",
          "type": "uint256[]"
        }
      ],
      "name": "balanceOfBatch",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

 const parts = [
  {
    model: 'Enforcer',
    part: 'Arm'
  },
  {
    model: 'Lupis',
    part: 'Arm'
  },
  {
    model: 'Enforcer',
    part: 'Engine'
  },
  {
    model: 'Ravenger',
    part: 'Engine'
  },
  {
    model: 'Behemoth',
    part: 'Engine'
  },
  {
    model: 'Lupis',
    part: 'Engine'
  },
  {
    model: 'Nexus',
    part: 'Engine'
  },
  {
    model: 'Enforcer',
    part: 'Head'
  },
  {
    model: 'Ravenger',
    part: 'Head'
  },
  {
    model: 'Behemoth',
    part: 'Head'
  },
  {
    model: 'Lupis',
    part: 'Head'
  },
  {
    model: 'Nexus',
    part: 'Head'
  },
  {
    model: 'Enforcer',
    part: 'Body'
  },
  {
    model: 'Ravenger',
    part: 'Body'
  },
  {
    model: 'Behemoth',
    part: 'Body'
  },
  {
    model: 'Lupis',
    part: 'Body'
  },
  {
    model: 'Nexus',
    part: 'Body'
  },
  {
    model: 'Ravenger',
    part: 'Arm'
  },
  {
    model: 'Behemoth',
    part: 'Arm'
  },
  {
    model: 'Lupis (Pirate)',
    part: 'Arm'
  },
  {
    model: 'Nexus',
    part: 'Arm'
  },
  {
    model: 'Enforcer',
    part: 'Legs'
  },
  {
    model: 'Ravenger',
    part: 'Legs'
  },
  {
    model: 'Behemoth',
    part: 'Legs'
  },
  {
    model: 'Lupis',
    part: 'Legs'
  },
  {
    model: 'Nexus',
    part: 'Legs'
  }
 ];

 let afterglows = [
  {name: 'ShaDAO Black'},
  {name: 'Starter Green'},
  {name: 'Common Lavender'},
  {name: 'Tabula Rasa White'},
  {name: 'Abundant Blue'},
  {name: 'Seeker Green'},
  {name: 'Takedown Green'},
  {name: 'Backdoor Burgundy'},
  {name: 'Fixer Plum'},
  {name: 'Stonefaced Sapphire'},
  {name: 'Escapist Magenta'},
  {name: 'Lost-in-the-crowd Orange'},
  {name: 'Existential Pink'},
  {name: 'Phising Gold'},
  {name: 'Reaction Time Red'},
  {name: 'Enigma Yellow'},
  {name: 'Precious Cargo Green'},
  {name: 'Broken Sky Blue'},
  {name: 'Stationary Green'},
  {name: 'Cosmic Squid Pink'},
  {name: 'Hallowed Grounds'},
  {name: 'Closed Captioning'},
  {name: 'Eldrtich Descent'},
  {name: 'Instatutional Pedigree'},
  {name: 'Tsujigiri Slash'},
  {name: 'Double Spend'},
  {name: 'Ethereal Dream'},
  {name: 'Circuit Overload'},
  {name: 'Bone and Flesh'},
  {name: 'Pink Parser'},
  {name: 'Xenoform Unknown'},
  {name: 'Blood Money'},
  {name: 'Quid Pro Quo'},
  {name: 'Singularity Prophet'},
  {name: 'Wildstyle Monarch'},
  {name: 'Deva\'s Breath'},
  {name: 'True Belief'},
  {name: 'The One'}
];
afterglows = afterglows.reverse();
let mechContract = null;
let afterglowContract = null;
// let provider;
let selectedAccount;


function partsImage(part, model) {
  return '<img height="60px" src="./images/parts/' + model + '_' + part + '.png" title="'+[part, model].join(' ')+'" />';
}


function afterglowImage(afterglow) {
  return '<img height="60px" src="./images/afterglows/' +afterglow+ '.avif" title="'+afterglow+'" />';
}

function init() {
  console.log("window.web3 is", window.web3, "window.ethereum is", window.ethereum);

  if(location.protocol !== 'https:') {
    const alert = document.querySelector("#alert-error-https");
    alert.style.display = "block";
    return;
  }

  // tooltip
  Array.from(document.querySelectorAll('[tip]')).forEach(el => {
    let tip = document.createElement('div');
    tip.classList.add('tooltip');
    tip.innerText = el.getAttribute('tip');
    let delay = el.getAttribute('tip-delay');
    if (delay) {
      tip.style.transitionDelay = delay + 's';
    }
    tip.style.transform =
      'translate(' +
        (el.hasAttribute('tip-left') ? 'calc(-100% - 5px)' : '15px') + ', ' +
        (el.hasAttribute('tip-top') ? '-100%' : '0') +
      ')';
    el.appendChild(tip);
    el.onmousemove = e => {
      tip.style.left = (e.clientX-140) + 'px'
      tip.style.top = (e.clientY+20) + 'px';
    };
  });
}

/**
 * Kick in the UI action after Web3modal dialog has chosen a provider
 */
async function fetchAccountData() {

  // Get a Web3 instance for the wallet
  const web3 = new Web3(provider);

  mechContract = new web3.eth.Contract(balanceOfABI, mechTokenContract);
  afterglowContract = new web3.eth.Contract(balanceOfABI, afterglowTokenContract);

  console.log("Web3 instance is", web3);

  // Get list of accounts of the connected wallet
  const accounts = await web3.eth.getAccounts();

  // MetaMask does not give you all accounts, only the selected account
  console.log("Got accounts", accounts);
  selectedAccount = accounts[0];

  // Get a handl
  const template = document.querySelector("#template-balance");
  const accountContainer = document.querySelector("#accounts");

  const templateFull = document.querySelector("#template-full");
  const fullContainer = document.querySelector("#full");

  const templateMixed = document.querySelector("#template-mixed");
  const mixedContainer = document.querySelector("#mixed");

  const templateAfterglow = document.querySelector("#template-afterglow");
  const afterglowContainer = document.querySelector("#afterglow");

  const templateMixedMech = document.querySelector("#template-mech");
  const mixedmechContainer = document.querySelector("#mechs");

  const templateRemainingMech = document.querySelector("#template-remaining");
  const remainingContainer = document.querySelector("#remaining");

  const mixedmechNoAfterglowContainer = document.querySelector("#mechsNoAfterglow");
  const mixedmechPartialContainer = document.querySelector("#mechsPartial");

  const templateCounts = document.querySelector("#template-counts");
  const countsContainer = document.querySelector("#counts");
  const templateEmpty = document.querySelector("#template-empty");



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

  let address = document.querySelector("#address").value;
  if(address == ''){
    alert('You must enter a wallet address first!');
    return;
  }
  let walletParts = [];
  let walletAfterglows = [];
  let totalParts = 0;
  let totalAfterglows = 0;
  let totalFullParts = 0;
  let totalMixed = 0;
  // Get the 26 TPL Mech Part Balances
  let addresses = [];
  let cards = [];
  for(let i=1; i<=26; i++){
    addresses.push(address);
    cards.push(i);
  }
  let res = await getMechTokenBalanceBatch(addresses, cards);
  console.log(res);
  for(let i=0; i<26; i++){
    walletParts.push(parts[i]);
    walletParts[i].count = parseInt(res[i]);
    totalParts += walletParts[i].count;
  }
  document.querySelector("#part_count").innerHTML = '('+totalParts+')';

  addresses = [];
  cards = [];
  for(let i=1; i<=38; i++){
    addresses.push(address);
    cards.push(i);
  }
  res = await getAfterglowTokenBalanceBatch(addresses, cards);

  for(let i=0; i<38; i++){
    walletAfterglows.push(afterglows[i]);
    walletAfterglows[i].count = parseInt(res[i]);
    totalAfterglows += walletAfterglows[i].count;
  }
  document.querySelector("#afterglow_count").innerHTML = '('+totalAfterglows+')';

  /* Combine lupis arms with pirate lupis arms */
  walletParts[1].count += walletParts[19].count;
  walletParts.splice(19, 1);

  const weights = {
    Enforcer: 5,
    Ravenger: 4,
    Lupis: 3,
    Behemoth: 2,
    Nexus: 1,
  }

  /* Sort by Model and Part in Rarity Order not Alphabetical */
  walletParts.sort((a, b) => {
    if(a.model == b.model){
      return a.part.localeCompare(b.part);
    }
    return weights[a.model] - weights[b.model];
  })

  let fullModelMechs = {
    Enforcer: {},
    Ravenger: {},
    Lupis: {},
    Behemoth: {},
    Nexus: {}
  };

  let partCount = 0;
  // All Parts
  walletParts.forEach((part)=>{
    fullModelMechs[part.model][part.part] = part.count;
    if(part.count > 0){
      // Build Table
      const clone = template.content.cloneNode(true);
      clone.querySelector(".image").innerHTML = partsImage(part.part, part.model);
      clone.querySelector(".part").textContent = part.part;
      clone.querySelector(".model").textContent = part.model;
      clone.querySelector(".count").textContent = part.count;
      accountContainer.appendChild(clone);
      partCount++;
    }
  });

  if(partCount == 0){
    const clone = templateEmpty.content.cloneNode(true);
    accountContainer.appendChild(clone);
  }

  rarityOrder.forEach((model)=>{
    const clone = templateCounts.content.cloneNode(true);
    clone.querySelector(".model").textContent = model;
    partOrder.forEach((part)=>{
      clone.querySelector("."+part).textContent = fullModelMechs[model][part];
    });
    countsContainer.appendChild(clone);
  })

  let afterglowCount = 0;
  // All Afterglows
  walletAfterglows.forEach((afterglow)=>{
    if(afterglow.count > 0){
      // Build Table
      const clone = templateAfterglow.content.cloneNode(true);
      clone.querySelector(".image").innerHTML = afterglowImage(afterglow.name);
      clone.querySelector(".name").textContent = afterglow.name;
      clone.querySelector(".count").textContent = afterglow.count;
      afterglowContainer.appendChild(clone);
      afterglowCount++;
    }
  });

  if(afterglowCount == 0){
    const clone = templateEmpty.content.cloneNode(true);
    afterglowContainer.appendChild(clone);
  }

  // Full Mechs
  let fullModelMechCounts = {
    Nexus: 0,
    Behemoth: 0,
    Lupis: 0,
    Ravenger: 0,
    Enforcer: 0
  };

  let remainingAfterglows = totalAfterglows;
  rarityOrder.forEach((model)=>{
    let mechParts = Object.keys(fullModelMechs[model]);
    let min = 99999;
    mechParts.forEach((part)=>{
      let count = parseInt(fullModelMechs[model][part]);
      if(part == 'Arm'){
        count = Math.floor(count/2);
      }
      if(count < min){
        min = count;
      }
    });
    if(remainingAfterglows > min){
      fullModelMechCounts[model] = min;
      remainingAfterglows -= min;
    } else {
      fullModelMechCounts[model] = remainingAfterglows;
      remainingAfterglows = 0;
    }
    // Build Table
    if(min > 0){
      const clone = templateFull.content.cloneNode(true);
      clone.querySelector(".image").innerHTML = partsImage("Engine", model);
      clone.querySelector(".model").textContent = model;
      clone.querySelector(".count").textContent = min;
      fullContainer.appendChild(clone);
    }
    totalFullParts += min;
  })

  if(totalFullParts == 0){
    const clone = templateEmpty.content.cloneNode(true);
    fullContainer.appendChild(clone);
  }
  document.querySelector("#full_count").innerHTML = '('+totalFullParts+')';

  // Mixed Mechs
  let mixedModelMechCounts = {
    Enforcer: 0,
    Ravenger: 0,
    Lupis: 0,
    Behemoth: 0,
    Nexus: 0
  };
  let partialMechCounts = {
    Enforcer: 0,
    Ravenger: 0,
    Lupis: 0,
    Behemoth: 0,
    Nexus: 0
  };
  let mixedModelMechCountParts = {
    Enforcer: [],
    Ravenger: [],
    Lupis: [],
    Behemoth: [],
    Nexus: []
  };
  let mixedModelMechCountPartsNoAfterglow = {
    Enforcer: [],
    Ravenger: [],
    Lupis: [],
    Behemoth: [],
    Nexus: []
  };

  let partialMechCountParts = {
    Enforcer: [],
    Ravenger: [],
    Lupis: [],
    Behemoth: [],
    Nexus: []
  };

  rarityOrder.forEach((model)=>{
    let fullMechParts = fullModelMechs[model];
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
        partCounts[part] = count - fullModelMechCounts[model];
      } else {
        partCounts[part] = count - fullModelMechCounts[model]*2;
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
          if(!mixedModelMechCountParts[model]){
            mixedModelMechCountParts[model] = [];
          }
          if(!mixedModelMechCountPartsNoAfterglow[model]){
            mixedModelMechCountPartsNoAfterglow[model] = [];
          }
          partCounts[partOne]--;
          partCounts[partTwo]--;
          if(remainingAfterglows == 0){
            mixedModelMechCountPartsNoAfterglow[model].push([
              {
                model: model,
                part: partOne
              },
              {
                model: model,
                part: partTwo
              },
            ]);
          } else {
            mixedModelMechCounts[model]++;
            mixedModelMechCountParts[model].push([
              {
                model: model,
                part: partOne
              },
              {
                model: model,
                part: partTwo
              },
            ]);
            remainingAfterglows--;
          }
        }

    }
    // Build Table
    if(mixedModelMechCounts[model] > 0){
      const clone = templateMixed.content.cloneNode(true);
      clone.querySelector(".image").innerHTML = partsImage("Engine", model);
      clone.querySelector(".model").textContent = model;
      clone.querySelector(".count").textContent = mixedModelMechCounts[model];
      mixedContainer.appendChild(clone);
    }

    totalMixed += mixedModelMechCounts[model];
  })


  if(totalMixed == 0){
    const clone = templateEmpty.content.cloneNode(true);
    mixedContainer.appendChild(clone);
  }

  let mixedModelMechs = {
    Enforcer: {},
    Ravenger: {},
    Lupis: {},
    Behemoth: {},
    Nexus: {}
  };

  Object.keys(mixedModelMechCountParts).forEach((mech)=>{
    mixedModelMechCountParts[mech].forEach((parts)=>{
      parts.forEach((part)=>{
        if(!mixedModelMechs[part.model][part.part]){
          mixedModelMechs[part.model][part.part] = 0;
        }
        mixedModelMechs[part.model][part.part]++;
      });
    })
  })

  // Create remaining parts
  Object.keys(fullModelMechs).forEach((model)=>{
    let fullMechParts = fullModelMechs[model];
    remainingParts[model] = {
      Arm: fullMechParts['Arm'] - fullModelMechCounts[model]*2 - (mixedModelMechs[model]['Arm'] ? mixedModelMechs[model]['Arm'] : 0),
      Legs: fullMechParts['Legs'] - fullModelMechCounts[model] - (mixedModelMechs[model]['Legs'] ? mixedModelMechs[model]['Legs'] : 0),
      Head: fullMechParts['Head'] - fullModelMechCounts[model] - (mixedModelMechs[model]['Head'] ? mixedModelMechs[model]['Head']  : 0),
      Body: fullMechParts['Body'] - fullModelMechCounts[model] - (mixedModelMechs[model]['Body'] ? mixedModelMechs[model]['Body']  : 0),
      Engine: fullMechParts['Engine'] - fullModelMechCounts[model] - (mixedModelMechs[model]['Engine'] ?  mixedModelMechs[model]['Engine'] : 0)
    };
  });

  // Mixed Mech Parts
  let mixedMechs = buildMechs(mixedModelMechCountParts, false);
  if(mixedMechs.length == 0){
    const clone = templateEmpty.content.cloneNode(true);
    mixedmechContainer.appendChild(clone);
  }
  mixedMechs.forEach((mech)=>{
    const clone = templateMixedMech.content.cloneNode(true);

    clone.querySelector(".engine").innerHTML = partsImage('Engine', mech.Engine);
    clone.querySelector(".head").innerHTML = partsImage('Head', mech.Head);
    clone.querySelector(".body").innerHTML = partsImage('Body', mech.Body);
    clone.querySelector(".legs").innerHTML = partsImage('Legs', mech.Legs);
    clone.querySelector(".left_arm").innerHTML = partsImage('Arm', mech.left_arm);
    clone.querySelector(".right_arm").innerHTML = partsImage('Arm', mech.right_arm);

    mixedmechContainer.appendChild(clone);
  })
  document.querySelector("#mixed_count2").innerHTML = '('+mixedMechs.length+')';
  document.querySelector("#mixed_count").innerHTML = '('+mixedMechs.length+')';

  // No Afterglow
  let mixedMechsNoAfterglow = buildMechs(mixedModelMechCountPartsNoAfterglow, false);
  if(mixedMechsNoAfterglow.length == 0){
    const clone = templateEmpty.content.cloneNode(true);
    mixedmechNoAfterglowContainer.appendChild(clone);
  }
  mixedMechsNoAfterglow.forEach((mech)=>{
    const clone = templateMixedMech.content.cloneNode(true);

    clone.querySelector(".engine").innerHTML = partsImage('Engine', mech.Engine);
    clone.querySelector(".head").innerHTML = partsImage('Head', mech.Head);
    clone.querySelector(".body").innerHTML = partsImage('Body', mech.Body);
    clone.querySelector(".legs").innerHTML = partsImage('Legs', mech.Legs);
    clone.querySelector(".left_arm").innerHTML = partsImage('Arm', mech.left_arm);
    clone.querySelector(".right_arm").innerHTML = partsImage('Arm', mech.right_arm);

    mixedmechNoAfterglowContainer.appendChild(clone);
  })
  document.querySelector("#noafterglow_count").innerHTML = '('+mixedMechsNoAfterglow.length+')';



  rarityOrder.forEach((model)=>{
    let fullMechParts = remainingParts[model];
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
        if(!partialMechCountParts[model]){
          partialMechCountParts[model] = [];
        }
        partCounts[partOne]--;
        partCounts[partTwo]--;
        partialMechCounts[model]++;
        partialMechCountParts[model].push([
          {
            model: model,
            part: partOne
          },
          {
            model: model,
            part: partTwo
          },
        ]);
        remainingAfterglows--;
      }
    }
    // // Build Table
    // if(mixedModelMechCounts[model] > 0){
    //   const clone = templateMixed.content.cloneNode(true);
    //   clone.querySelector(".image").innerHTML = '<img height="60px" src="./images/parts/' + model + '_Engine.png" />';
    //   clone.querySelector(".model").textContent = model;
    //   clone.querySelector(".count").textContent = mixedModelMechCounts[model];
    //   mixedContainer.appendChild(clone);
    // }

    // totalMixed += mixedModelMechCounts[model];
  })

  // Partial
  // let mixedMechsPartialAfterglow = buildMechs(partialMechCountParts, true, remainingParts);
  let mixedMechsPartial = buildMechs(partialMechCountParts, true);
  if(mixedMechsPartial.length == 0){
    const clone = templateEmpty.content.cloneNode(true);
    mixedmechPartialContainer.appendChild(clone);
  }
  mixedMechsPartial.forEach((mech)=>{
    const clone = templateMixedMech.content.cloneNode(true);

    if(mech.Engine){
      clone.querySelector(".engine").innerHTML = partsImage('Engine', mech.Engine);
    }else{
      clone.querySelector(".engine").innerHTML = partsImage('Engine', 'missing');
    }

    if(mech.Head){
      clone.querySelector(".head").innerHTML = partsImage('Head', mech.Head);
    }else{
      clone.querySelector(".head").innerHTML = partsImage('Head', 'missing');
    }

    if(mech.Body){
      clone.querySelector(".body").innerHTML = partsImage('Body', mech.Body);
    }else{
      clone.querySelector(".body").innerHTML = partsImage('Body', 'missing');
    }

    if(mech.Legs){
      clone.querySelector(".legs").innerHTML = partsImage('Legs', mech.Legs);
    }else{
      clone.querySelector(".legs").innerHTML = partsImage('Legs', 'missing');
    }

    if(mech.left_arm){
      clone.querySelector(".left_arm").innerHTML = partsImage('Arm', mech.left_arm);
    }else{
      clone.querySelector(".left_arm").innerHTML = partsImage('Arm', 'missing');
    }

    if(mech.right_arm){
      clone.querySelector(".right_arm").innerHTML = partsImage('Arm', mech.right_arm);
    }else{
      clone.querySelector(".right_arm").innerHTML = partsImage('Arm', 'missing');
    }
    mixedmechPartialContainer.appendChild(clone);
  })
  let mixedPartialTotal = mixedMechsPartial.length;
  document.querySelector("#partial_count").innerHTML = '('+mixedPartialTotal+')';

  let remainingCount = 0;
  // remaining parts
  rarityOrder.forEach((model)=>{
    if(remainingParts[model]){
      Object.keys(remainingParts[model]).forEach((part)=>{
        if(remainingParts[model][part] > 0){
          const clone = templateRemainingMech.content.cloneNode(true);

          clone.querySelector(".image").innerHTML = partsImage(part, model);
          clone.querySelector(".part").textContent = part;
          clone.querySelector(".model").textContent = model;
          clone.querySelector(".count").textContent = remainingParts[model][part];
          remainingContainer.appendChild(clone);
          remainingCount += remainingParts[model][part];
        }
      });
    }
  });

  if(remainingCount == 0){
    const clone = templateEmpty.content.cloneNode(true);
    remainingContainer.appendChild(clone);
  }
  document.querySelector("#remaining_count").innerHTML = '('+remainingCount+')';

  document.querySelector("#info").display = 'none';
  document.querySelector("#info2").display = 'none';
  document.querySelector("#instructions").display = 'none';

  document.querySelector("#connected").style.display = "block";
}

function buildMechs(mixedModelMechCountParts, allowPartial){
  let mixedMechs = [];

  rarityOrder.forEach((model)=>{
    let tempRemainingParts = JSON.parse(JSON.stringify(remainingParts));
    let baseParts = mixedModelMechCountParts[model];
    if(baseParts.length > 0){

      baseParts.forEach((mech)=>{
        let fullMech = {
          Engine: model
        };
        tempRemainingParts[model]['Engine']--;
        let remainingPartNames = ['Head', 'Body', 'Legs', 'Arm', 'Arm'];
        mech.forEach((modelPart)=>{
          var index = remainingPartNames.indexOf(modelPart.part);
          if (index !== -1) {
            remainingPartNames.splice(index, 1);
            if(modelPart.part == 'Arm' && !fullMech['left_arm']){
              fullMech['left_arm'] = model;
              tempRemainingParts[model]['Arm']--;
            } else if(modelPart.part == 'Arm' && fullMech['left_arm']){
              fullMech['right_arm'] = model;
              tempRemainingParts[model]['Arm']--;
            } else if(modelPart.part != 'Arm'){
              fullMech[modelPart.part] = model;
              tempRemainingParts[model][modelPart.part]--;
            }
          }
        })
        console.log('remainingPartNames:', remainingPartNames);
        for(let j=0; j < remainingPartNames.length; j++){
        // remainingPartNames.forEach((part)=>{
          let part = remainingPartNames[j];
          // Remove part from inventory
          for(let i=0; i < rarityOrder.length; i++){
            let model = rarityOrder[i];
            if(tempRemainingParts[model][part] > 0){
              tempRemainingParts[model][part]--;
              // Still need a left arm
              if(part == 'Arm' && !fullMech['left_arm']){
                fullMech['left_arm'] = model
                break;
              }
              // already got the left arm
              else if(part == 'Arm' && fullMech['left_arm']){
                fullMech['right_arm'] = model;
                break;
              }
              // Not an arm
              else if(part != 'Arm') {
                fullMech[part] = model;
                break;
              }
              console.log('Using part: ', model + ' ' + part);
            }
          }
        // })
        }
        if((allowPartial && (!fullMech.Head || !fullMech.Body
          || !fullMech.Legs || !fullMech.left_arm
          || !fullMech.right_arm || !fullMech.Engine))
          || (!allowPartial && (fullMech.Head && fullMech.Body
            && fullMech.Legs && fullMech.left_arm
            && fullMech.right_arm && fullMech.Engine))){
          mixedMechs.push(fullMech);
          remainingParts = tempRemainingParts;
        }
      });
    }
  });

  return mixedMechs;
}

async function getMechTokenBalance(address, card) {
  try{
    let result = await mechContract.methods.balanceOf(address, card).call();

    console.log('getMechTokenBalance: ',  parts[card-1].model + ' ' + parts[card-1].part, result);
    return parseInt(result);
  }catch(e){
    console.log('getMechTokenBalance Error:',e)
    return 0;
  }
}

async function getMechTokenBalanceBatch(addresses, cards) {
  try{
    let result = await mechContract.methods.balanceOfBatch(addresses, cards).call();

    console.log('getMechTokenBalanceBatch: ', result);
    return result;
  }catch(e){
    console.log('getMechTokenBalance Error:',e)
    return [];
  }
}

async function getAfterglowTokenBalance(address, card) {
  try{
    let result = await afterglowContract.methods.balanceOf(address, card).call();

    console.log('getAfterglowTokenBalance: ',  afterglows[card-1], result);
    return parseInt(result);
  }catch(e){
    console.log('getAfterglowTokenBalance Error:',e)
    return 0;
  }
}

async function getAfterglowTokenBalanceBatch(addresses, cards) {
  try{
    let result = await afterglowContract.methods.balanceOfBatch(addresses, cards).call();

    console.log('getAfterglowTokenBalanceBatch: ',  result);
    return result;
  }catch(e){
    console.log('getAfterglowTokenBalanceBatch Error:',e)
    return [];
  }
}

async function refreshAccountData() {
  document.querySelector("#connected").style.display = "none";
  document.querySelector("#info").style.display = "none";
  document.querySelector("#info2").style.display = "none";
  document.querySelector("#instructions").style.display = "none";

  await fetchAccountData(provider);
}

window.addEventListener('load', async () => {
  init();
  document.querySelector("#btn-query").addEventListener("click", refreshAccountData);
});
