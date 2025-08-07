export interface Technology {
  tokenId: string;
  name: string;
  category: string;
  researchers: string[];
  royaltyRate: number;
  isExclusive: boolean;
  licensePrice: string; // em ETH
  expirationDate: number;
  ipfsHash: string;
  status: TechStatus;
  description?: string;
  images?: string[];
}

export enum TechStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED', 
  LICENSED = 'LICENSED',
  EXPIRED = 'EXPIRED'
}

export enum UserRole {
  RESEARCHER = 'RESEARCHER',
  AUIN = 'AUIN',
  COMPANY = 'COMPANY'
}

export interface User {
  address: string;
  role: UserRole;
  name?: string;
  institution?: string;
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  chainId: number | null;
  balance: string | null;
  user: User | null;
}

export interface ContractConfig {
  address: string;
  abi: any[];
  chainId: number;
}

export interface TransactionState {
  hash?: string;
  isLoading: boolean;
  error?: string;
  success?: boolean;
}

export interface TechnologyFormData {
  name: string;
  category: string;
  description: string;
  royaltyRate: number;
  isExclusive: boolean;
  licensePrice: string;
  expirationMonths: number;
  documentation: File[];
  images: File[];
}