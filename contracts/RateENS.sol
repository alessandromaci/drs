// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./interface/IDRS.sol";
import "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import "@ensdomains/ens-contracts/contracts/registry/ReverseRegistrar.sol";
import {DataTypes} from "./lib/DataTypes.sol";
import {Errors} from "./lib/Errors.sol";

contract RateENS {
    // ========================================================
    // STORAGE
    // ========================================================

    address private drs;
    address private ens;

    uint8 constant MIN_UINT = 0;
    uint8 constant MAX_UINT = 100;
    bytes32 private constant ADDRESS_REVERSE_NODE =
        0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2;

    mapping(address => DataTypes.Record) public rating;
    mapping(address => mapping(address => bool)) public ensRated;

    // ========================================================
    // EVENTS
    // ========================================================

    event NewRating(address _from, address indexed _to, uint8 _score);

    // ========================================================
    // UTILS METHODS
    // ========================================================

    constructor(address _drs, address _ens) {
        drs = _drs;
        ens = _ens;
    }

    /// @notice calculate the updated rating average for user
    function setRating(
        uint16 _oldRating,
        uint16 _count,
        uint16 _score
    ) internal pure returns (uint8) {
        // (old value* number of ratings) + new rating / total rate +1
        uint16 newRating = ((_oldRating * _count) + _score) / (_count + 1);
        return uint8(newRating);
    }

    /// @notice inherithed by ENS
    function setNode(address addr) private pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(ADDRESS_REVERSE_NODE, sha3HexAddress(addr))
            );
    }

    /// @notice inherithed by ENS
    function sha3HexAddress(address addr) private pure returns (bytes32 ret) {
        assembly {
            for {
                let i := 40
            } gt(i, 0) {

            } {
                i := sub(i, 1)
                mstore8(i, byte(and(addr, 0xf), lookup))
                addr := div(addr, 0x10)
                i := sub(i, 1)
                mstore8(i, byte(and(addr, 0xf), lookup))
                addr := div(addr, 0x10)
            }

            ret := keccak256(0, 40)
        }
    }

    /// @notice check if the address has an ENS domain associated
    /// @notice this function only tells if a record was ever set with this address. A more robust check will be done via subgraph
    function hasENS(address _address) public view returns (bool) {
        bytes32 node = setNode(_address);
        return ENS(ens).recordExists(node);
    }

    // ========================================================
    // MAIN METHODS
    // ========================================================

    function registerNew(address _address) external {
        IDRS(drs).register(_address);
    }

    /// @notice assign a rating to another address with an ENS domain
    function rate(address _to, uint8 _score) external {
        if (!IDRS(drs).getRegistered(msg.sender)) {
            revert Errors.UserNotRegistered(msg.sender);
        } else if (!IDRS(drs).getRegistered(_to)) {
            revert Errors.UserNotRegistered(_to);
        }

        if (msg.sender == _to) {
            revert Errors.NotAllowedToRateYourself();
        }

        if (_score < MIN_UINT || _score > MAX_UINT) {
            revert Errors.RateOutOfRange();
        }

        // not possible to assign a rating to an address that doesn't have an ENS domain
        if (!hasENS(_to)) {
            revert Errors.ENSDomainNotFound();
        }

        if (ensRated[msg.sender][_to]) {
            revert Errors.ENSAlreadyRated();
        }

        ensRated[msg.sender][_to] = true;

        uint8 oldRating = rating[_to].score;
        uint16 count = rating[_to].count;
        uint8 newRating = setRating(oldRating, count, _score);

        DataTypes.Record memory record;

        record.count = count + 1;
        record.score = newRating;
        rating[_to] = record;

        emit NewRating(msg.sender, _to, _score);
    }
}
