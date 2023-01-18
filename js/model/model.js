let dataModel = {
  cyberBrokers: [],
  owners: {},
  useLowest: false,
  useBehemoth: false,
  useStyles: false,
  walletParts: [],
  walletAfterglows: [],
  remainingAfterglows: 0,
  modelParts: {
    Enforcer: {},
    Ravager: {},
    Lupis: {},
    Behemoth: {},
    Nexus: {}
  },
  mechs: {
    Enforcer: [],
    Ravager: [],
    Lupis: [],
    Behemoth: [],
    Nexus: []
  },
  dismantled: {
    Enforcer: 0,
    Ravager: 0,
    Lupis: 0,
    Behemoth: 0,
    Nexus: 0
  }
};

function resetModel(){
  cyberBrokers = [];
  owners = {};
  useLowest = false;
  useBehemoth = false;
  useStyles = false;
  dataModel.walletParts = [];
  dataModel.walletAfterglows = [];
  dataModel.remainingAfterglows = 0;
  dataModel.modelParts = {
    Enforcer: {},
    Ravager: {},
    Lupis: {},
    Behemoth: {},
    Nexus: {}
  };
  mechs = {
    Enforcer: [],
    Ravager: [],
    Lupis: [],
    Behemoth: [],
    Nexus: []
  };
  dismantled = {
    Enforcer: 0,
    Ravager: 0,
    Lupis: 0,
    Behemoth: 0,
    Nexus: 0
  };
}