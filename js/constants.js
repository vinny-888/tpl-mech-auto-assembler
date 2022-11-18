

const RARITY_ORDER = ['Nexus', 'Behemoth', 'Lupis', 'Ravenger', 'Enforcer'];
const PARTS_ORDER = ['Engine', 'Head', 'Body', 'Legs', 'Arm'];
const MODEL_WEIGHTS = {
  Nexus: 1,
  Behemoth: 2,
  Lupis: 3,
  Ravenger: 4,
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

const templateCounts = document.querySelector("#template-counts");
const countsContainer = document.querySelector("#counts");
const templateEmpty = document.querySelector("#template-empty");