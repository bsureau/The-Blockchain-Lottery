pragma solidity ^0.6.6;

import "./interfaces/GovernanceInterface.sol";
import "./interfaces/LotteryInterface.sol";
import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";

/**
* @title RandomNumberConsumer contract.
*/
contract RandomNumberConsumer is VRFConsumerBase {

    bytes32 internal keyHash;
    uint256 internal fee;
    uint256 public randomResult;
    GovernanceInterface public governance;

    /**
     * @notice Constructor inherits VRFConsumerBase. Need to be called by the same address used to create the Governance contract.
     *
     * @dev Network: Kovan (testnet).
     * @dev Chainlink VRF Coordinator address: 0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9
     * @dev LINK token address:                0xa36085F69e2889c224210F603D836748e7dC0088
     * @dev Key Hash: 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4
     */
    constructor(address _governance)
    VRFConsumerBase(
        0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9, // VRF Coordinator
        0xa36085F69e2889c224210F603D836748e7dC0088  // LINK Token
    )
    public
    {
        governance = GovernanceInterface(_governance);
        require(msg.sender == governance.organizer(), "access_forbidden");
        keyHash = 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4;
        fee = 0.1 * 10 ** 18; // 0.1 LINK
    }

    /**
     * @notice Requests randomness from the seed provided by Lottery contract.
     * @param _userProvidedSeed The seed provided by Lottery contract.
     * @return requestId The requestId.
     */
    function getRandomNumber(uint256 _userProvidedSeed)
    external
    returns (bytes32 requestId)
    {
        require(msg.sender == governance.lottery(), "access_forbidden");
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        return requestRandomness(keyHash, fee, _userProvidedSeed);
    }

    /**
     * @notice Callback function used by VRF Coordinator.
     * @param _requestId.
     * @param _randomness The random number.
     */
    function fulfillRandomness(bytes32 _requestId, uint256 _randomness)
    internal
    override
    {
        randomResult = _randomness;
        LotteryInterface(governance.lottery()).fulfillRandomness(randomResult);
    }
}
