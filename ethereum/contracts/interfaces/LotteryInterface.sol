pragma solidity ^0.6.6;

/**
* @title Lottery interface.
*/
interface LotteryInterface {

    function fulfillRandomness(uint256) external;
}
