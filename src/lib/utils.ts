import { ethers } from 'ethers';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina classes CSS usando clsx e tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formata endereço Ethereum para exibição
 */
export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Formata valor em ETH
 */
export function formatEther(value: string | number): string {
  try {
    return parseFloat(ethers.formatEther(value.toString())).toFixed(4);
  } catch {
    return '0.0000';
  }
}

/**
 * Converte ETH para Wei
 */
export function parseEther(value: string): bigint {
  try {
    return ethers.parseEther(value);
  } catch {
    return BigInt(0);
  }
}

/**
 * Formata timestamp para data legível
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Formata porcentagem
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

/**
 * Trunca texto longo
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Valida endereço Ethereum
 */
export function isValidAddress(address: string): boolean {
  try {
    return ethers.isAddress(address);
  } catch {
    return false;
  }
}

/**
 * Calcula royalty em ETH
 */
export function calculateRoyalty(price: string, royaltyRate: number): string {
  try {
    const priceInWei = parseEther(price);
    const royaltyInWei = (priceInWei * BigInt(royaltyRate)) / BigInt(100);
    return ethers.formatEther(royaltyInWei);
  } catch {
    return '0';
  }
}

/**
 * Gera hash simples para identificação
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Sleep para delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Valida e sanitiza input de preço
 */
export function sanitizePrice(price: string): string {
  const cleanPrice = price.replace(/[^\d.]/g, '');
  const parts = cleanPrice.split('.');
  if (parts.length > 2) {
    return parts[0] + '.' + parts.slice(1).join('');
  }
  return cleanPrice;
}

/**
 * Formata número com separadores de milhares
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('pt-BR').format(num);
}

/**
 * Obtém o nome da carteira MetaMask
 */
export async function getWalletName(address: string): Promise<string> {
  if (typeof window === 'undefined' || !window.ethereum) {
    return formatAddress(address);
  }

  try {
    // Tentar obter o nome da conta do MetaMask
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts && accounts.length > 0) {
      // Se a carteira está conectada, tentar obter o nome
      const accountInfo = await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }]
      });
      
      // Se temos permissão, tentar obter o nome da conta
      if (accountInfo && accountInfo.length > 0) {
        // MetaMask não expõe diretamente o nome da conta via API
        // Vamos usar uma abordagem baseada no endereço
        return getWalletDisplayName(address);
      }
    }
  } catch (error) {
    console.log('Não foi possível obter nome da carteira:', error);
  }

  return getWalletDisplayName(address);
}

/**
 * Gera um nome de exibição para a carteira baseado no endereço
 */
export function getWalletDisplayName(address: string): string {
  if (!address) return 'Carteira Desconhecida';
  
  // Usar os últimos 4 caracteres para criar um nome
  const lastFour = address.slice(-4).toUpperCase();
  
  // Lista de nomes de carteiras comuns
  const walletNames = [
    'Carteira Principal',
    'Carteira de Trabalho', 
    'Carteira de Teste',
    'Carteira de Desenvolvimento',
    'Carteira Pessoal',
    'Carteira Empresarial',
    'Carteira de Pesquisa',
    'Carteira AUIN'
  ];
  
  // Usar o hash do endereço para escolher um nome
  const hash = address.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const nameIndex = Math.abs(hash) % walletNames.length;
  return `${walletNames[nameIndex]} (${lastFour})`;
}

/**
 * Obtém o nome da carteira de forma síncrona (para uso em componentes)
 */
export function getWalletNameSync(address: string): string {
  return getWalletDisplayName(address);
}