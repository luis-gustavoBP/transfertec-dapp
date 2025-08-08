import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI, SEPOLIA_RPC_URL } from '@/lib/constants';

export function getBrowserProvider(): ethers.BrowserProvider {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('Carteira não disponível');
  }
  return new ethers.BrowserProvider(window.ethereum);
}

export async function getSigner(): Promise<ethers.Signer> {
  const provider = getBrowserProvider();
  await provider.send('eth_requestAccounts', []);
  return provider.getSigner();
}

export async function getNftContract(signerOrProvider?: ethers.Signer | ethers.Provider) {
  const provider = signerOrProvider
    ? signerOrProvider
    : await getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
}

export function getNftContractReadOnly() {
  const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
}
