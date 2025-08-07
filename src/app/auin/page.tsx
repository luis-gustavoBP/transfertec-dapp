'use client';

import React, { useState } from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { Technology, TechStatus, UserRole } from '@/types';
import { formatAddress, formatDate } from '@/lib/utils';

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

export default function AuinPage() {
  const { state } = useWeb3();
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'analytics'>('pending');

  // Redirect if not AUIN
  if (state.isConnected && state.user?.role !== UserRole.AUIN) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Acesso Restrito
            </h2>
            <p className="text-gray-600">
              Esta área é exclusiva para a Agência UNESP de Inovação (AUIN).
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tabs = [
    { id: 'pending', label: 'Pendentes de Aprovação', icon: '⏳', count: mockPendingTechnologies.length },
    { id: 'approved', label: 'Tecnologias Aprovadas', icon: '✅', count: mockApprovedTechnologies.length },
    { id: 'analytics', label: 'Relatórios', icon: '📊', count: 0 },
  ];

  const handleApprove = (tokenId: string) => {
    console.log('Aprovar tecnologia:', tokenId);
    // Implementar lógica de aprovação
  };

  const handleReject = (tokenId: string) => {
    console.log('Rejeitar tecnologia:', tokenId);
    // Implementar lógica de rejeição
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
        {mockPendingTechnologies.map((tech) => (
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
        {mockApprovedTechnologies.map((tech) => (
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

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">
        Relatórios e Análises
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">27</div>
            <div className="text-sm text-gray-600">Total de Tecnologias</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-green-600 mb-2">23</div>
            <div className="text-sm text-gray-600">Aprovadas</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-yellow-600 mb-2">2</div>
            <div className="text-sm text-gray-600">Pendentes</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-purple-600 mb-2">34.2 ETH</div>
            <div className="text-sm text-gray-600">Volume Total</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">
              Tecnologias por Categoria
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { category: 'Energia Solar', count: 8, percentage: 35 },
                { category: 'Biomassa', count: 6, percentage: 26 },
                { category: 'Energia Eólica', count: 4, percentage: 17 },
                { category: 'Agricultura', count: 3, percentage: 13 },
                { category: 'Outros', count: 2, percentage: 9 },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{item.category}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {item.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">
              Atividade Recente
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'Tecnologia aprovada', tech: 'Sistema Solar Híbrido', time: '2h atrás' },
                { action: 'Nova submissão', tech: 'Biodigestor Compacto', time: '5h atrás' },
                { action: 'Licença emitida', tech: 'Turbina Eólica', time: '1d atrás' },
                { action: 'Royalty pago', tech: 'Biomassa Agrícola', time: '2d atrás' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.action}:</span> {activity.tech}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Painel AUIN
        </h1>
        <p className="text-gray-600">
          Gerencie aprovações e monitore a transferência de tecnologia
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
                {tab.count > 0 && (
                  <span className="bg-primary-100 text-primary-600 text-xs px-2 py-1 rounded-full">
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
      {activeTab === 'analytics' && renderAnalyticsTab()}
    </div>
  );
}