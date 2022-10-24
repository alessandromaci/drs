//SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

library Errors {
    error UserNotRegistered(address _account);
    error AlreadyRegistered();
    error NotAllowedToRateYourself();
    error TxHashAlreadyRated(bytes32 _txHash);
    error ENSAlreadyRated();
    error ENSDomainNotFound();
    error RateOutOfRange();
}
