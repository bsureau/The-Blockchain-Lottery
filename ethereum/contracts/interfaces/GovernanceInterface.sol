pragma solidity ^0.6.6;

/**
* @title Governance interface.
*/
interface GovernanceInterface {

    function organizer() external view returns(address);
    function lottery() external view returns(address);
    function randomNumberConsumer() external view returns(address);
}
