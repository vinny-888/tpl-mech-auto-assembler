const ORIGINAL_RARITY_ORDER = ['Nexus', 'Lupis', 'Behemoth', 'Ravager', 'Enforcer'];
let RARITY_ORDER = ['Nexus', 'Lupis', 'Behemoth', 'Ravager', 'Enforcer'];
const RARITY_ORDER_BEHEMOTH = ['Nexus', 'Behemoth', 'Lupis', 'Ravager', 'Enforcer'];
const PARTS_ORDER = ['Engine', 'Head', 'Body', 'Leg', 'Arm'];
let ORIGINAL_MODEL_WEIGHTS = {
  Nexus: 1,
  Lupis: 2,
  Behemoth: 3,
  Ravager: 4,
  Enforcer: 5,
};
let MODEL_WEIGHTS = {
  Nexus: 1,
  Lupis: 2,
  Behemoth: 3,
  Ravager: 4,
  Enforcer: 5,
};
const MODEL_WEIGHTS_BEHEMOTH = {
  Nexus: 1,
  Behemoth: 2,
  Lupis: 3,
  Ravager: 4,
  Enforcer: 5,
};

const PARTS_LIST = [
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
    model: 'Ravager',
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
    model: 'Ravager',
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
    model: 'Ravager',
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
    model: 'Ravager',
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
    part: 'Leg'
  },
  {
    model: 'Ravager',
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

const AFTERGLOWS = [
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
  ].reverse();

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
const mixedmechPartialNoModelContainer = document.querySelector("#mechsPartialNoModel");

const templateCounts = document.querySelector("#template-counts");
const countsContainer = document.querySelector("#counts");

const templateMechCounts = document.querySelector("#template-mech-counts");
const mechCountsContainer = document.querySelector("#mech-counts");

const templatePartCounts = document.querySelector("#template-part-counts");
const partCountsContainer = document.querySelector("#part-counts");

const templateUnclaimedPartCounts = document.querySelector("#template-unclaimed-part-counts");
const unclaimedPartCountsContainer = document.querySelector("#unclaimed-part-counts");

const templateEmpty = document.querySelector("#template-empty");
