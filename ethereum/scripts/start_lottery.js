const { ethers } = require("ethers");

module.exports = async function(callback) {

    try {
        // Retrieve Lottery contract interface
        const fs = require('fs');
        const jsonContract = JSON.parse(fs.readFileSync('./build/contracts/Lottery.json', 'utf8'));

        // Connect to the Kovan testnet network
        const provider = ethers.getDefaultProvider('kovan');

        // Getting creator wallet
        const creatorWallet = new ethers.Wallet(process.env.CREATOR_PRIVATE_KEY, provider);

        // Lottery address contract
        const contractAddress = process.env.LOTTERY_CONTRACT_ADDRESS;

        // We connect to the Contract with signer
        const contractWithSigner = new ethers.Contract(contractAddress, JSON.stringify(jsonContract.abi), creatorWallet);

        // Calling startLottery Lottery contract method.
        console.log("Calling startLottery from " + creatorWallet.address + " on contract " + contractAddress);
        const tx = await contractWithSigner.startLottery(ethers.utils.parseEther(process.env.LOTTERY_TICKET_PRICE), process.env.LOTTERY_DURATION);
        console.log("[OK] hash: " + tx.hash);
    } catch (e) {
        console.log(e);
    }

    callback();
}