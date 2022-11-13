"use strict";

 const tokenContract = "0xf4bacb2375654ef2459f427c8c6cf34573f75154"

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
    part: 'leg'
  },
  {
    model: 'Ravenger',
    part: 'Leg'
  },
  {
    model: 'Behemoth',
    part: 'Leg'
  },
  {
    model: 'Lupis',
    part: 'Leg'
  },
  {
    model: 'Nexus',
    part: 'Leg'
  }
 ];
let contract = null;
const Web3Modal = window.Web3Modal.default;
let web3Modal
let provider;
let selectedAccount;

function init() {
  console.log("window.web3 is", window.web3, "window.ethereum is", window.ethereum);

  if(location.protocol !== 'https:') {
    const alert = document.querySelector("#alert-error-https");
    alert.style.display = "block";
    document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
    return;
  }

  const providerOptions = {};

  web3Modal = new Web3Modal({
    cacheProvider: false, // optional
    providerOptions, // required
    disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
  });

  console.log("Web3Modal instance is", web3Modal);
}


/**
 * Kick in the UI action after Web3modal dialog has chosen a provider
 */
async function fetchAccountData() {

  // Get a Web3 instance for the wallet
  const web3 = new Web3(provider);

  contract = new web3.eth.Contract(balanceOfABI, tokenContract);

  console.log("Web3 instance is", web3);

  // Get connected chain id from Ethereum node
  const chainId = await web3.eth.getChainId();
  // Load chain information over an HTTP API
  const chainData = evmChains.getChain(chainId);

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

  // Purge UI elements any previously loaded accounts
  accountContainer.innerHTML = '';

  // Go through all accounts and get their ETH balance
  const rowResolvers = accounts.map(async (address) => {
    // Get the 26 TPL Mech Part Balances
    for(let i=1; i<=26; i++){
      parts[i-1].count = await getTokenBalance(address, i);
    }

    /* Combine lupis arms with pirate lupis arms */
    parts[1].count += parts[19].count;
    parts.splice(19, 1);

    /* Sort by Model and Part in Rarity Order not Alphabetical */
    parts.sort((a, b) => {
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
    parts.forEach((part)=>{
      fullModelMechs[part.model][part.part] = part.count;
      const clone = template.content.cloneNode(true);
      clone.querySelector(".part").textContent = part.part;
      clone.querySelector(".model").textContent = part.model;
      clone.querySelector(".count").textContent = part.count;
      accountContainer.appendChild(clone);
    });

    let fullModelMechCounts = {
      Enforcer: 0,
      Ravenger: 0,
      Lupis: 0,
      Behemoth: 0,
      Nexus: 0
    };
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
      fullModelMechCounts[model] = min;
      const clone = templateFull.content.cloneNode(true);
      clone.querySelector(".model").textContent = model;
      clone.querySelector(".count").textContent = min;
      fullContainer.appendChild(clone);
    })
    /* TODO Implement Mixed Mechs
    Object.keys(fullModelMechs).forEach((model)=>{
      let min = 99999;
      Object.keys(fullModelMechs[model]).forEach((part)=>{
        let count = parseInt(fullModelMechs[model][part]);
        if(part == 'Arm'){
          count = Math.floor(count/2);
        }
        count -= fullModelMechCounts[model];
        if(count < min){
          min = count;
        }
      });
      fullModelMechCounts[model] = min;
      const clone = templateMixed.content.cloneNode(true);
      clone.querySelector(".model").textContent = model;
      clone.querySelector(".count").textContent = min;
      mixedContainer.appendChild(clone);
    })
    */
    document.querySelector("#info").innerHTML = '';
  });

  await Promise.all(rowResolvers);

  document.querySelector("#prepare").style.display = "none";
  document.querySelector("#connected").style.display = "block";
}

async function getTokenBalance(address, card) {
  try{
    let result = await contract.methods.balanceOf(address, card).call();
    
    console.log('getTokenBalance: ',  parts[card-1].model + ' ' + parts[card-1].part, result);
    return parseInt(result);
  }catch(e){
    console.log('getTokenBalance Error:',e)
    return 0;
  }
}

async function refreshAccountData() {

  document.querySelector("#connected").style.display = "none";
  document.querySelector("#prepare").style.display = "block";

  document.querySelector("#info").innerHTML = 'Getting TPL Mech Part Balances, this may take a few seconds... Please Wait!';

  document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
  await fetchAccountData(provider);
  document.querySelector("#btn-connect").removeAttribute("disabled")
}

async function onConnect() {

  console.log("Opening a dialog", web3Modal);
  try {
    provider = await web3Modal.connect();
  } catch(e) {
    console.log("Could not get a wallet connection", e);
    return;
  }

  provider.on("accountsChanged", (accounts) => {
    fetchAccountData();
  });
  provider.on("chainChanged", (chainId) => {
    fetchAccountData();
  });
  provider.on("networkChanged", (networkId) => {
    fetchAccountData();
  });

  await refreshAccountData();
}

async function onDisconnect() {
  console.log("Killing the wallet connection", provider);

  if(provider.close) {
    await provider.close();

    await web3Modal.clearCachedProvider();
    provider = null;
  }

  selectedAccount = null;

  document.querySelector("#prepare").style.display = "block";
  document.querySelector("#connected").style.display = "none";
}

window.addEventListener('load', async () => {
  init();
  document.querySelector("#btn-connect").addEventListener("click", onConnect);
  document.querySelector("#btn-disconnect").addEventListener("click", onDisconnect);
});
