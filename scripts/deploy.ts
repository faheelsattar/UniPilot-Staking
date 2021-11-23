import { Contract, ContractFactory } from "@ethersproject/contracts";
import { MaxUint256 } from "@ethersproject/constants";
// We require the Hardhat Runtime Environment explicitly here. This is optional but useful for running the
// script in a standalone fashion through `node <script>`. When running the script with `hardhat run <script>`,
// you'll find the Hardhat Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import StakeableArtifact from "../artifacts/contracts/Stakeable.sol/Stakeable.json";
import PilotArtifact from "./PIlot.json";

import { Bytes, formatUnits, parseUnits, AbiCoder } from "ethers/lib/utils";
import { BigNumber, BigNumberish } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
dotenvConfig({ path: resolve(__dirname, "../.env") });
import { Wallet } from "ethers";
import "@nomiclabs/hardhat-ethers";
// We require the Hardhat Runtime Environment explicitly here. This is optional but useful for running the
// script in a standalone fashion through `node <script>`. When running the script with `hardhat run <script>`,
// you'll find the Hardhat Runtime Environment's members available in the global scope.

const web3 = new Web3("https://rinkeby.infura.io/v3/98d49364a6d6475e842e7a63341ca0bf");
const contractStakeable = new web3.eth.Contract(
  StakeableArtifact.abi as AbiItem[],
  "0xBA16795882959B20A4B5a112E5a06735ED867077",
);

let wallet: Wallet;
let wallet2: Wallet;
let privateKey: any = process.env.PRIVATE_KEY;
let privateKey2: any = process.env.PRIVATE_KEY_2;
async function updateStateVariables(): Promise<void> {
  let provider = ethers.getDefaultProvider(
    `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
  );
  const _wallet = new ethers.Wallet(privateKey, provider);
  wallet = _wallet;
  console.log("wallet", wallet.address);
}

async function updateStateVariables2(): Promise<void> {
  let provider = ethers.getDefaultProvider(
    `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
  );
  const _wallet = new ethers.Wallet(privateKey2, provider);
  wallet2 = _wallet;
  console.log("wallet", wallet2.address);
}
// We recommend this pattern to be able to use async/await everywhere and properly handle errors.

const deployStakeable = async () => {
  const StakeableFactory = new ContractFactory(
    StakeableArtifact.abi,
    StakeableArtifact.bytecode,
    wallet,
  );
  const Stakeable = await StakeableFactory.deploy(
    "0x39491EE11ECAe251e9649Af6635bc23F13BEfE63",
  );
  console.log(
    "Stakeable deployed to:",
    Stakeable.address,
    "from account,",
    wallet.address,
  );
};

async function getPILOTApproval(
  tokenAddress: string,
  spenderAddress: string,
  tokenAmount: string,
): Promise<void> {
  const tokenContract = new ContractFactory(
    PilotArtifact.abi,
    PilotArtifact.bytecode,
    wallet2,
  );
  const tokenContractInstance = tokenContract.attach(tokenAddress);
  const approval = await tokenContractInstance.approve(spenderAddress, tokenAmount, {
    gasLimit: "10000000",
    gasPrice: "1500226581",
  });
  console.log("getERC20Approval -> ", approval.hash);
}

// const deployStakeAble = async () => {
//   const Stakeable = await ethers.getContractFactory("Stakeable");
//   const stakeable = await Stakeable.deploy(
//     "0x39491EE11ECAe251e9649Af6635bc23F13BEfE63",
//     "0x9bAD0667A3C5B7B06dc635c91C41dF79c938A98a",
//   );
//   console.log("Stakeable deployed to:", stakeable.address);
// };

