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
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "accounts",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "ids",
          "type": "uint256[]"
        }
      ],
      "name": "balanceOfBatch",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];