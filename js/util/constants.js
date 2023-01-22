const ORIGINAL_RARITY_ORDER = ['Nexus', 'Lupis', 'Behemoth', 'Ravager', 'Enforcer'];
let RARITY_ORDER = ['Nexus', 'Lupis', 'Behemoth', 'Ravager', 'Enforcer'];
const RARITY_ORDER_BEHEMOTH = ['Nexus', 'Behemoth', 'Lupis', 'Ravager', 'Enforcer'];
const PARTS_ORDER = ['Engine', 'Head', 'Body', 'Leg', 'Arm'];
const BODY_PART_MAPPING = [
  'ARM',
  'HEAD',
  'BODY',
  'LEGS',
  'ENGINE'
]
const BODY_PART_MODEL_MAPPING = [
  'ENFORCER',
  'RAVAGER',
  'BEHEMOTH',
  'LUPIS',
  'NEXUS'
]
const STYLE_ORDER = {
  Enforcer: ['Action Bot 3000',
    'Buildy Bot',
    'CAMM-E',
    'CyberRacer',
    'Red Alert',
    'xXLiquidatorXx',
    'Demolisher',
    'DJ Lux',
    'Lonestar',
    'Astra Machina',
    'NekoChan!',
    'The Sentinel'
  ],
  Ravager: [
    'Wasteland Wonder',
    'Creative Deviant',
    'Chopshop',
    'Marrow Lord',
    'Nullstatic',
    'Sir Furnace Cogswell',
    'Deadpoint',
    'Forgotten Friend',
    'woWee',
    'Shopbot',
    'MissingNo.'
  ],
  Behemoth: [
    'Major Gunner',
    'Draconian',
    'Mr. Grif',
    'Hoarfrost',
    'Fathom',
    'NekoGrowl!',
    'Mecha Kong',
    'Arcane Guardian',
    'The Oni King',
    'The Goddess'
  ],
  Lupis: [
    'CyberKnight',
    'Lycan X',
    'Bladerunner',
    'Queen Andromeda',
    'Magi',
    'Masamune',
    'Witchwood',
    'Amalgam',
    'The Duchess',
    'Hellspawn'
  ],
  Nexus: [
    'Oberon',
    'Scheherazade',
    'GigaZilla',
    'Wasteland Warlord',
    'Alatyr',
    'Incarnate',
    'Ouroboros'
  ]
}

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
    {name: 'ShaDAO Black', total:1853},
    {name: 'Starter Green', total:1862},
    {name: 'Common Lavender', total:1835},
    {name: 'Tabula Rasa White', total:1822},
    {name: 'Abundant Blue', total:810},
    {name: 'Seeker Green', total:728},
    {name: 'Takedown Green', total:627},
    {name: 'Backdoor Burgundy', total:558},
    {name: 'Fixer Plum', total:508},
    {name: 'Stonefaced Sapphire', total:464},
    {name: 'Escapist Magenta', total:424},
    {name: 'Lost-in-the-Crowd Orange', total:384},
    {name: 'Existential Pink', total:350},
    {name: 'Phishing Gold', total:211},
    {name: 'Reaction Time Red', total:143},
    {name: 'Enigma Yellow', total:133},
    {name: 'Precious Cargo Green', total:114},
    {name: 'Broken Sky Blue', total:94},
    {name: 'Stationary Green', total:90},
    {name: 'Cosmic Squid Pink', total:84},
    {name: 'Hallowed Grounds', total:35},
    {name: 'Closed Captioning', total:30},
    {name: 'Eldrtich Descent', total:29},
    {name: 'Instatutional Pedigree', total:26},
    {name: 'Tsujigiri Slash', total:24},
    {name: 'Double Spend', total:21},
    {name: 'Ethereal Dream', total:19},
    {name: 'Circuit Overload', total:17},
    {name: 'Bone and Flesh', total:15},
    {name: 'Pink Parser', total:14},
    {name: 'Xenoform Unknown', total:11},
    {name: 'Blood Money', total:10},
    {name: 'Quid Pro Quo', total:9},
    {name: 'Singularity Prophet', total:8},
    {name: 'Wildstyle Monarch', total:5},
    {name: 'Deva\'s Breath', total:3},
    {name: 'True Belief', total:2},
    {name: 'The One', total:1}
  ].reverse();

const template = document.querySelector("#template-balance");
const accountContainer = document.querySelector("#accounts");

const templateFull = document.querySelector("#template-full");
const fullContainer = document.querySelector("#full");

const templateSingle = document.querySelector("#template-single");
const templateMixed = document.querySelector("#template-mixed");
const sameContainer = document.querySelector("#same");
const mixedContainer = document.querySelector("#mixed");
const partialContainer = document.querySelector("#partial");

const templateAfterglow = document.querySelector("#template-afterglow");
const afterglowContainer = document.querySelector("#afterglow");

const templateMixedMech = document.querySelector("#template-mech");
const mixedmechContainer = document.querySelector("#mechs");

const templateRemainingMech = document.querySelector("#template-remaining");
const remainingContainer = document.querySelector("#remaining");

const mixedmechNoAfterglowContainer = document.querySelector("#mechsNoAfterglow");
const mixedmechPartialContainer = document.querySelector("#mechsPartial");
const mixedmechSameModelContainer = document.querySelector("#mechsSameModel");
const mixedmechMixedModelContainer = document.querySelector("#mechsMixedModel");
const mixedmechMixedPartialModelContainer = document.querySelector("#mechsMixedPartialModel");

const templateCounts = document.querySelector("#template-counts");
const countsContainer = document.querySelector("#counts");

const templateMechCounts = document.querySelector("#template-mech-counts");
const mechCountsContainer = document.querySelector("#mech-counts");

const templatePartCounts = document.querySelector("#template-part-counts");
const partCountsContainer = document.querySelector("#part-counts");

const templateUnclaimedPartCounts = document.querySelector("#template-unclaimed-part-counts");
const unclaimedPartCountsContainer = document.querySelector("#unclaimed-part-counts");

const templateCyberbrokerCounts = document.querySelector("#template-cyberbroker-counts");
const cyberbrokerCountsContainer = document.querySelector("#cyberbrokers-counts");

const templateEmpty = document.querySelector("#template-empty");

const templateMechStats = document.querySelector("#template-mech-stats");
const mechStatsNexusContainer = document.querySelector("#mech-stats-nexus");
const mechStatsLupisContainer = document.querySelector("#mech-stats-lupis");
const mechStatsBehemothContainer = document.querySelector("#mech-stats-behemoth");
const mechStatsRavagerContainer = document.querySelector("#mech-stats-ravager");
const mechStatsEnforcerContainer = document.querySelector("#mech-stats-enforcer");

const templateMax = document.querySelector("#template-max");
const templateMaxMixed = document.querySelector("#template-max-mixed");
const maxMechContainer = document.querySelector("#maxMech");
const maxEnduranceMechContainer = document.querySelector("#maxEnduranceMech");
const maxSpeedMechContainer = document.querySelector("#maxSpeedMech");
const maxPowerMechContainer = document.querySelector("#maxPowerMech");
const frankenstatEnduranceMechContainer = document.querySelector("#frankenstatEnduranceMech");
const frankenstatSpeedMechContainer = document.querySelector("#frankenstatSpeedMech");
const frankenstatPowerMechContainer = document.querySelector("#frankenstatPowerMech");


const templateFullMech = document.querySelector("#template-full");
const fullMechContainer = document.querySelector("#fullMech");