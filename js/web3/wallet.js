let provider = null;
if(typeof web3 !== 'undefined'){
    provider = web3.currentProvider;
}
const mechTokenContract = "0xf4bacb2375654ef2459f427c8c6cf34573f75154";
const mechRevealedTokenContract = "0x7bc1e07cdfa283db7cf3c680d16ca7f161a64046";
const afterglowTokenContract = "0xa47fb7c4edd3475ce66f49a66b9bf1edbc61e52d";
const cyberbrokerTokenContract = "0x892848074ddea461a15f337250da3ce55580ca85";
const wrapperTokenContract = "0x6158795c09E6C94080f66Eb9a11aD3d908209284";
const lostParadigmsTokenContract = "0x067154450e59e81ed6bad1bbee459bd7cc2236ea";

let mechContract = null;
let mechRevealedContract = null;
let afterglowContract = null;
let cyberbrokerContract = null;
let wrapperContract = null;

let web3Provider;

function initContracts(){
    if(typeof web3 !== 'undefined'){
        console.log("window.web3 is", window.web3, "window.ethereum is", window.ethereum);
        const web3 = web3Provider = new Web3(provider);
        mechContract = new web3.eth.Contract(balanceOfABI, mechTokenContract);
        mechRevealedContract = new web3.eth.Contract(revealedABI, mechRevealedTokenContract);
        afterglowContract = new web3.eth.Contract(balanceOfABI, afterglowTokenContract);
        cyberbrokerContract = new web3.eth.Contract(tokenBalanceABI, cyberbrokerTokenContract);
        wrapperContract = new web3.eth.Contract(tokenWrapperABI, wrapperTokenContract);
    }
}

function initLPContracts(){
    if(typeof web3 !== 'undefined'){
        console.log("window.web3 is", window.web3, "window.ethereum is", window.ethereum);
        const web3 = new Web3(provider);
        wrapperContract = new web3.eth.Contract(tokenWrapperABI, wrapperTokenContract);
    }
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

async function getRevealedMechTokenBalance(address) {
    try{
        let result = await mechRevealedContract.methods.balanceOf(address).call();

        // console.log('getMechTokenBalance: ',  PARTS_LIST[card-1].model + ' ' + PARTS_LIST[card-1].part, result);
        return parseInt(result);
    }catch(e){
        console.log('getRevealedMechTokenBalance Error:',e)
        return 0;
    }
}

async function getRevealedMechTokenMetadata(tokenId) {
    try{
        let result = await mechRevealedContract.methods.getTokenExtra(tokenId).call();

        // console.log('getMechTokenBalance: ',  PARTS_LIST[card-1].model + ' ' + PARTS_LIST[card-1].part, result);
        return result;
    }catch(e){
        console.log('getRevealedMechTokenMetadata Error:',e)
        return 0;
    }
}

async function getRevealedMechTotalSupply() {
    try{
        let result = await mechRevealedContract.methods.totalSupply().call();

        // console.log('getMechTokenBalance: ',  PARTS_LIST[card-1].model + ' ' + PARTS_LIST[card-1].part, result);
        return parseInt(result);
    }catch(e){
        console.log('getRevealedMechTokenMetadata Error:',e)
        return 0;
    }
}

async function getRevealedMechTokenBalance(address, totalSupply) {
    try{
        let result = await wrapperContract.methods.getTokens(mechRevealedTokenContract, address, 1, totalSupply).call();

        console.log('getRevealedMechTokenBalance: ', result);
        return result;
    }catch(e){
        console.log('getRevealedMechTokenBalance Error:',e)
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

async function populateWalletMechPartsStyles(address, totalSupply){
    let res = await getRevealedMechTokenBalance(address, totalSupply);
    return res;
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

async function query(contract, event, filter, fromBlock, toBlock) {
    try {
		return await contract.getPastEvents(event, { filter, fromBlock, toBlock });
	} catch (e) {
		const step = ~~((toBlock - fromBlock) / 2);
		const middle = fromBlock + step;
		return [
			...(await query(contract, event, filter, fromBlock, middle)),
			...(await query(contract, event, filter, middle + 1, toBlock)),
		];
	}
}

async function getAccountRevealedParts(address) {
    const latest = await web3Provider.eth.getBlockNumber();

    const logs = [
		...(await query(mechRevealedContract, 'Transfer', { to: [address] }, 0, latest)),
		...(await query(mechRevealedContract, 'Transfer', { from: [address] }, 0, latest)),
	];

    console.log(logs);

    logs.sort((a, b) => {
		if (a.blockNumber !== b.blockNumber) {
			return a.blockNumber - b.blockNumber;
		}

		return a.logIndex - b.logIndex;
	});

	const holdings = [];

	logs.forEach((log) => {
		const args = log.returnValues;
		const id = parseInt(args[2]);
		if (args[1].toLowerCase() == address) {
			holdings.push(id);
		} else if (args[0].toLowerCase() == address) {
			holdings.splice(holdings.indexOf(id), 1);
		}
	});

	return holdings;
}