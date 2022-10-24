// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./interface/IDRS.sol";
import {DataTypes} from "./lib/DataTypes.sol";
import {Errors} from "./lib/Errors.sol";

contract RateHash {
    // ========================================================
    // STORAGE
    // ========================================================

    address public drs;
    uint8 constant MIN_UINT = 0;
    uint8 constant MAX_UINT = 100;

    mapping(address => DataTypes.Record) public rating;
    mapping(address => mapping(bytes32 => bool)) hashRated;

    // ========================================================
    // EVENTS
    // ========================================================

    event NewRating(
        address indexed _to,
        address _from,
        bytes32 _txhash,
        uint8 _score
    );

    // ========================================================
    // UTILS METHODS
    // ========================================================

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

    constructor(address _address) {
        drs = _address;
    }

    // ========================================================
    // MAIN METHODS
    // ========================================================

    function registerNew(address _address) external {
        IDRS(drs).register(_address);
    }

    /// @notice assign a rating to another valid address
    function rate(
        address _to,
        bytes32 _txHash,
        uint8 _score
    ) external {
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

        if (hashRated[msg.sender][_txHash]) {
            revert Errors.TxHashAlreadyRated(_txHash);
        }

        hashRated[msg.sender][_txHash] = true;

        uint8 oldRating = rating[_to].score;
        uint16 count = rating[_to].count;
        uint8 newRating = setRating(oldRating, count, _score);

        DataTypes.Record memory record;

        record.count = count + 1;
        record.score = newRating;
        rating[_to] = record;

        emit NewRating(msg.sender, _to, _txHash, _score);
    }
}
