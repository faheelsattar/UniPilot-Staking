import { ethers, waffle } from "hardhat";
import chai, { expect, use } from "chai";
import { Contract, BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { parseUnits } from "ethers/lib/utils";
import Stakeable from "../../artifacts/contracts/Stakeable.sol/Stakeable.json";
import { solidity } from "ethereum-waffle";

use(solidity);

describe("TESTING SKELETON", async () => {
  let stakeable: Contract;
  const [owner, alice, bob] = await ethers.getSigners();
  const pilotAmount: BigNumber = ethers.utils.parseEther("1");
  beforeEach(async () => {
    const StakeableContract = await ethers.getContractFactory("Stakeable");
    stakeable = await StakeableContract.deploy("0x39491EE11ECAe251e9649Af6635bc23F13BEfE63");
  });

  describe("Init", async () => {
    it("should initialize", async () => {
      console.log("shoul initialize", stakeable);
      expect(stakeable).to.be.ok;
    });
  });

  describe("Staking tests", async () => {
    it("balance of owner", async () => {
      const balance = await stakeable.balanceOf(owner.address);
      console.log("balance", balance);
      expect(balance).to.eq(ethers.utils.parseEther("1"));
    });

    it("total Supply", async () => {
      const totalSupply = await stakeable.totalSupply();
      console.log("total Supply", totalSupply);
      expect(totalSupply).to.eq(ethers.utils.parseEther("1").mul(3));
    });
  });
});
