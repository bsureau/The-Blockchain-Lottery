const Governance = artifacts.require("Governance");
const RandomNumberConsumer = artifacts.require("RandomNumberConsumer");
const Lottery = artifacts.require("Lottery");

module.exports = function (deployer, network, accounts) {

  var g, r, l;

  // Deploy Governance contract, then deploy RandomNumberConsumer, passing in Governance contracts's newly deployed address, and so on...
  deployer.deploy(Governance, {from: accounts[0]})
      .then(function(governanceContract) {
          g = governanceContract;
          return deployer.deploy(Lottery, g.address, {from: accounts[0]});
      })
      .then(function(lotteryContract) {
          l = lotteryContract;
          return deployer.deploy(RandomNumberConsumer, g.address, {from: accounts[0]});
      })
      .then(function(randomNumberConsumerContract) {
          r = randomNumberConsumerContract;
          return g.init(l.address, r.address, {from: accounts[0]});
      })
      .then(function() {
          console.log("   > [OK] contract deployed on Kovan testnet network (see https://kovan.etherscan.io)");
          console.log("   > Next, fund the following contracts with Chainlink Kovan Faucet (see https://kovan.chain.link/): ")
          console.log("   > Lottery contract: " + l.address)
          console.log("   > RandomNumberConsumer contract: " + r.address)
          console.log("   > /!\\ Do not forget to add the lottery contract address in your .env file. You can also set the ticket price and duration you want.")
          console.log("   > Then, fund the following wallet with Ethereum Kovan faucet (see https://faucet.kovan.network/): ");
          console.log("   > Wallet: " + accounts[0]);
          console.log("   > This wallet will serve to start the new lottery: ");
          console.log("   > To do that, finally run start_lottery.js script with truffle exec cmd.");
      });
}