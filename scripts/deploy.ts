import { ethers } from "hardhat";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", await deployer.getAddress());

  const Contract = await ethers.getContractFactory("TransfertecNFT");
  const contract = await Contract.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("TransfertecNFT deployed to:", address);

  // Registrar tecnologias iniciais (ids 1..3)
  const price1 = ethers.parseEther("0.001");
  const price2 = ethers.parseEther("0.002");
  const price3 = ethers.parseEther("0.0015");
  await (await contract.registerTechnology(1, "ipfs://tech-1", price1, false)).wait();
  await (await contract.registerTechnology(2, "ipfs://tech-2", price2, true)).wait();
  await (await contract.registerTechnology(3, "ipfs://tech-3", price3, false)).wait();
  console.log("Technologies registered.");

  // Exportar artefatos para o frontend
  const artifactsDir = path.join(process.cwd(), "artifacts", "contracts", "TransfertecNFT.sol");
  const artifactPath = path.join(artifactsDir, "TransfertecNFT.json");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const artifact = require(artifactPath);

  const outDir = path.join(process.cwd(), "src", "contracts");
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  const abi = artifact.abi;
  const frontendAbiPath = path.join(outDir, "TransfertecNFT.abi.json");
  writeFileSync(frontendAbiPath, JSON.stringify(abi, null, 2));

  // Atualizar variáveis de ambiente para o frontend
  const envVar = `NEXT_PUBLIC_CONTRACT_ADDRESS=${address}\n`;
  const envHint = path.join(process.cwd(), ".env.local");
  try {
    // Append ou cria se não existir
    writeFileSync(envHint, envVar, { flag: "a" });
  } catch {
    writeFileSync(envHint, envVar);
  }

  console.log("ABI salva em:", frontendAbiPath);
  console.log("Defina NEXT_PUBLIC_CONTRACT_ADDRESS no .env.local (foi acrescentado)");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


