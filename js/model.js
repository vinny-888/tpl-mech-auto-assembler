let dataModel = {
  useLowest: false,
  walletParts: [],
  walletAfterglows: [],
  remainingAfterglows: 0,
  modelParts: {
    Enforcer: {},
    Ravenger: {},
    Lupis: {},
    Behemoth: {},
    Nexus: {}
  },
  mechs: {
    Enforcer: [],
    Ravenger: [],
    Lupis: [],
    Behemoth: [],
    Nexus: []
  },
  dismantled: {
    Enforcer: 0,
    Ravenger: 0,
    Lupis: 0,
    Behemoth: 0,
    Nexus: 0
  }
};

function resetModel(){
  useLowest = false;
  dataModel.walletParts = [];
  dataModel.walletAfterglows = [];
  dataModel.remainingAfterglows = 0;
  dataModel.modelParts = {
    Enforcer: {},
    Ravenger: {},
    Lupis: {},
    Behemoth: {},
    Nexus: {}
  };
  mechs = {
    Enforcer: [],
    Ravenger: [],
    Lupis: [],
    Behemoth: [],
    Nexus: []
  };
  dismantled = {
    Enforcer: 0,
    Ravenger: 0,
    Lupis: 0,
    Behemoth: 0,
    Nexus: 0
  };
}