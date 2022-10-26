import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { before } from "mocha";

describe("Register", async () => {
  let accounts: SignerWithAddress[];
  let contract: any;
  before(async () => {
    accounts = await ethers.getSigners();
    contract = await (await ethers.getContractFactory("DRS")).deploy();
  });

  it("User should be registered and recorded", async () => {
    const address = accounts[6].address;
    const registerTx = contract.register(address);
    await expect(registerTx)
      .to.emit(contract, "NewRegistration")
      .withArgs(address);
    expect(await contract.registered(address)).to.equal(true);
  });
});
