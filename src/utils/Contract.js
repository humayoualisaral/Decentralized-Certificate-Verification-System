
export const CONTRACT_ABI=[
	{
		"inputs": [
			{
				"internalType": "string[]",
				"name": "certificateIds",
				"type": "string[]"
			},
			{
				"internalType": "bytes32[]",
				"name": "dataHashes",
				"type": "bytes32[]"
			}
		],
		"name": "batchStoreCertificates",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "certificateId",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "dataHash",
				"type": "bytes32"
			}
		],
		"name": "CertificateStored",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "certificateId",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "isValid",
				"type": "bool"
			}
		],
		"name": "CertificateVerified",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "certificateId",
				"type": "string"
			},
			{
				"internalType": "bytes32",
				"name": "dataHash",
				"type": "bytes32"
			}
		],
		"name": "storeCertificate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newAdmin",
				"type": "address"
			}
		],
		"name": "transferAdmin",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "allCertificateIds",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "certificateId",
				"type": "string"
			}
		],
		"name": "certificateExists",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "certificateId",
				"type": "string"
			},
			{
				"internalType": "bytes32",
				"name": "dataHash",
				"type": "bytes32"
			}
		],
		"name": "checkCertificateValidity",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTotalCertificates",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]