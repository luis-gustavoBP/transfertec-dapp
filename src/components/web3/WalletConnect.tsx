'use client';

import React, { useState } from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import Button from '@/components/ui/Button';
import { formatAddress, formatEther } from '@/lib/utils';
import { SEPOLIA_CHAIN_ID, ERROR_MESSAGES } from '@/lib/constants';

interface WalletConnectProps {
  className?: string;
}

export default function WalletConnect({ className }: WalletConnectProps) {
  const { state, connectWallet, disconnectWallet, switchToSepolia } = useWeb3();
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      setError(null);
      await connectWallet();
    } catch (err: any) {
      setError(err.message || 'Erro ao conectar carteira');
    }
  };

  const handleNetworkSwitch = async () => {
    try {
      setError(null);
      await switchToSepolia();
    } catch (err: any) {
      setError(err.message || 'Erro ao trocar rede');
    }
  };

  const isWrongNetwork = state.isConnected && state.chainId !== SEPOLIA_CHAIN_ID;

  if (!state.isConnected) {
    return (
      <div className={`glass-card rounded-2xl p-2 ${className}`}>
        <Button
          onClick={handleConnect}
          isLoading={state.isConnecting}
          className="min-w-[160px]"
        >
          {state.isConnecting ? 'Conectando...' : 'Conectar Carteira'}
        </Button>
        {error && (
          <p className="text-red-300 text-sm mt-2 max-w-[200px]">
            {error}
          </p>
        )}
      </div>
    );
  }

  if (isWrongNetwork) {
    return (
      <div className={`glass-card rounded-2xl p-2 ${className}`}>
        <Button
          onClick={handleNetworkSwitch}
          variant="accent"
          className="min-w-[160px]"
        >
          Trocar para Sepolia
        </Button>
        {error && (
          <p className="text-red-300 text-sm mt-2 max-w-[200px]">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-4 glass-card rounded-2xl p-2 ${className}`}>
      {/* Informações da carteira */}
      <div className="hidden md:flex flex-col items-end text-sm">
        <span className="font-medium text-gray-900">
          {formatAddress(state.address!)}
        </span>
        <span className="text-gray-600">
          {state.balance ? `${formatEther(state.balance)} ETH` : '0.0000 ETH'}
        </span>
      </div>

      {/* Indicador de usuário */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-primary-700 rounded-full flex items-center justify-center shadow-md">
          <span className="text-white text-xs font-bold">
            {state.user?.role === 'RESEARCHER' ? 'P' : 
             state.user?.role === 'AUIN' ? 'A' : 'E'}
          </span>
        </div>
        <div className="hidden lg:flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {state.user?.name || 'Usuário'}
          </span>
          <span className="text-xs text-gray-600">
            {state.user?.role === 'RESEARCHER' ? 'Pesquisador' :
             state.user?.role === 'AUIN' ? 'AUIN' : 'Empresa'}
          </span>
        </div>
      </div>

      {/* Botão de desconectar */}
      <Button
        onClick={disconnectWallet}
        variant="outline"
        size="sm"
      >
        Desconectar
      </Button>

      {error && (
        <p className="text-red-600 text-sm mt-2 max-w-[200px]">
          {error}
        </p>
      )}
    </div>
  );
}