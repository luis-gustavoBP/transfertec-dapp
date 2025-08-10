'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { Technology, TechStatus, UserRole } from '@/types';
import {
  getPendingTechnologies,
  getApprovedTechnologies,
  approveTechnology,
  rejectTechnology,
  STORAGE_EVENTS,
} from '@/lib/storage';
import { formatAddress, formatDate } from '@/lib/utils';
import { getNftContract } from '@/lib/contract';
import { ethers } from 'ethers';

// Dados mockados para demonstração
const mockPendingTechnologies: Technology[] = [
  {
    tokenId: '6',
    name: 'Biodigestor Compacto',
    category: 'biomassa',
    researchers: ['0x7890...1234'],
    royaltyRate: 6,
    isExclusive: false,
    licensePrice: '1.8',
    expirationDate: Date.now() / 1000 + 31536000,
    ipfsHash: 'QmCcCcCcCcCcCcCcCcCcCcCcCcCcCcCcCcCcCcCcCcCc',
    status: TechStatus.PENDING,
    description: 'Sistema compacto para produção de biogás a partir de resíduos orgânicos...',
  },
  {
    tokenId: '7',
    name: 'Sensor IoT para Agricultura',
    category: 'agricultura',
    researchers: ['0x8901...2345', '0x9012...3456'],
    royaltyRate: 7,
    isExclusive: true,
    licensePrice: '2.5',
    expirationDate: Date.now() / 1000 + 31536000,
    ipfsHash: 'QmDdDdDdDdDdDdDdDdDdDdDdDdDdDdDdDdDdDdDdDdDd',
    status: TechStatus.PENDING,
    description: 'Sensor inteligente para monitoramento de umidade e nutrientes do solo...',
  },
];

const mockApprovedTechnologies: Technology[] = [
  {
    tokenId: '1',
    name: 'Sistema Fotovoltaico Híbrido',
    category: 'solar',
    researchers: ['0x1234...5678', '0x2345...6789'],
    royaltyRate: 5,
    isExclusive: false,
    licensePrice: '2.5',
    expirationDate: Date.now() / 1000 + 31536000,
    ipfsHash: 'QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx',
    status: TechStatus.APPROVED,
    description: 'Sistema inovador que combina energia solar fotovoltaica...',
  },
  {
    tokenId: '2',
    name: 'Biomassa de Resíduos Agrícolas',
    category: 'biomassa',
    researchers: ['0x3456...7890'],
    royaltyRate: 8,
    isExclusive: true,
    licensePrice: '4.0',
    expirationDate: Date.now() / 1000 + 31536000,
    ipfsHash: 'QmYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYy',
    status: TechStatus.LICENSED,
    description: 'Processo para conversão eficiente de resíduos agrícolas...',
  },
];

