'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { Technology } from '@/types';
import { truncateText } from '@/lib/utils';
import { TECHNOLOGY_CATEGORIES } from '@/lib/constants';
import { getAllApprovedTechnologies } from '@/lib/mock';
import { useEffect } from 'react';
import { STORAGE_EVENTS } from '@/lib/storage';

export default function MarketplacePage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [approved, setApproved] = useState<Technology[]>(getAllApprovedTechnologies());

  useEffect(() => {
    const reload = () => setApproved(getAllApprovedTechnologies());
    reload();
    if (typeof window !== 'undefined') {
      window.addEventListener(STORAGE_EVENTS.approvedUpdated, reload);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(STORAGE_EVENTS.approvedUpdated, reload);
      }
    };
  }, []);

  const filteredTechnologies = approved.filter(tech => {
    const matchesCategory = selectedCategory === 'all' || tech.category === selectedCategory;
    const matchesSearch = tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tech.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryLabel = (value: string) => {
    const category = TECHNOLOGY_CATEGORIES.find(cat => cat.value === value);
    return category ? category.label : value;
  };

  const handleDetails = (tech: Technology) => {
    router.push(`/marketplace/${tech.tokenId}`);
  };

  const handleLicense = (tech: Technology) => {
    // Por ora, redireciona para a página de detalhes onde há o fluxo completo de licenciamento
    router.push(`/marketplace/${tech.tokenId}?action=license`);
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Marketplace de Tecnologias
        </h1>
        <p className="text-gray-600">
          Explore e licencie tecnologias inovadoras desenvolvidas na UNESP
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Busca */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar tecnologias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          {/* Filtro por categoria */}
          <div className="lg:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Todas as categorias</option>
              {TECHNOLOGY_CATEGORIES.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid de tecnologias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTechnologies.map((tech) => (
          <Card key={tech.tokenId} hover className="h-full flex flex-col">
            <CardHeader>
              <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-500 text-4xl">
                  {tech.category === 'solar' ? '☀️' :
                   tech.category === 'eolica' ? '💨' :
                   tech.category === 'biomassa' ? '🌱' : '🔬'}
                </span>
              </div>
              
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 flex-1">
                  {tech.name}
                </h3>
                <StatusBadge status={tech.status} size="sm" />
              </div>
              
              <span className="inline-block bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded-full">
                {getCategoryLabel(tech.category)}
              </span>
            </CardHeader>

            <CardContent className="flex-1">
              <p className="text-gray-600 text-sm mb-4">
                {truncateText(tech.description || '', 120)}
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Preço da Licença:</span>
                  <span className="font-medium">{tech.licensePrice} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Royalty:</span>
                  <span className="font-medium">{tech.royaltyRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tipo:</span>
                  <span className="font-medium">
                    {tech.isExclusive ? 'Exclusiva' : 'Não-exclusiva'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Pesquisadores:</span>
                  <span className="font-medium">{tech.researchers.length}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <div className="flex gap-2 w-full">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDetails(tech)}>
                  Ver Detalhes
                </Button>
                <Button size="sm" className="flex-1" onClick={() => handleLicense(tech)}>
                  Licenciar
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Mensagem quando não há resultados */}
      {filteredTechnologies.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma tecnologia encontrada
          </h3>
          <p className="text-gray-600">
            Tente ajustar os filtros ou termo de busca
          </p>
        </div>
      )}
    </div>
  );
}