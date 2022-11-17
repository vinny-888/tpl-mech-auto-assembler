let dataModel = {
  remainingParts: {},
  remainingAfterglows: 0,
  totalParts: 0,
  totalAfterglows: 0,
  walletParts: [],
  walletAfterglows: [],
  fullModelMechs: {
    Enforcer: {},
    Ravenger: {},
    Lupis: {},
    Behemoth: {},
    Nexus: {}
  },
  fullModelMechCounts: {
    Nexus: 0,
    Behemoth: 0,
    Lupis: 0,
    Ravenger: 0,
    Enforcer: 0
  },
  mixedModelMechCounts: {
    Enforcer: 0,
    Ravenger: 0,
    Lupis: 0,
    Behemoth: 0,
    Nexus: 0
  },
  partialMechCounts: {
    Enforcer: 0,
    Ravenger: 0,
    Lupis: 0,
    Behemoth: 0,
    Nexus: 0
  },
  mixedModelMechCountParts: {
    Enforcer: [],
    Ravenger: [],
    Lupis: [],
    Behemoth: [],
    Nexus: []
  },
  mixedModelMechCountPartsNoAfterglow: {
    Enforcer: [],
    Ravenger: [],
    Lupis: [],
    Behemoth: [],
    Nexus: []
  },
  partialMechCountParts: {
    Enforcer: [],
    Ravenger: [],
    Lupis: [],
    Behemoth: [],
    Nexus: []
  },
  mixedModelMechs: {
    Enforcer: {},
    Ravenger: {},
    Lupis: {},
    Behemoth: {},
    Nexus: {}
  }
};

function resetModel(){
  dataModel.remainingParts = {};
  dataModel.remainingAfterglows = 0;
  dataModel.totalParts = 0;
  dataModel.totalAfterglows = 0;
  dataModel.walletParts = [];
  dataModel.walletAfterglows = [];
  dataModel.fullModelMechs = {
    Enforcer: {},
    Ravenger: {},
    Lupis: {},
    Behemoth: {},
    Nexus: {}
  };
  dataModel.fullModelMechCounts = {
    Nexus: 0,
    Behemoth: 0,
    Lupis: 0,
    Ravenger: 0,
    Enforcer: 0
  };
  dataModel.mixedModelMechCounts = {
    Enforcer: 0,
    Ravenger: 0,
    Lupis: 0,
    Behemoth: 0,
    Nexus: 0
  };
  dataModel.partialMechCounts = {
    Enforcer: 0,
    Ravenger: 0,
    Lupis: 0,
    Behemoth: 0,
    Nexus: 0
  },
  dataModel.mixedModelMechCountParts = {
    Enforcer: [],
    Ravenger: [],
    Lupis: [],
    Behemoth: [],
    Nexus: []
  };
  dataModel.mixedModelMechCountPartsNoAfterglow = {
    Enforcer: [],
    Ravenger: [],
    Lupis: [],
    Behemoth: [],
    Nexus: []
  };
  dataModel.partialMechCountParts = {
    Enforcer: [],
    Ravenger: [],
    Lupis: [],
    Behemoth: [],
    Nexus: []
  };
  dataModel.mixedModelMechs = {
    Enforcer: {},
    Ravenger: {},
    Lupis: {},
    Behemoth: {},
    Nexus: {}
  };
}