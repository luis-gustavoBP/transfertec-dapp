// Rede Sepolia (testnet)
export const SEPOLIA_CHAIN_ID = 11155111;
export const SEPOLIA_RPC_URL = process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL || 'https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY';

// Configurações do contrato (atualizar com endereços reais após deploy)
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

// Importar ABI do arquivo gerado pelo deploy
let CONTRACT_ABI: any[] = [];
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  CONTRACT_ABI = require('../contracts/TransfertecNFT.abi.json');
} catch {
  // Fallback se o arquivo não existir
  CONTRACT_ABI = [];
}

export { CONTRACT_ABI };

// Categorias de tecnologia
export const TECHNOLOGY_CATEGORIES = [
  { value: 'solar', label: 'Energia Solar' },
  { value: 'eolica', label: 'Energia Eólica' },
  { value: 'biomassa', label: 'Biomassa' },
  { value: 'hidraulica', label: 'Energia Hidráulica' },
  { value: 'biotecnologia', label: 'Biotecnologia' },
  { value: 'nanotecnologia', label: 'Nanotecnologia' },
  { value: 'agricultura', label: 'Agricultura Sustentável' },
  { value: 'materiais', label: 'Novos Materiais' },
  { value: 'software', label: 'Software/TI' },
  { value: 'outros', label: 'Outros' }
];

// Configurações de royalty
export const MIN_ROYALTY_RATE = 1; // 1%
export const MAX_ROYALTY_RATE = 25; // 25%

// Mensagens de erro comuns
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Carteira não conectada',
  WRONG_NETWORK: 'Troque para a rede Sepolia',
  TRANSACTION_REJECTED: 'Transação rejeitada pelo usuário',
  INSUFFICIENT_FUNDS: 'Saldo insuficiente para a transação',
  CONTRACT_ERROR: 'Erro na execução do contrato',
  METAMASK_NOT_INSTALLED: 'MetaMask não está instalado'
};

// URLs e links úteis
export const LINKS = {
  UNESP_WEBSITE: 'https://www2.unesp.br/',
  AUIN_WEBSITE: 'https://www2.unesp.br/auin/',
  ETHERSCAN_SEPOLIA: 'https://sepolia.etherscan.io',
  METAMASK_DOWNLOAD: 'https://metamask.io/download/'
};

// Configurações de UI
export const UI_CONFIG = {
  ITEMS_PER_PAGE: 12,
  DEBOUNCE_DELAY: 300, // ms para busca
  TOAST_DURATION: 5000, // ms
};