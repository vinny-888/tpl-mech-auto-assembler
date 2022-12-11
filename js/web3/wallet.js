const provider = web3.currentProvider;
const mechTokenContract = "0xf4bacb2375654ef2459f427c8c6cf34573f75154";
const afterglowTokenContract = "0xa47fb7c4edd3475ce66f49a66b9bf1edbc61e52d";
const cyberbrokerTokenContract = "0x892848074ddea461a15f337250da3ce55580ca85";
const wrapperTokenContract = "0x6158795c09E6C94080f66Eb9a11aD3d908209284";
const lostParadigmsTokenContract = "0x067154450e59e81ed6bad1bbee459bd7cc2236ea";

let mechContract = null;
let afterglowContract = null;
let cyberbrokerContract = null;
let wrapperContract = null;

function initContracts(){
    console.log("window.web3 is", window.web3, "window.ethereum is", window.ethereum);
    const web3 = new Web3(provider);
    mechContract = new web3.eth.Contract(balanceOfABI, mechTokenContract);
    afterglowContract = new web3.eth.Contract(balanceOfABI, afterglowTokenContract);
    cyberbrokerContract = new web3.eth.Contract(tokenBalanceABI, cyberbrokerTokenContract);
}

function initLPContracts(){
    console.log("window.web3 is", window.web3, "window.ethereum is", window.ethereum);
    const web3 = new Web3(provider);
    wrapperContract = new web3.eth.Contract(tokenWrapperABI, wrapperTokenContract);
}

async function getLostParadigmsTokenBalance(address) {
    try{
        let result = await wrapperContract.methods.getTokens(lostParadigmsTokenContract, address, 0, 3333).call();

        console.log('getLostParadigmsTokenBalance: ', result);
        return result;
    }catch(e){
        console.log('getLostParadigmsTokenBalance Error:',e)
        return 0;
    }
}

async function getCyberbrokerTokenBalance(address) {
    try{
        let result = await cyberbrokerContract.methods.getTokens(address).call();

        console.log('getCyberbrokerTokenBalance: ', result);
        return result;
    }catch(e){
        console.log('getCyberbrokerTokenBalance Error:',e)
        return 0;
    }
}

async function getCyberbrokerTokenURI(tokenId) {
    try{
        let result = await cyberbrokerContract.methods.tokenURI(tokenId).call();

        console.log('getCyberbrokerTokenURI: ', result);
        return result;
    }catch(e){
        console.log('getCyberbrokerTokenURI Error:',e)
        return 0;
    }
}

async function getMechTokenBalance(address, card) {
    try{
        let result = await mechContract.methods.balanceOf(address, card).call();

        // console.log('getMechTokenBalance: ',  PARTS_LIST[card-1].model + ' ' + PARTS_LIST[card-1].part, result);
        return parseInt(result);
    }catch(e){
        console.log('getMechTokenBalance Error:',e)
        return 0;
    }
}

async function getMechTokenBalanceBatch(addresses, cards) {
    try{
        let result = await mechContract.methods.balanceOfBatch(addresses, cards).call();

        // console.log('getMechTokenBalanceBatch: ', result);
        return result;
    }catch(e){
        console.log('getMechTokenBalance Error:',e)
        return [];
    }
}

async function getAfterglowTokenBalance(address, card) {
    try{
        let result = await afterglowContract.methods.balanceOf(address, card).call();

        // console.log('getAfterglowTokenBalance: ',  AFTERGLOWS[card-1], result);
        return parseInt(result);
    }catch(e){
        console.log('getAfterglowTokenBalance Error:',e)
        return 0;
    }
}

async function getAfterglowTokenBalanceBatch(addresses, cards) {
    try{
        let result = await afterglowContract.methods.balanceOfBatch(addresses, cards).call();

        // console.log('getAfterglowTokenBalanceBatch: ',  result);
        return result;
    }catch(e){
        console.log('getAfterglowTokenBalanceBatch Error:',e)
        return [];
    }
}

async function populateWalletMechParts(address){
    let walletParts = [];
    let res = await getMechTokenBalanceBatch(getAddressArr(address, 26), getCardArr(26));
    for(let i=0; i<26; i++){
        walletParts.push(PARTS_LIST[i]);
        walletParts[i].count = parseInt(res[i]);
    }
    return walletParts;
}

async function populateWalletAfterglows(address){
    let walletAfterglows = [];
    let res = await getAfterglowTokenBalanceBatch(getAddressArr(address, 38), getCardArr(38));
    for(let i=0; i<38; i++){
        walletAfterglows.push(AFTERGLOWS[i]);
        walletAfterglows[i].count = parseInt(res[i]);
    }
    return walletAfterglows;
}