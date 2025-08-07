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