// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

interface IDRS {
    function register(address _address) external;

    function registered(address _address) external returns (bool _registered);
}
