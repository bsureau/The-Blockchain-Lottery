pragma solidity ^0.6.6;

/**
* @title RandomNumberConsumer interface.
*/
interface RandomNumberConsumerInterface {

    function getRandomNumber(uint256) external returns(bytes32);
}
