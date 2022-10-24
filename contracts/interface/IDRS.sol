// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

interface IDRS {
    function register(address _address) external;

    function getRegistered(address _address)
        external
        returns (bool _registered);
}
