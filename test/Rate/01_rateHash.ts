import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { before } from "mocha";

describe("Rate Hash", async () => {
  let accounts: SignerWithAddress[];
  let sender: string;
  let address: string;
  let addressNotRegistered: string;
  let txHash: string;
  let drs: any;
  let contract: any;

  before(async () => {
    accounts = await ethers.getSigners();
    sender = accounts[0].address;
    address = accounts[6].address;
    addressNotRegistered = accounts[7].address;
    txHash =
      "0x0d2c4fb86f67d31af9b467e8562c51f86a6ea0e20fdded0d175d48da1c5117d4";
    drs = await (await ethers.getContractFactory("DRS")).deploy();
    contract = await (
      await ethers.getContractFactory("RateHash")
    ).deploy(drs.address);
  });

  it("User should be registered and recorded in the DRS contract", async () => {
    const registerTx = contract.registerNew(address);
    await expect(registerTx).to.emit(drs, "NewRegistration").withArgs(address);
    expect(await drs.registered(address)).to.equal(true);
  });

  it("User can rate and the rating is recorded", async () => {
    await contract.registerNew(sender);
    const rateTx = contract.rate(address, txHash, 50);
    await expect(rateTx)
      .to.emit(contract, "NewRating")
      .withArgs(sender, address, txHash, 50);
    expect(await contract.hashRated(sender, txHash)).to.equal(true);
    expect((await contract.rating(address)).score).to.equal(50);
  });

  it("User can't rate if the rated user is not registered", async () => {
    const rateTx = contract.rate(addressNotRegistered, txHash, 50);
    await expect(rateTx).to.be.revertedWithCustomError(
      contract,
      "UserNotRegistered"
    );
  });

  it("User can't rate if the sender is not registered", async () => {
    const rateTx = contract
      .connect(accounts[3])
      .rate(addressNotRegistered, txHash, 50);
    await expect(rateTx).to.be.revertedWithCustomError(
      contract,
      "UserNotRegistered"
    );
  });

  it("User can't rate itself", async () => {
    const rateTx = contract.rate(sender, txHash, 50);
    await expect(rateTx).to.be.revertedWithCustomError(
      contract,
      "NotAllowedToRateYourself"
    );
  });

  it("User can't rate above 100", async () => {
    const rateTx = contract.rate(address, txHash, 120);
    await expect(rateTx).to.be.revertedWithCustomError(
      contract,
      "RateOutOfRange"
    );
  });

  it("User can't rate a tx hash that has already rated", async () => {
    const rateTx = contract.rate(address, txHash, 50);
    const rateFailTx = contract.rate(address, txHash, 50);
    await expect(rateFailTx).to.be.revertedWithCustomError(
      contract,
      "TxHashAlreadyRated"
    );
  });
});
