'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { getTechnologyById } from '@/lib/mock';
import { STORAGE_EVENTS } from '@/lib/storage';
import { formatDate } from '@/lib/utils';
import { useWeb3 } from '@/contexts/Web3Context';
import { ethers } from 'ethers';
import { getNftContract, getSigner, getNftContractReadOnly } from '@/lib/contract';

export default function TechnologyDetailsPage() {
  const params = useParams<{ tokenId: string }>();
  const searchParams = useSearchParams();
  const action = searchParams.get('action');
  const [isLicensing, setIsLicensing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { state } = useWeb3();
  const [isOnchainRegistered, setIsOnchainRegistered] = useState<boolean | null>(null);
  const [checkingRegistration, setCheckingRegistration] = useState(false);

  const [technology, setTechnology] = useState(() => getTechnologyById(params.tokenId));

  useEffect(() => {
    const reload = () => setTechnology(getTechnologyById(params.tokenId));
    reload();
    if (typeof window !== 'undefined') {
      window.addEventListener(STORAGE_EVENTS.approvedUpdated, reload);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(STORAGE_EVENTS.approvedUpdated, reload);
      }
    };
  }, [params.tokenId]);

  useEffect(() => {
    const checkOnchain = async () => {
      if (!technology) {
        setIsOnchainRegistered(null);
        return;
      }
      try {
        setCheckingRegistration(true);
        const contract = getNftContractReadOnly();
        // getTechnology retorna struct: [tokenURI, priceWei, isExclusive, isRegistered, ...]
        const cfg: any = await (contract as any).getTechnology(BigInt(technology.tokenId));
        const reg = typeof cfg?.isRegistered === 'boolean' ? cfg.isRegistered : Boolean(cfg?.[3]);
        setIsOnchainRegistered(reg);
      } catch {
        setIsOnchainRegistered(false);
      } finally {
        setCheckingRegistration(false);
      }
    };
    checkOnchain();
  }, [technology]);

  useEffect(() => {
    if (action === 'license') setIsLicensing(true);
  }, [action]);

  if (!technology) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold">Tecnologia não encontrada</h1>
      </div>
    );
  }

  const handleConfirmLicense = async () => {
    if (!state.isConnected || !state.address) {
      setError('Conecte sua carteira para continuar.');
      return;
    }
    if (!isOnchainRegistered) {
      setError('Tecnologia ainda não registrada on-chain. Aguarde aprovação da AUIN.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      // Verificar saldo antes da transação
      const signer = await getSigner();
      const provider = signer.provider;
      if (!provider) {
        setError('Provider não disponível.');
        return;
      }
      const balance = await provider.getBalance(state.address);
      const priceWei = ethers.parseEther(technology.licensePrice);
      const estimatedGas = ethers.parseUnits('0.0002', 'ether'); // margem para chamada ao contrato
      
      if (balance < priceWei + estimatedGas) {
        setError('Saldo insuficiente para a transação (incluindo gas).');
        return;
      }

      // Chamar o contrato: licenseTechnology(technologyId) com value
      const contract = await getNftContract(signer);
      const tx = await contract.licenseTechnology(BigInt(technology.tokenId), { value: priceWei });
      await tx.wait();

      setIsLicensing(false);
      alert('Licença solicitada com sucesso! Token NFT emitido.');
    } catch (e: any) {
      setError(e?.message || 'Falha ao solicitar licença');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Button variant="outline" onClick={() => history.back()}>
          Voltar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
             <CardHeader>
              <div className="flex items-start justify-between">
                <h1 className="text-2xl font-bold text-gray-900">{technology.name}</h1>
                <StatusBadge status={technology.status} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-500 text-5xl">🔬</span>
              </div>

              <div className="space-y-3 text-gray-700">
                <p className="text-gray-700">{technology.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Preço da Licença</div>
                    <div className="font-medium">{technology.licensePrice} ETH</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Royalty</div>
                    <div className="font-medium">{technology.royaltyRate}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Tipo</div>
                    <div className="font-medium">{technology.isExclusive ? 'Exclusiva' : 'Não-exclusiva'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Expiração</div>
                    <div className="font-medium">{formatDate(technology.expirationDate)}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
             <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Licenciamento</h2>
            </CardHeader>
            <CardContent>
              {!state.isConnected ? (
                <p className="text-sm text-gray-600">Conecte sua carteira para solicitar uma licença.</p>
              ) : (
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    Endereço conectado: <span className="font-mono">{state.address}</span>
                  </div>
                  <Button
                    onClick={() => setIsLicensing(true)}
                    className="w-full"
                    disabled={checkingRegistration || !isOnchainRegistered}
                  >
                    Solicitar Licença ({technology.licensePrice} ETH)
                  </Button>
                  {checkingRegistration && (
                    <p className="text-xs text-gray-500">Verificando registro on-chain...</p>
                  )}
                  {isOnchainRegistered === false && (
                    <p className="text-xs text-yellow-700">Aguardando aprovação/registro da AUIN para esta tecnologia.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {isLicensing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmar Licenciamento</h3>
            {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
            <p className="text-sm text-gray-600 mb-6">
              Você está prestes a solicitar a licença da tecnologia "{technology.name}" por {technology.licensePrice} ETH.
            </p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsLicensing(false)} disabled={isSubmitting}>Cancelar</Button>
                <Button onClick={handleConfirmLicense} isLoading={isSubmitting} disabled={isSubmitting || !isOnchainRegistered}>Confirmar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
