import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";
import * as dotenv from "dotenv";
import "ts-node/register";

dotenv.config();

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

const networks: HardhatUserConfig["networks"] = {
  hardhat: {},
};

if (ALCHEMY_API_KEY) {
  networks!.sepolia = {
    url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
  } as any;
}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },
  networks,
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "",
  },
  paths: {
    sources: "contracts",
    tests: "test",
    cache: "cache",
    artifacts: "artifacts",
  },
  mocha: {
    timeout: 40000,
  },
};

export default config;