const stakePilot = async (
  contractAddress: string,
  amount: string,
  tokenAddress: string,
) => {
  const tokenContract = new ContractFactory(
    StakeableArtifact.abi,
    StakeableArtifact.bytecode,
    wallet2,
  );
  const tokenContractInstance = tokenContract.attach(contractAddress);
  try {
    const stake = await tokenContractInstance.stake(amount, tokenAddress, {
      gasLimit: "10000000",
      gasPrice: "1500226581",
    });
    console.log("staked pilot -> ", stake.hash);
  } catch (err) {
    console.log(err);
  }
};

const unStakePilot = async (
  contractAddress: string,
  share: string,
  tokenAddress: string,
) => {
  const tokenContract = new ContractFactory(
    StakeableArtifact.abi,
    StakeableArtifact.bytecode,
    wallet2,
  );
  const tokenContractInstance = tokenContract.attach(contractAddress);
  try {
    const stake = await tokenContractInstance.unStake(share, tokenAddress, {
      gasLimit: "10000000",
      gasPrice: "1500226581",
    });
    console.log("staked pilot -> ", stake.hash);
  } catch (err) {
    console.log(err);
  }
};

const checkStakedValue = async (contractAddress: string) => {
  const tokenContract = new ContractFactory(
    StakeableArtifact.abi,
    StakeableArtifact.bytecode,
    wallet2,
  );
  const tokenContractInstance = tokenContract.attach(contractAddress);
  try {
    const stakedPilot = await tokenContractInstance.stakedPilot(wallet2.address);
    const stakedXPilot = await tokenContractInstance.stakedXPilot(wallet2.address);
    console.log("staked pilot value -> ", stakedPilot);
    console.log("staked x pilot value -> ", stakedXPilot);
  } catch (err) {
    console.log(err);
  }
};

const checkXPilotTotalSupply = async (contractAddress: string) => {
  const tokenContract = new ContractFactory(
    StakeableArtifact.abi,
    StakeableArtifact.bytecode,
    wallet2,
  );
  const tokenContractInstance = tokenContract.attach(contractAddress);
  try {
    const totalXPilot = await tokenContractInstance.totalSupply();
    console.log("totalSupply of xpilot-> ", totalXPilot._hex);
  } catch (err) {
    console.log(err);
  }
};

const checkPilotBalance = async (contractAddress: string, userAddress: string) => {
  const tokenContract = new ContractFactory(
    PilotArtifact.abi,
    PilotArtifact.bytecode,
    wallet2,
  );
  const tokenContractInstance = tokenContract.attach(contractAddress);
  try {
    const balanceOf = await tokenContractInstance.balanceOf(userAddress);
    console.log("Balance of user", balanceOf);
  } catch (err) {
    console.log(err);
  }
};

const main = async () => {
  // await updateStateVariables();
  await updateStateVariables2();
  // await deployStakeable();
  // await getPILOTApproval(
  //   "0x39491EE11ECAe251e9649Af6635bc23F13BEfE63",
  //   "0xBA16795882959B20A4B5a112E5a06735ED867077",
  //   "10000000000000000000",
  // );

  // await stakePilot(
  //   "0xBA16795882959B20A4B5a112E5a06735ED867077",
  //   "3000000000000000000",
  //   "0x39491EE11ECAe251e9649Af6635bc23F13BEfE63",
  // );
  // await checkStakedValue("0xBA16795882959B20A4B5a112E5a06735ED867077");
  // await checkXPilotTotalSupply("0x58eFa082Bf5533f3E8dB56e3eD1d6af3A7068e18");
  // await checkPilotBalance("0x39491EE11ECAe251e9649Af6635bc23F13BEfE63", "0x58eFa082Bf5533f3E8dB56e3eD1d6af3A7068e18");
  await unStakePilot(
    "0xBA16795882959B20A4B5a112E5a06735ED867077",
    "3000000000000000000",
    "0x39491EE11ECAe251e9649Af6635bc23F13BEfE63",
  );
  // await checkStakedValue("0xBA16795882959B20A4B5a112E5a06735ED867077");
};

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });

// TKN5 tokenIn > increase fees0
// TTCC99 tokenIn > increase fees1
