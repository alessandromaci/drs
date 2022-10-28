// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {Errors} from "./lib/Errors.sol";
import {DataTypes} from "./lib/DataTypes.sol";
import "./interface/IDRS.sol";
import "./RateENS.sol";
import "./RateHash.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract DRS is IDRS, AccessControl {
    // ========================================================
    // STORAGE
    // ========================================================

    mapping(address => bool) public registered;
    mapping(address => DataTypes.Record) public hashRating;
    mapping(address => mapping(bytes32 => bool)) public hashRated;

    address public ensContract;
    address public hashContract;

    bytes32 internal constant CHILD_CONTRACT = keccak256("CHILD_CONTRACT");

    // ========================================================
    // EVENTS
    // ========================================================

    event NewRegistration(address indexed _address);

    // ========================================================
    // UTILS METHODS
    // ========================================================

    function grantRole(address _address) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(CHILD_CONTRACT, _address);
    }

    function setHashRating(address _address, DataTypes.Record calldata record)
        external
        onlyRole(CHILD_CONTRACT)
    {
        hashRating[_address] = record;
    }

    function setHashRated(
        address _address,
        bytes32 _txHash,
        bool _bool
    ) external onlyRole(CHILD_CONTRACT) {
        hashRated[_address][_txHash] = _bool;
    }

    // ========================================================
    // MAIN METHODS
    // ========================================================

    constructor() {
        RateENS ens = new RateENS(address(this));
        RateHash hash = new RateHash(address(this));
        _grantRole(CHILD_CONTRACT, address(ens));
        _grantRole(CHILD_CONTRACT, address(hash));

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);

        // just for testing
        ensContract = address(ens);
        hashContract = address(hash);
    }

    /// @notice assign a DRS domain to the address
    function register(address _address) external onlyRole(CHILD_CONTRACT) {
        if (registered[_address]) {
            revert Errors.AlreadyRegistered();
        }

        registered[_address] = true;

        emit NewRegistration(_address);
    }
}
