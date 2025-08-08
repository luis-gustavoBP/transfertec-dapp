import { ethers } from "hardhat";

async function main() {
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  
  if (!contractAddress) {
    console.log("❌ NEXT_PUBLIC_CONTRACT_ADDRESS não definido");
    return;
  }

  console.log("🔍 Verificando contrato:", contractAddress);

  try {
    // Conectar ao contrato
    const Contract = await ethers.getContractFactory("TransfertecNFT");
    const contract = Contract.attach(contractAddress);

    // Verificar se o contrato existe
    const code = await ethers.provider.getCode(contractAddress);
    if (code === "0x") {
      console.log("❌ Contrato não encontrado neste endereço");
      return;
    }

    console.log("✅ Contrato encontrado");

    // Verificar owner
    const owner = await contract.owner();
    console.log("👑 Owner do contrato:", owner);

    // Verificar pesquisadores
    const researchers = await contract.getResearchers();
    console.log("🔬 Pesquisadores:", researchers);

    // Verificar empresas
    const companies = await contract.getCompanies();
    console.log("🏢 Empresas:", companies);

    // Verificar se algumas funções básicas funcionam
    try {
      const name = await contract.name();
      const symbol = await contract.symbol();
      console.log("📝 Nome:", name);
      console.log("🏷️ Símbolo:", symbol);
    } catch (e) {
      console.log("⚠️ Erro ao ler nome/símbolo:", e);
    }

  } catch (error) {
    console.error("❌ Erro ao verificar contrato:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
