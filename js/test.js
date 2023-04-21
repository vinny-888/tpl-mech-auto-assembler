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
    const web3 = new Web3(provider, {timeout: 20000});
    const latest = await web3.eth.getBlockNumber();

    const logs = [
		...(await query(genesisMechContract, 'Transfer', { to: [address] }, 0, latest)),
		...(await query(genesisMechContract, 'Transfer', { from: [address] }, 0, latest)),
	];

    console.log(logs);

    logs.sort((a, b) => {
		if (a.blockNumber !== b.blockNumber) {
			return a.blockNumber - b.blockNumber;
		}

		return a.logIndex - b.logIndex;
	});

	const holdings = [];
    const tokens = [];

	logs.forEach((log) => {
		const args = log.returnValues;
		const id = parseInt(args[2]);
		if (args[1].toLowerCase() == address) {
			holdings.push(id);
		} else if (args[0].toLowerCase() == address) {
			holdings.splice(holdings.indexOf(id), 1);
            tokens.push(id);
		}
	});

    console.log('Tokens: ', tokens);
	return holdings;
}

window.addEventListener('load', async () => {
    initMechContract();
    getAccountRevealedParts('0x0000000000000000000000000000000000000000');
});