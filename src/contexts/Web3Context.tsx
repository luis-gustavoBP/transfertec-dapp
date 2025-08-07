'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { ethers } from 'ethers';
import { WalletState, User, UserRole } from '@/types';
import { SEPOLIA_CHAIN_ID, ERROR_MESSAGES } from '@/lib/constants';

interface Web3ContextType {
  state: WalletState;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchToSepolia: () => Promise<void>;
  updateBalance: () => Promise<void>;
}

const initialState: WalletState = {
  address: null,
  isConnected: false,
  isConnecting: false,
  chainId: null,
  balance: null,
  user: null,
};

type Web3Action =
  | { type: 'SET_CONNECTING'; payload: boolean }
  | { type: 'SET_CONNECTED'; payload: { address: string; chainId: number; user: User } }
  | { type: 'SET_DISCONNECTED' }
  | { type: 'SET_BALANCE'; payload: string }
  | { type: 'SET_CHAIN_ID'; payload: number };

function web3Reducer(state: WalletState, action: Web3Action): WalletState {
  switch (action.type) {
    case 'SET_CONNECTING':
      return { ...state, isConnecting: action.payload };
    case 'SET_CONNECTED':
      return {
        ...state,
        address: action.payload.address,
        chainId: action.payload.chainId,
        user: action.payload.user,
        isConnected: true,
        isConnecting: false,
      };
    case 'SET_DISCONNECTED':
      return initialState;
    case 'SET_BALANCE':
      return { ...state, balance: action.payload };
    case 'SET_CHAIN_ID':
      return { ...state, chainId: action.payload };
    default:
      return state;
  }
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

interface Web3ProviderProps {
  children: ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const [state, dispatch] = useReducer(web3Reducer, initialState);

  // Função para determinar o papel do usuário (mock por enquanto)
  const getUserRole = (address: string): UserRole => {
    // Em uma implementação real, isso viria de um contrato ou API
    // Por enquanto, vamos simular baseado no endereço
    const lastChar = address.slice(-1).toLowerCase();
    if (['0', '1', '2'].includes(lastChar)) return UserRole.RESEARCHER;
    if (['3', '4', '5'].includes(lastChar)) return UserRole.AUIN;
    return UserRole.COMPANY;
  };

  const connectWallet = useCallback(async (): Promise<void> => {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error(ERROR_MESSAGES.METAMASK_NOT_INSTALLED);
    }

    try {
      dispatch({ type: 'SET_CONNECTING', payload: true });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length === 0) {
        throw new Error('Nenhuma conta encontrada');
      }

      const address = accounts[0];
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

      const user: User = {
        address,
        role: getUserRole(address),
        name: `Usuário ${address.slice(-4)}`, // Mock
      };

      dispatch({
        type: 'SET_CONNECTED',
        payload: { address, chainId, user },
      });

      // Atualizar saldo
      const balance = await provider.getBalance(address);
      dispatch({
        type: 'SET_BALANCE',
        payload: ethers.formatEther(balance),
      });

    } catch (error) {
      dispatch({ type: 'SET_CONNECTING', payload: false });
      console.error('Erro ao conectar carteira:', error);
      throw error;
    }
  }, []);

  const disconnectWallet = useCallback((): void => {
    dispatch({ type: 'SET_DISCONNECTED' });
  }, []);

  const switchToSepolia = async (): Promise<void> => {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error(ERROR_MESSAGES.METAMASK_NOT_INSTALLED);
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}` }],
      });
    } catch (error: any) {
      // Se a rede não existe, adicionar
      if (error.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}`,
              chainName: 'Sepolia Test Network',
              nativeCurrency: {
                name: 'Sepolia ETH',
                symbol: 'SEP',
                decimals: 18,
              },
              rpcUrls: ['https://rpc.sepolia.org'],
              blockExplorerUrls: ['https://sepolia.etherscan.io/'],
            },
          ],
        });
      } else {
        throw error;
      }
    }
  };

  const updateBalance = async (): Promise<void> => {
    if (!state.address || typeof window === 'undefined' || !window.ethereum) {
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(state.address);
      dispatch({
        type: 'SET_BALANCE',
        payload: ethers.formatEther(balance),
      });
    } catch (error) {
      console.error('Erro ao atualizar saldo:', error);
    }
  };

  // Listeners para eventos do MetaMask
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) {
      return;
    }

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== state.address) {
        // Reconectar com nova conta
        connectWallet().catch(console.error);
      }
    };

    const handleChainChanged = (chainId: string | number) => {
      dispatch({
        type: 'SET_CHAIN_ID',
        payload: typeof chainId === 'string' ? parseInt(chainId, 16) : chainId,
      });
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged as any);

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged as any);
      }
    };
  }, [state.address, connectWallet, disconnectWallet]);

  // Auto-connect se já estava conectado
  useEffect(() => {
    const autoConnect = async () => {
      if (typeof window === 'undefined' || !window.ethereum) {
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        
        if (accounts.length > 0) {
          await connectWallet();
        }
      } catch (error) {
        console.error('Erro no auto-connect:', error);
      }
    };

    autoConnect();
  }, [connectWallet]);

  const value: Web3ContextType = {
    state,
    connectWallet,
    disconnectWallet,
    switchToSepolia,
    updateBalance,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

export function useWeb3(): Web3ContextType {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 deve ser usado dentro de um Web3Provider');
  }
  return context;
}