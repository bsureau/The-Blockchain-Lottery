pragma solidity ^0.6.6;

/**
* @title Governance contract.
* @notice Connect RandomNumberConsumer contract with Lottery contract.
* @dev Deploy this contract first.
* @dev Deploy Lottery and RandomNumberConsumer with Governance contract address as a parameter.
* @dev Then call init function with Lottery and RandomNumberConsumer contract addresses as a parameter.
* @dev Lottery and RandomNumberConsumer will need to be fund with some LINK tokens in order to make the requests to the Chainlink network.
*/
contract Governance {

    bool initialized;
    address public organizer;
    address public lottery;
    address public randomNumberConsumer;

    /**
    * @notice Constructor.
    */
    constructor()
    public
    {
        organizer = msg.sender;
    }

    /**
    * @notice Init function. Only called once.
    * @param _lottery The address of Lottery contract.
    * @param _randomNumberConsumer The address of RandomNumberConsumer contract.
    */
    function init(address _lottery, address _randomNumberConsumer)
    public
    {
        require(msg.sender == organizer, "access_forbidden");
        require(initialized == false, "already_initialized");
        initialized = true;
        lottery = _lottery;
        randomNumberConsumer = _randomNumberConsumer;
    }
}
