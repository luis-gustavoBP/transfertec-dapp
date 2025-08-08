'use client';

import React, { useState } from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { Technology, TechStatus, UserRole } from '@/types';
import { formatDate } from '@/lib/utils';
import { getNftContract } from '@/lib/contract';
import { ethers } from 'ethers';

// Dados mockados para demonstração
const mockUserTechnologies: Technology[] = [
  {
    tokenId: '4',
    name: 'Célula Solar de Perovskita',
    category: 'solar',
    researchers: ['0x1234...5678'],
    royaltyRate: 7,
    isExclusive: false,
    licensePrice: '0.001',
    expirationDate: Date.now() / 1000 + 31536000,
    ipfsHash: 'QmAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAa',
    status: TechStatus.PENDING,
    description: 'Tecnologia revolucionária de células solares usando perovskita...',
  },
  {
    tokenId: '5',
    name: 'Sistema de Purificação de Água',
    category: 'outros',
    researchers: ['0x1234...5678'],
    royaltyRate: 6,
    isExclusive: true,
    licensePrice: '0.002',
    expirationDate: Date.now() / 1000 + 31536000,
    ipfsHash: 'QmBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBb',
    status: TechStatus.APPROVED,
    description: 'Sistema sustentável para purificação de água usando energia solar...',
  },
];

