import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { before } from "mocha";
require("dotenv").config();

describe("Rate ENS", async () => {
  let accounts: SignerWithAddress[];
  let sender: string;
  let address: string;
  let addressNotRegistered: string;
  let txHash: string;
  let drs: any;
  let ensContract: string;
  let contract: any;

  before(async () => {
    accounts = await ethers.getSigners();
    sender = accounts[0].address;
    address = accounts[6].address;
    addressNotRegistered = accounts[7].address;

    txHash =
      "0x0d2c4fb86f67d31af9b467e8562c51f86a6ea0e20fdded0d175d48da1c5117d4";
    drs = await (await ethers.getContractFactory("DRS")).deploy();
    ensContract = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"; //ENS Mainnet;

    contract = await (
      await ethers.getContractFactory("RateENS")
    ).deploy(drs.address, ensContract);
  });

  it("User should be registered and recorded in the DRS contract", async () => {
    const registerTx = contract.registerNew(address);
    await expect(registerTx).to.emit(drs, "NewRegistration").withArgs(address);
    expect(await drs.getRegistered(address)).to.equal(true);
  });

  it("User can rate and the rating is recorded", async () => {
    await contract.registerNew(sender);
    const receiver: string = "0x7bAc7a7f036e944Cc7fa04090FBb125253B63784";
    await contract.registerNew(receiver);

    const rateTx = await contract.rate(receiver, 50);
    await expect(rateTx)
      .to.emit(contract, "NewRating")
      .withArgs(sender, receiver, 50);
    expect(await contract.ensRated(sender, receiver)).to.equal(true);
    expect((await contract.rating(receiver)).score).to.equal(50);
  });

  it("User can't rate if the rated user is not registered", async () => {
    const rateTx = contract.rate(addressNotRegistered, 50);
    await expect(rateTx).to.be.revertedWithCustomError(
      contract,
      "UserNotRegistered"
    );
  });

  it("User can't rate if the sender is not registered", async () => {
    const rateTx = contract.connect(accounts[3]).rate(addressNotRegistered, 50);
    await expect(rateTx).to.be.revertedWithCustomError(
      contract,
      "UserNotRegistered"
    );
  });

  it("User can't rate itself", async () => {
    const rateTx = contract.rate(sender, 50);
    await expect(rateTx).to.be.revertedWithCustomError(
      contract,
      "NotAllowedToRateYourself"
    );
  });

  it("User can't rate above 100", async () => {
    const rateTx = contract.rate(address, 120);
    await expect(rateTx).to.be.revertedWithCustomError(
      contract,
      "RateOutOfRange"
    );
  });
});