function RoleManager({ isOwner }: { isOwner: boolean }) {
  const { state } = useWeb3();
  const [addr, setAddr] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handle = async (action: 'addResearcher' | 'removeResearcher' | 'addCompany' | 'removeCompany') => {
    setMsg(null);
    setLoading(true);
    try {
      if (!isOwner) throw new Error('Apenas o owner do contrato pode gerenciar papéis');
      
      // Validar endereço
      if (!addr || addr === '0x0000000000000000000000000000000000000000') {
        throw new Error('Endereço inválido');
      }
      
      // Verificar se é um endereço válido
      if (!addr.startsWith('0x') || addr.length !== 42) {
        throw new Error('Formato de endereço inválido (deve ser 0x + 40 caracteres hex)');
      }

      const contract = await getNftContract();
      
      // Verificar se é realmente o owner
      const contractOwner = await contract.owner();
      if (contractOwner.toLowerCase() !== state.address?.toLowerCase()) {
        throw new Error('Você não é o owner do contrato');
      }

      console.log(`Executando ${action} para endereço:`, addr);
      const tx = await (contract as any)[action](addr);
      await tx.wait();
      setMsg(`✅ Sucesso: ${action} executado para ${addr.slice(0, 6)}...${addr.slice(-4)}`);
      setAddr(''); // Limpar campo após sucesso
    } catch (e: any) {
      console.error('Erro na operação:', e);
      let errorMsg = e?.message || 'Falha na operação';
      
      // Traduzir erros comuns do contrato
      if (errorMsg.includes('Already researcher')) {
        errorMsg = 'Este endereço já é um pesquisador';
      } else if (errorMsg.includes('Not a researcher')) {
        errorMsg = 'Este endereço não é um pesquisador';
      } else if (errorMsg.includes('Already company')) {
        errorMsg = 'Este endereço já é uma empresa';
      } else if (errorMsg.includes('Not a company')) {
        errorMsg = 'Este endereço não é uma empresa';
      } else if (errorMsg.includes('Invalid address')) {
        errorMsg = 'Endereço inválido (não pode ser zero)';
      } else if (errorMsg.includes('CALL_EXCEPTION')) {
        errorMsg = 'Erro na execução do contrato - verifique se é o owner e se o endereço é válido';
      }
      
      setMsg(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
          <input
            type="text"
            value={addr}
            onChange={(e) => setAddr(e.target.value)}
            placeholder="0x..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => handle('addResearcher')} disabled={!isOwner || loading} isLoading={loading}>Adicionar Pesquisador</Button>
          <Button size="sm" variant="outline" onClick={() => handle('removeResearcher')} disabled={!isOwner || loading} isLoading={loading}>Remover Pesquisador</Button>
          <Button size="sm" variant="secondary" onClick={() => handle('addCompany')} disabled={!isOwner || loading} isLoading={loading}>Adicionar Empresa</Button>
          <Button size="sm" variant="outline" onClick={() => handle('removeCompany')} disabled={!isOwner || loading} isLoading={loading}>Remover Empresa</Button>
        </div>
        {msg && (
          <div className={`p-3 rounded-md text-sm ${msg.includes('❌') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {msg}
          </div>
        )}
        {!isOwner && (
          <div className="p-3 bg-yellow-50 text-yellow-700 rounded-md text-sm">
            ⚠️ Conecte como owner do contrato para gerenciar papéis
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AuinPage() {
  const { state } = useWeb3();
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'analytics' | 'manage' | 'licenses'>('pending');
  const [pending, setPending] = useState<Technology[]>([]);
  const [approvedLocal, setApprovedLocal] = useState<Technology[]>([]);

  const [isOwner, setIsOwner] = useState(false);
  const [ownerError, setOwnerError] = useState<string | null>(null);
  const [ownerChecked, setOwnerChecked] = useState(false);
  const [ownerAddress, setOwnerAddress] = useState<string>('');

  // Manage form state
  const [techId, setTechId] = useState<string>('1');
  const [tokenURI, setTokenURI] = useState<string>('ipfs://tech-1');
  const [priceEth, setPriceEth] = useState<string>('0.001');
  const [isExclusiveCfg, setIsExclusiveCfg] = useState<boolean>(false);
  const [manageMsg, setManageMsg] = useState<string | null>(null);
  const [loadingManage, setLoadingManage] = useState(false);

  // Licensed events
  const [licensed, setLicensed] = useState<Array<{
    licensee: string;
    tokenId: string;
    technologyId: string;
    price: string;
    txHash: string;
  }>>([]);
  const [loadingLicenses, setLoadingLicenses] = useState(false);

  useEffect(() => {
    // Carregar filas locais e ouvir atualizações (apenas client-side)
    const loadQueues = () => {
      setPending(getPendingTechnologies());
      setApprovedLocal(getApprovedTechnologies());
    };
    loadQueues();
    if (typeof window !== 'undefined') {
      window.addEventListener(STORAGE_EVENTS.pendingUpdated, loadQueues);
      window.addEventListener(STORAGE_EVENTS.approvedUpdated, loadQueues);
    }

    const checkOwner = async () => {
      setOwnerError(null);
      try {
        // Contrato read-only para garantir que funcione sem metamask
        const { getNftContractReadOnly } = await import('@/lib/contract');
        const contract = getNftContractReadOnly();
        const ownerAddr: string = await contract.owner();
        const isOwnerResult = state.address?.toLowerCase() === ownerAddr.toLowerCase();
        console.log('Owner check:', { 
          ownerAddr, 
          currentAddr: state.address, 
          isOwner: isOwnerResult 
        });
        setOwnerAddress(ownerAddr);
        setIsOwner(isOwnerResult);
      } catch (e: any) {
        console.error('Owner check error:', e);
        setOwnerError(e?.message || 'Falha ao verificar owner');
      } finally {
        setOwnerChecked(true);
      }
    };
    if (state.isConnected) checkOwner();

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(STORAGE_EVENTS.pendingUpdated, loadQueues);
        window.removeEventListener(STORAGE_EVENTS.approvedUpdated, loadQueues);
      }
    };
  }, [state.isConnected, state.address]);

  const tabs = [
    { id: 'pending', label: 'Pendentes de Aprovação', icon: '⏳', count: (pending?.length || 0) + mockPendingTechnologies.length },
    { id: 'approved', label: 'Tecnologias Aprovadas', icon: '✅', count: (approvedLocal?.length || 0) + mockApprovedTechnologies.length },
    { id: 'manage', label: 'Gerenciar', icon: '🛠️', count: 0 },
    { id: 'licenses', label: 'Licenças', icon: '🧾', count: licensed.length },
    { id: 'analytics', label: 'Relatórios', icon: '📊', count: 0 },
  ];

  const handleApprove = async (tokenId: string) => {
    // mover da fila pendente para aprovada e tentar registrar on-chain se owner
    const pendingList = getPendingTechnologies();
    const tech = pendingList.find((t) => t.tokenId === tokenId);
    const approved = approveTechnology(tokenId);
    setPending(getPendingTechnologies());
    setApprovedLocal(getApprovedTechnologies());

    // Se for owner, registrar no contrato automaticamente
    try {
      if (!isOwner || !tech) return;
      const contract = await getNftContract();
      const priceWei = ethers.parseEther(tech.licensePrice || '0');
      const uri = tech.ipfsHash ? `ipfs://${tech.ipfsHash}` : 'ipfs://';
      await (await contract.registerTechnology(BigInt(tech.tokenId), uri, priceWei, !!tech.isExclusive)).wait();
    } catch (err) {
      console.error('Falha ao registrar on-chain na aprovação:', err);
    }
  };

  const handleReject = (tokenId: string) => {
    rejectTechnology(tokenId);
    setPending(getPendingTechnologies());
  };

  const handleRegister = async () => {
    setManageMsg(null);
    setLoadingManage(true);
    try {
      if (!isOwner) throw new Error('Apenas o owner pode registrar');
      const contract = await getNftContract();
      const priceWei = ethers.parseEther(priceEth);
      const tx = await contract.registerTechnology(BigInt(techId), tokenURI, priceWei, isExclusiveCfg);
      await tx.wait();
      setManageMsg('Tecnologia registrada com sucesso');
    } catch (e: any) {
      setManageMsg(e?.message || 'Falha ao registrar');
    } finally {
      setLoadingManage(false);
    }
  };

  const handleUpdate = async () => {
    setManageMsg(null);
    setLoadingManage(true);
    try {
      if (!isOwner) throw new Error('Apenas o owner pode atualizar');
      const contract = await getNftContract();
      const priceWei = ethers.parseEther(priceEth);
      const tx = await contract.updateTechnology(BigInt(techId), tokenURI, priceWei, isExclusiveCfg);
      await tx.wait();
      setManageMsg('Tecnologia atualizada com sucesso');
    } catch (e: any) {
      setManageMsg(e?.message || 'Falha ao atualizar');
    } finally {
      setLoadingManage(false);
    }
  };

  const handleLoadLicensed = async () => {
    setLoadingLicenses(true);
    try {
      const contract = await getNftContract();
      // Consultar todos os eventos Licensed
      const filter = await (contract as any).filters?.Licensed?.();
      const logs = filter
        ? await contract.queryFilter(filter, 0, 'latest')
        : await contract.queryFilter('Licensed', 0, 'latest');
      const items = logs.map((log: any) => {
        const { args, transactionHash } = log;
        return {
          licensee: args?.licensee as string,
          tokenId: (args?.tokenId as bigint).toString(),
          technologyId: (args?.technologyId as bigint).toString(),
          price: ethers.formatEther(args?.priceWei as bigint),
          txHash: transactionHash as string,
        };
      });
      setLicensed(items.reverse());
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLicenses(false);
    }
  };

  const renderPendingTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Tecnologias Pendentes de Aprovação
        </h2>
        <div className="text-sm text-gray-600">
          {mockPendingTechnologies.length} aguardando análise
        </div>
      </div>

      <div className="space-y-4">
        {[...pending, ...mockPendingTechnologies].map((tech) => (
          <Card key={tech.tokenId}>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {tech.name}
                    </h3>
                    <StatusBadge status={tech.status} />
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    {tech.description}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
                  </div>

                  <div className="mt-4">
                    <span className="text-gray-500 text-sm">Pesquisadores:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {tech.researchers.map((researcher, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {formatAddress(researcher)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 lg:w-32">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleApprove(tech.tokenId)}
                    className="w-full"
                  >
                    Aprovar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReject(tech.tokenId)}
                    className="w-full"
                  >
                    Rejeitar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full"
                  >
                    Ver IPFS
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {mockPendingTechnologies.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">✨</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma tecnologia pendente
          </h3>
          <p className="text-gray-600">
            Todas as tecnologias foram processadas
          </p>
        </div>
      )}
    </div>
  );

  const renderApprovedTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Tecnologias Aprovadas
        </h2>
        <div className="text-sm text-gray-600">
          {mockApprovedTechnologies.length} tecnologias no marketplace
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...approvedLocal, ...mockApprovedTechnologies].map((tech) => (
          <Card key={tech.tokenId}>
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
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
                  <span className="text-gray-500">Aprovado em:</span>
                  <div className="font-medium">{formatDate(Date.now() / 1000)}</div>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <div className="flex gap-2 w-full">
                <Button variant="outline" size="sm" className="flex-1">
                  Ver Detalhes
                </Button>
                <Button size="sm" className="flex-1">
                  Relatório
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderManageTab = () => (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Gerenciar Tecnologias (Owner)</h2>
      {!isOwner && (
        <p className="text-sm text-red-600 mb-4">Conecte como owner do contrato para usar estas ações.</p>
      )}
      <Card>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Technology ID</label>
              <input type="number" value={techId} onChange={(e) => setTechId(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preço (ETH)</label>
              <input type="number" step="0.001" min="0.001" max="0.01" value={priceEth} onChange={(e) => setPriceEth(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Token URI (IPFS)</label>
            <input type="text" value={tokenURI} onChange={(e) => setTokenURI(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
          </div>
          <div className="flex items-center">
            <input id="exclusiveCfg" type="checkbox" checked={isExclusiveCfg} onChange={(e) => setIsExclusiveCfg(e.target.checked)} className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
            <label htmlFor="exclusiveCfg" className="ml-2 block text-sm text-gray-900">Exclusiva</label>
          </div>
          {manageMsg && <p className="text-sm text-gray-600">{manageMsg}</p>}
          <div className="flex gap-2">
            <Button onClick={handleRegister} isLoading={loadingManage} disabled={!isOwner || loadingManage}>Registrar</Button>
            <Button variant="secondary" onClick={handleUpdate} isLoading={loadingManage} disabled={!isOwner || loadingManage}>Atualizar</Button>
          </div>
        </CardContent>
      </Card>

      {/* Gestão de Papéis */}
      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Gestão de Papéis</h3>
        <RoleManager isOwner={isOwner} />
      </div>
    </div>
  );

  const renderLicensesTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Licenças Emitidas</h2>
        <Button onClick={handleLoadLicensed} isLoading={loadingLicenses}>Atualizar</Button>
      </div>
      {licensed.length === 0 && (
        <p className="text-sm text-gray-600">Nenhuma licença encontrada. Clique em Atualizar para buscar eventos.</p>
      )}
      <div className="space-y-3">
        {licensed.map((item, idx) => (
          <Card key={`${item.txHash}-${idx}`}>
            <CardContent className="p-4 flex flex-wrap items-center justify-between gap-2 text-sm">
              <div>
                <div className="text-gray-500">Licensee</div>
                <div className="font-medium">{formatAddress(item.licensee)}</div>
              </div>
              <div>
                <div className="text-gray-500">Technology</div>
                <div className="font-medium">#{item.technologyId}</div>
              </div>
              <div>
                <div className="text-gray-500">Token ID</div>
                <div className="font-medium">#{item.tokenId}</div>
              </div>
              <div>
                <div className="text-gray-500">Preço</div>
                <div className="font-medium">{item.price} ETH</div>
              </div>
              <div className="text-xs text-gray-500 break-all">{item.txHash}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">27</div>
            <div className="text-sm text-gray-600">Tecnologias Cadastradas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-green-600 mb-2">14</div>
            <div className="text-sm text-gray-600">Licenças Emitidas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-purple-600 mb-2">4.12 ETH</div>
            <div className="text-sm text-gray-600">Receita Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-yellow-600 mb-2">5</div>
            <div className="text-sm text-gray-600">Pendentes</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Atividade Recente</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { action: 'Licença emitida', tech: 'Sistema Solar Híbrido', time: '2h atrás' },
                { action: 'Nova tecnologia', tech: 'Biodigestor Compacto', time: '6h atrás' },
                { action: 'Royalty pago', tech: 'Sensor IoT', time: '1d atrás' },
                { action: 'Aprovação', tech: 'Turbina Eólica', time: '2d atrás' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="text-gray-900">{item.action}: <span className="font-medium">{item.tech}</span></div>
                  <div className="text-gray-500">{item.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Licenças por Categoria</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'Solar', pct: 40 },
                { label: 'Biomassa', pct: 30 },
                { label: 'Eólica', pct: 20 },
                { label: 'Outros', pct: 10 }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{item.label}</span>
                    <span className="text-gray-900 font-medium">{item.pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-primary-600 rounded-full" style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Se conectado, bloquear acesso somente após checar owner e se não for AUIN nem owner
  if (
    state.isConnected && ownerChecked && state.user?.role !== UserRole.AUIN && !isOwner
  ) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Acesso Restrito
            </h2>
            <p className="text-gray-600">
              Esta área é exclusiva para a Agência UNESP de Inovação (AUIN) ou o owner do contrato.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8 glass-card rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Painel AUIN
        </h1>
        <p className="text-gray-600">
          Gerencie aprovações e monitore a transferência de tecnologia
        </p>
        {ownerAddress && (
          <p className="text-sm text-gray-500 mt-2">
            Owner do contrato: {ownerAddress}
          </p>
        )}
        {state.address && (
          <p className="text-sm text-gray-500">
            Carteira conectada: {state.address}
          </p>
        )}
        {ownerChecked && (
          <p className="text-sm text-gray-500">
            Status: {isOwner ? '✅ Owner' : '❌ Não é owner'} | 
            Role: {state.user?.role || 'N/A'}
          </p>
        )}
        {ownerError && (
          <p className="text-sm text-red-600 mt-2">{ownerError}</p>
        )}
        {ownerChecked && state.isConnected && state.user?.role !== UserRole.AUIN && !isOwner && (
          <div className="mt-4">
            <Card>
              <CardContent className="text-center py-6">
                <div className="text-red-500 text-4xl mb-2">⚠️</div>
                <p className="text-sm text-gray-700">
                  Acesso restrito. Conecte a carteira owner do contrato ou uma conta AUIN para gerenciar.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-8 glass-card rounded-2xl p-2">
        <div className="border-b border-white/20">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-400 text-primary-100'
                    : 'border-transparent text-white/80 hover:text-white hover:border-white/30'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className="glass-card text-primary-50 text-xs px-2 py-1 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'pending' && renderPendingTab()}
      {activeTab === 'approved' && renderApprovedTab()}
      {activeTab === 'manage' && renderManageTab()}
      {activeTab === 'licenses' && renderLicensesTab()}
      {activeTab === 'analytics' && renderAnalyticsTab()}
    </div>
  );
}