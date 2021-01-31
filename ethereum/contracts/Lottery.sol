pragma solidity ^0.6.6;

import "./interfaces/GovernanceInterface.sol";
import "./interfaces/RandomNumberConsumerInterface.sol";
import "@chainlink/contracts/src/v0.6/ChainlinkClient.sol";

/**
* @title Lottery contract.
*/
contract Lottery is ChainlinkClient {

    enum LOTTERY_STATE {DEPLOYED, OPEN, PICKING_WINNER, CLOSED}
    LOTTERY_STATE public lotteryState;
    uint256 public ticketPrice;
    uint256 public duration;
    mapping(address => bool) private entries;
    address payable[] private players;
    address payable public winner;
    GovernanceInterface public governance;

    event newEntryAdded(uint256 nbOfPlayers);
    event lotteryStarted(uint256 duration, uint256 ticketPrice);
    event lotteryStateChanged(LOTTERY_STATE lotteryState);
    event lotteryEnded(address winner);

    /**
    * @notice Constructor. Need to be called by the same address used to create the Governance contract.
    * @param _governance The address of governance contract used to interact with RandomNumberConsumer contract.
    */
    constructor(address _governance)
    public
    {
        governance = GovernanceInterface(_governance);
        require(msg.sender == governance.organizer(), "access_forbidden");
        lotteryState = LOTTERY_STATE.DEPLOYED;
    }

    /**
    * @notice Start a new lottery. Need to be called by the same address used to create the Governance contract.
    * @param _ticketPrice The ticket price to be paid in order to participate to the lottery.
    * @param _duration Time at which the alarm will be triggered (in seconds).
    */
    function startLottery(uint256 _ticketPrice, uint256 _duration)
    public
    {
        require(msg.sender == governance.organizer(), "access_forbidden");
        require(lotteryState == LOTTERY_STATE.DEPLOYED, "invalid_lottery_state");
        require(_ticketPrice >= 0.01 * 10 ** 18, "invalid_minimum_ticket_price");
        ticketPrice = _ticketPrice;

        setPublicChainlinkToken();
        /**
        * Network: Kovan (testnet)
        * LINK token address: 0xa36085F69e2889c224210F603D836748e7dC0088
        * Oracle address: 0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e
        * JobID: a7ab70d561d34eb49e9b1612fd2e044b
        */
        Chainlink.Request memory req = buildChainlinkRequest('a7ab70d561d34eb49e9b1612fd2e044b', address(this), this.fulfillAlarm.selector);
        duration = block.timestamp + _duration;
        req.addUint("until", duration);
        sendChainlinkRequestTo(0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e, req, 0.1 * 10 ** 18);

        lotteryState = LOTTERY_STATE.OPEN;
        emit lotteryStarted(duration, ticketPrice);
    }

    /**
    * @notice Callback method called on alarm clock.
    * @param _requestId Used by recordChainlinkFulfillment modifier to make sure the method is not called by a malicious contract.
    */
    function fulfillAlarm(bytes32 _requestId)
    external
    recordChainlinkFulfillment(_requestId)
    {
        require(lotteryState == LOTTERY_STATE.OPEN, "invalid_lottery_state");
        lotteryState = LOTTERY_STATE.PICKING_WINNER;
        emit lotteryStateChanged(lotteryState);
        pickWinner();
    }

    /**
    * @notice Call RadomNumberConsumer contract to initiate a request for VRF output given the seed block.timestamp
    */
    function pickWinner()
    private
    {
        require(lotteryState == LOTTERY_STATE.PICKING_WINNER, "invalid_lottery_state");
        RandomNumberConsumerInterface(governance.randomNumberConsumer()).getRandomNumber(block.timestamp);
    }

    /**
    * @notice Called by RandomNumberConsumer contract. Select a winner and transfer the lottery prize to its address.
    * @param _randomResult The random result.
    */
    function fulfillRandomness(uint256 _randomResult)
    external
    {
        require(msg.sender == governance.randomNumberConsumer(), "access_forbidden");
        require(lotteryState == LOTTERY_STATE.PICKING_WINNER, "invalid_lottery_state");
        require(_randomResult > 0, "random_not_found");

        if (players.length > 0) {
            uint256 index = _randomResult % players.length;
            winner = players[index];
        } else {
            winner = payable(governance.organizer());
        }

        if (address(this).balance > 0) {
            winner.transfer(address(this).balance);
        }

        lotteryState = LOTTERY_STATE.CLOSED;
        emit lotteryEnded(winner);
    }

    /**
    * @notice Check if msg sender already has participated to the lottery.
    * @return bool True if the sender already has participated, false otherwise.
    */
    function hasParticipated()
    public
    view
    returns (bool) {
        return entries[msg.sender] == true;
    }

    /**
    * @notice Add a new entry.
    */
    function newEntry()
    public
    payable
    {
        require(entries[msg.sender] == false, "already_in");
        require(lotteryState == LOTTERY_STATE.OPEN, "invalid_lottery_state");
        require(msg.value == ticketPrice, "invalid_ticket_price");
        entries[msg.sender] = true;
        players.push(msg.sender);
        emit newEntryAdded(players.length);
    }

    /**
    * @notice Get number of players.
    * @return uint The number of players.
    */
    function getNbPlayers()
    public
    view
    returns (uint) {
        return players.length;
    }
}