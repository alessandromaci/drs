// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./interface/IDRS.sol";
import {Errors} from "./lib/Errors.sol";
import {DataTypes} from "./lib/DataTypes.sol";

contract RateHash {
    // ========================================================
    // STORAGE
    // ========================================================

    address public drs;
    uint8 constant MIN_UINT = 0;
    uint8 constant MAX_UINT = 100;

    // ========================================================
    // EVENTS
    // ========================================================

    event NewRating(
        address _from,
        address indexed _to,
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

    function registerNew(address _address) public {
        IDRS(drs).register(_address);
    }

    /// @notice assign a rating to another valid address
    function rate(
        address _to,
        bytes32 _txHash,
        uint8 _score
    ) external {
        if (!IDRS(drs).registered(msg.sender)) {
            revert Errors.UserNotRegistered(msg.sender);
        }

        if (!IDRS(drs).registered(_to)) {
            revert Errors.UserNotRegistered(_to);
        }

        if (msg.sender == _to) {
            revert Errors.NotAllowedToRateYourself();
        }

        if (_score < MIN_UINT || _score > MAX_UINT) {
            revert Errors.RateOutOfRange();
        }

        if (IDRS(drs).hashRated(msg.sender, _txHash)) {
            revert Errors.TxHashAlreadyRated(_txHash);
        }

        IDRS(drs).setHashRated(msg.sender, _txHash, true);

        (uint16 count, uint8 oldRating) = IDRS(drs).hashRating(_to);
        uint8 newRating = setRating(oldRating, count, _score);

        DataTypes.Record memory record;
        record.count = count + 1;
        record.score = newRating;
        IDRS(drs).setHashRating(_to, record);

        emit NewRating(msg.sender, _to, _txHash, _score);
    }
}
