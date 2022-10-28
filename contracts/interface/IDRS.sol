// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "../lib/DataTypes.sol";

interface IDRS {
    function register(address _address) external;

    function registered(address _address) external returns (bool);

    function hashRating(address _address)
        external
        returns (uint16 _count, uint8 _score);

    function hashRated(address _address, bytes32 _hash)
        external
        returns (bool _rated);

    function setHashRating(address _address, DataTypes.Record calldata record)
        external;

    function setHashRated(
        address _address,
        bytes32 _txHash,
        bool _bool
    ) external;
}
