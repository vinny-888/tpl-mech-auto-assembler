"use strict";

 const provider = web3.currentProvider;
 const mechTokenContract = "0xf4bacb2375654ef2459f427c8c6cf34573f75154";
 const afterglowTokenContract = "0xa47fb7c4edd3475ce66f49a66b9bf1edbc61e52d";

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

function init() {
  console.log("window.web3 is", window.web3, "window.ethereum is", window.ethereum);

  if(location.protocol !== 'https:') {
    const alert = document.querySelector("#alert-error-https");
    alert.style.display = "block";
    return;
  }
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

  // Purge UI elements any previously loaded accounts
  accountContainer.innerHTML = '';
  afterglowContainer.innerHTML = '';
  fullContainer.innerHTML = '';
  mixedContainer.innerHTML = '';

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
  for(let i=1; i<=26; i++){
    walletParts.push(parts[i-1]);
    walletParts[i-1].count = await getMechTokenBalance(address, i);
    totalParts += walletParts[i-1].count;
  }
  document.querySelector("#part_count").innerHTML = '('+totalParts+')';

  document.querySelector("#info").innerHTML = 'Getting TPL Afterglows Balances, this may take a few seconds... Please Wait!';

  for(let i=1; i<=38; i++){
    walletAfterglows.push(afterglows[i-1]);
    walletAfterglows[i-1].count = await getAfterglowTokenBalance(address, i);
    totalAfterglows += walletAfterglows[i-1].count;
  }
  document.querySelector("#afterglow_count").innerHTML = '('+totalAfterglows+')';

  /* Combine lupis arms with pirate lupis arms */
  walletParts[1].count += walletParts[19].count;
  walletParts.splice(19, 1);

  /* Sort by Model and Part in Rarity Order not Alphabetical */
  walletParts.sort((a, b) => {
    if(a.model == b.model){
      return a.part.localeCompare(b.part);
    }
    let aVal = 0;
    if(a.model == 'Enforcer'){
      aVal = 1;
    } else if(a.model == 'Ravenger'){
      aVal = 2;
    } else if(a.model == 'Lupis'){
      aVal = 3;
    } else if(a.model == 'Behemoth'){
      aVal = 4;
    } else if(a.model == 'Nexus'){
      aVal = 5;
    }

    let bVal = 0;
    if(b.model == 'Enforcer'){
      bVal = 1;
    } else if(b.model == 'Ravenger'){
      bVal = 2;
    } else if(b.model == 'Lupis'){
      bVal = 3;
    } else if(b.model == 'Behemoth'){
      bVal = 4;
    } else if(b.model == 'Nexus'){
      bVal = 5;
    }
    return aVal - bVal;
  })

  let fullModelMechs = {
    Enforcer: {},
    Ravenger: {},
    Lupis: {},
    Behemoth: {},
    Nexus: {}
  };
  walletParts.forEach((part)=>{
    fullModelMechs[part.model][part.part] = part.count;
    const clone = template.content.cloneNode(true);
    clone.querySelector(".image").innerHTML = '<img height="60px" src="./images/parts/' + part.model + '_' + part.part + '.png" />';
    clone.querySelector(".part").textContent = part.part;
    clone.querySelector(".model").textContent = part.model;
    clone.querySelector(".count").textContent = part.count;
    accountContainer.appendChild(clone);
  });

  walletAfterglows.forEach((afterglow)=>{
    const clone = templateAfterglow.content.cloneNode(true);
    clone.querySelector(".image").innerHTML = '<img height="60px" src="./images/afterglows/' + afterglow.name + '.avif" />';
    clone.querySelector(".name").textContent = afterglow.name;
    clone.querySelector(".count").textContent = afterglow.count;
    afterglowContainer.appendChild(clone);
  });

  let fullModelMechCounts = {
    Enforcer: 0,
    Ravenger: 0,
    Lupis: 0,
    Behemoth: 0,
    Nexus: 0
  };
  let remainingAfterglows = totalAfterglows;
  Object.keys(fullModelMechs).forEach((model)=>{
    let min = 99999;
    Object.keys(fullModelMechs[model]).forEach((part)=>{
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
    const clone = templateFull.content.cloneNode(true);
    clone.querySelector(".image").innerHTML = '<img height="60px" src="./images/parts/' + model + '_engine.png" />';
    clone.querySelector(".model").textContent = model;
    clone.querySelector(".count").textContent = min;
    fullContainer.appendChild(clone);
    totalFullParts += min;
  })
  document.querySelector("#full_count").innerHTML = '('+totalFullParts+')';

  let mixedPartCount = totalParts - totalFullParts;
  document.querySelector("#mixed_count").innerHTML = '('+mixedPartCount+')';
  
  let mixedModelMechCounts = {
    Enforcer: 0,
    Ravenger: 0,
    Lupis: 0,
    Behemoth: 0,
    Nexus: 0
  };

  let min = 99999;
  Object.keys(fullModelMechs).forEach((model)=>{
    let partCounts = {
      Arm: 0,
      Legs: 0,
      Head: 0,
      Body: 0,
      Engine: 0
    };
    Object.keys(fullModelMechs[model]).forEach((part)=>{
      let count = parseInt(fullModelMechs[model][part]);
      if(part != 'Arm'){
        partCounts[part] = count - fullModelMechCounts[model];
      } else {
        partCounts[part] = count - fullModelMechCounts[model]*2;
      }
    });

    let engineCount = partCounts['Engine'];
    let partOne = false;
    let partTwo = false;
    for(let i=0; i< engineCount; i++){
      Object.keys(partCounts).forEach((part)=>{
        if(part != 'Engine'){
          if(partOne == false && partCounts[part] > 0){
            partCounts[part]--;
            partOne = true;
          } else if(partTwo == false  && partCounts[part] > 0){
            partCounts[part]--;
            partTwo = true;
          }
        }
      })

      if(remainingAfterglows > 0){
        if(partOne && partTwo){
          mixedModelMechCounts[model]++;
          remainingAfterglows--;
        }
      }
    }
    const clone = templateMixed.content.cloneNode(true);
    clone.querySelector(".image").innerHTML = '<img height="60px" src="./images/parts/' + model + '_engine.png" />';
    clone.querySelector(".model").textContent = model;
    clone.querySelector(".count").textContent = mixedModelMechCounts[model];
    mixedContainer.appendChild(clone);
    totalMixed += mixedModelMechCounts[model];
  })
  document.querySelector("#mixed_count").innerHTML = '('+totalMixed+')';
  
  document.querySelector("#info").innerHTML = '';

  document.querySelector("#connected").style.display = "block";
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

async function refreshAccountData() {
  document.querySelector("#connected").style.display = "none";

  document.querySelector("#info").innerHTML = 'Getting TPL Mech Part Balances, this may take a few seconds... Please Wait!';

  await fetchAccountData(provider);
}

window.addEventListener('load', async () => {
  init();
  document.querySelector("#btn-query").addEventListener("click", refreshAccountData);
});
