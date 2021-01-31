import { ethers } from "ethers";
import LotteryException from "../exceptions/LotteryException";

function connect() {
    const abi = [
        {
            "inputs": [],
            "name": "lotteryState",
            "outputs": [
                {
                    "internalType": "enum Lottery.LOTTERY_STATE",
                    "name": "",
                    "type": "uint8"
                }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
        },
        {
            "inputs": [],
            "name": "duration",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getNbPlayers",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "nbOfPlayers",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "ticketPrice",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
        },
        {
            "inputs": [],
            "name": "hasParticipated",
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
            "name": "newEntry",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function",
            "payable": true
        },
        {
            "inputs": [],
            "name": "winner",
            "outputs": [
                {
                    "internalType": "address payable",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "winner",
                    "type": "address"
                }
            ],
            "name": "lotteryEnded",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "duration",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "ticketPrice",
                    "type": "uint256"
                }
            ],
            "name": "lotteryStarted",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "enum Lottery.LOTTERY_STATE",
                    "name": "lotteryState",
                    "type": "uint8"
                }
            ],
            "name": "lotteryStateChanged",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "nbOfPlayers",
                    "type": "uint256"
                }
            ],
            "name": "newEntryAdded",
            "type": "event"
        }
    ];

    const provider = new ethers.getDefaultProvider('kovan', {
        alchemy: process.env.REACT_APP_ALCHEMY_API_KEY,
        etherscan: process.env.REACT_APP_ETHERSCAN_API_KEY,
        infura: process.env.REACT_APP_INFURA_PROJECT_ID
    });

    const contractAddress = process.env.REACT_APP_LOTTERY_CONTRACT_ADDRESS;

    return new ethers.Contract(contractAddress, abi, provider);
}

export default class LotteryService {

    constructor() {
        this.contract = connect();
    }

    async getDuration() {
        return await this.contract.duration() * 1000;
    }

    printLotteryState(lotteryState) {
        switch(lotteryState) {
            case 0:
                lotteryState = "OPEN SOON";
                break;
            case 1:
                lotteryState = "OPEN";
                break;
            case 2:
                lotteryState = "PICKING A WINNER";
                break;
            case 3:
                lotteryState = "CLOSED";
                break;
            default:
                lotteryState = "...";
                break;
        }
        return lotteryState;
    }

    async getLotteryState() {
       const lotteryState = await this.contract.lotteryState();
       return this.printLotteryState(lotteryState);
    }

    async getNbPlayers() {
        const nbPlayers = await this.contract.getNbPlayers();
        return nbPlayers.toString();
    }

    async getTicketPrice() {
        return ethers.utils.formatEther(await this.contract.ticketPrice());
    }

    async newEntry(ticketPrice) {
        // we can wrap it up in the ethers.js Web3Provider, which wraps a
        // Web3 Provider and exposes the ethers.js Provider API.
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        // There is only ever up to one account in MetaMask exposed
        const signer = provider.getSigner();

        const contractWithSigner = this.contract.connect(signer);

        const hasParticipated = await contractWithSigner.hasParticipated();
        if (hasParticipated === true)
            throw new LotteryException("already_in", "You already have participated to this lottery.")

        const overrides = {
            // To convert Ether to Wei:
            gasLimit: 12000000,
            // We must pass in the amount as wei (1 ether = 1e18 wei), so we
            // use this convenience function to convert ether to wei.
            value: ethers.utils.parseEther(ticketPrice)

            // Or you can use Wei directly if you have that:
            // value: someBigNumber
            // value: 1234   // Note that using JavaScript numbers requires they are less than Number.MAX_SAFE_INTEGER
            // value: "1234567890"
            // value: "0x1234"

            // Or, promises are also supported:
            // value: provider.getBalance(addr)
        };
        const tx = await contractWithSigner.newEntry(overrides);
        return tx.hash;
    }

    async getWinner() {
        return await this.contract.winner();
    }
}