export default function ResearcherPage() {
  const { state } = useWeb3();
  const [activeTab, setActiveTab] = useState<'technologies' | 'register' | 'earnings'>('technologies');

  // Form state para registro
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [priceEth, setPriceEth] = useState('0.001');
  const [royaltyRate, setRoyaltyRate] = useState(5);
  const [exclusive, setExclusive] = useState(false);
  const [registerMsg, setRegisterMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not researcher
  if (state.isConnected && state.user?.role !== UserRole.RESEARCHER) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Acesso Restrito
            </h2>
            <p className="text-gray-600">
              Esta área é exclusiva para pesquisadores da UNESP.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tabs = [
    { id: 'technologies', label: 'Minhas Tecnologias', icon: '🔬' },
    { id: 'register', label: 'Registrar Nova', icon: '➕' },
    { id: 'earnings', label: 'Receitas', icon: '💰' },
  ];

  const handleSubmitTechnology = async () => {
    setRegisterMsg(null);
    setIsSubmitting(true);
    try {
      // Gerar metadados mock (em produção: enviar para IPFS e obter tokenURI)
      const tokenId = Math.floor(Math.random() * 1e6).toString();
      const tokenURI = `ipfs://${name.toLowerCase().replace(/\s+/g, '-')}-${tokenId}`;

      // Se for owner, registrar diretamente no contrato
      const contract = await getNftContract();
      const owner = await contract.owner();
      const isOwner = state.address?.toLowerCase() === owner.toLowerCase();

      if (isOwner) {
        const priceWei = ethers.parseEther(priceEth);
        const tx = await contract.registerTechnology(BigInt(tokenId), tokenURI, priceWei, exclusive);
        await tx.wait();
        setRegisterMsg('Tecnologia registrada no contrato (owner).');
      } else {
        // Simular submissão para aprovação da AUIN
        setRegisterMsg('Submissão enviada para AUIN (aguardando aprovação).');
      }

      // Reset simples
      setName('');
      setCategory('');
      setDescription('');
      setPriceEth('0.001');
      setRoyaltyRate(5);
      setExclusive(false);

    } catch (e: any) {
      setRegisterMsg(e?.message || 'Falha ao registrar');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTechnologiesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Tecnologias Registradas
        </h2>
        <Button onClick={() => setActiveTab('register')}>
          Nova Tecnologia
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockUserTechnologies.map((tech) => (
          <Card key={tech.tokenId} className="h-full">
            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex-1">
                  {tech.name}
                </h3>
                <StatusBadge status={tech.status} />
              </div>
              <p className="text-gray-600 text-sm">
                {tech.description}
              </p>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Token ID:</span>
                  <div className="font-medium">#{tech.tokenId}</div>
                </div>
                <div>
                  <span className="text-gray-500">Categoria:</span>
                  <div className="font-medium capitalize">{tech.category}</div>
                </div>
                <div>
                  <span className="text-gray-500">Preço:</span>
                  <div className="font-medium">{tech.licensePrice} ETH</div>
                </div>
                <div>
                  <span className="text-gray-500">Royalty:</span>
                  <div className="font-medium">{tech.royaltyRate}%</div>
                </div>
                <div>
                  <span className="text-gray-500">Tipo:</span>
                  <div className="font-medium">
                    {tech.isExclusive ? 'Exclusiva' : 'Não-exclusiva'}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Expira em:</span>
                  <div className="font-medium">{formatDate(tech.expirationDate)}</div>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <div className="flex gap-2 w-full">
                <Button variant="outline" size="sm" className="flex-1">
                  Editar
                </Button>
                <Button size="sm" className="flex-1">
                  Ver Detalhes
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {mockUserTechnologies.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma tecnologia registrada
          </h3>
          <p className="text-gray-600 mb-4">
            Comece registrando sua primeira tecnologia
          </p>
          <Button onClick={() => setActiveTab('register')}>
            Registrar Tecnologia
          </Button>
        </div>
      )}
    </div>
  );

  const renderRegisterTab = () => (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Registrar Nova Tecnologia
      </h2>

      <Card>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Tecnologia
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Ex: Sistema Fotovoltaico Avançado"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Selecione uma categoria</option>
              <option value="solar">Energia Solar</option>
              <option value="eolica">Energia Eólica</option>
              <option value="biomassa">Biomassa</option>
              <option value="outros">Outros</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Descreva sua tecnologia em detalhes..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text sm font-medium text-gray-700 mb-2">Preço da Licença (ETH)</label>
              <input
                type="number"
                step="0.001"
                min="0.001"
                max="0.01"
                value={priceEth}
                onChange={(e) => setPriceEth(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0.001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Taxa de Royalty (%)</label>
              <input
                type="number"
                min={1}
                max={25}
                value={royaltyRate}
                onChange={(e) => setRoyaltyRate(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="5"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="exclusive"
              checked={exclusive}
              onChange={(e) => setExclusive(e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="exclusive" className="ml-2 block text-sm text-gray-900">
              Licença exclusiva (apenas uma empresa pode licenciar)
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Documentação (IPFS)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="text-gray-400 text-4xl mb-2">📎</div>
              <p className="text-sm text-gray-600">
                Arraste arquivos aqui ou clique para fazer upload
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PDF, DOC, DOCX até 10MB
              </p>
            </div>
          </div>

          {registerMsg && (
            <p className="text-sm text-gray-600">{registerMsg}</p>
          )}
        </CardContent>

        <CardFooter>
          <div className="flex gap-4 w-full">
            <Button variant="outline" className="flex-1">
              Salvar Rascunho
            </Button>
            <Button className="flex-1" onClick={handleSubmitTechnology} isLoading={isSubmitting} disabled={isSubmitting}>
              Registrar Tecnologia
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );

  const renderEarningsTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">
        Receitas e Royalties
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-green-600 mb-2">2.35 ETH</div>
            <div className="text-sm text-gray-600">Total Recebido</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">0.15 ETH</div>
            <div className="text-sm text-gray-600">Este Mês</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-purple-600 mb-2">3</div>
            <div className="text-sm text-gray-600">Licenças Ativas</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">
            Histórico de Transações
          </h3>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-4">📊</div>
            <p className="text-gray-600">
              Histórico de royalties será exibido aqui
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Painel do Pesquisador
        </h1>
        <p className="text-gray-600">
          Gerencie suas tecnologias e acompanhe suas receitas
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'technologies' && renderTechnologiesTab()}
      {activeTab === 'register' && renderRegisterTab()}
      {activeTab === 'earnings' && renderEarningsTab()}
    </div>
  );
}