// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {Errors} from "./lib/Errors.sol";

contract DRS {
    // ========================================================
    // STORAGE
    // ========================================================

    mapping(address => bool) public registered;
    uint public count;

    // ========================================================
    // EVENTS
    // ========================================================

    event NewRegistration(address indexed _address);

    // ========================================================
    // MAIN METHODS
    // ========================================================

    function getRegistered(address _address) external view returns (bool) {
        return (registered[_address]);
    }

    /// @notice assign a DRS domain to the address
    function register(address _address) external {
        if (registered[_address]) {
            revert Errors.AlreadyRegistered();
        }

        registered[_address] = true;

        emit NewRegistration(_address);
    }
}
