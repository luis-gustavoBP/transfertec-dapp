'use client';

import React from 'react';
import Link from 'next/link';
import { useWeb3 } from '@/contexts/Web3Context';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { UserRole } from '@/types';

export default function HomePage() {
  const { state } = useWeb3();

  const features = [
    {
      title: 'Tokenização de Tecnologias',
      description: 'Transforme suas pesquisas e patentes em NFTs únicos e verificáveis na blockchain.',
      icon: '🔬',
      color: 'from-blue-500 to-purple-600',
    },
    {
      title: 'Licenciamento Transparente',
      description: 'Sistema automatizado de licenciamento com contratos inteligentes.',
      icon: '📄',
      color: 'from-green-500 to-blue-500',
    },
    {
      title: 'Marketplace de Inovação',
      description: 'Conecte pesquisadores com empresas interessadas em tecnologias sustentáveis.',
      icon: '🛒',
      color: 'from-orange-500 to-red-500',
    },
    {
      title: 'Royalties Automatizados',
      description: 'Receba pagamentos de royalties automaticamente através da blockchain.',
      icon: '💰',
      color: 'from-yellow-500 to-orange-500',
    },
  ];

  const stats = [
    { label: 'Tecnologias Registradas', value: '127', icon: '📊' },
    { label: 'Licenças Ativas', value: '34', icon: '✅' },
    { label: 'Empresas Parceiras', value: '18', icon: '🏢' },
    { label: 'Royalties Distribuídos', value: '12.5 ETH', icon: '💎' },
  ];

  const getDashboardLink = () => {
    if (!state.isConnected || !state.user) return '/marketplace';
    
    switch (state.user.role) {
      case UserRole.RESEARCHER:
        return '/researcher';
      case UserRole.AUIN:
        return '/auin';
      default:
        return '/marketplace';
    }
  };

  const getDashboardLabel = () => {
    if (!state.isConnected || !state.user) return 'Explorar Marketplace';
    
    switch (state.user.role) {
      case UserRole.RESEARCHER:
        return 'Painel Pesquisador';
      case UserRole.AUIN:
        return 'Painel AUIN';
      default:
        return 'Explorar Marketplace';
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-700 via-secondary-500 to-accent-500 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 animate-slide-down">
              Transforme Conhecimento em{' '}
              <span className="text-yellow-300">Valor</span>
            </h1>
            <p className="text-lg lg:text-xl mb-8 text-gray-100 animate-slide-up">
              A primeira plataforma blockchain do Brasil para tokenização e 
              licenciamento de tecnologias universitárias. Conectamos a inovação 
              da UNESP com o mercado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Link href={getDashboardLink()}>
                <Button size="lg" className="bg-white text-primary-700 hover:bg-gray-100 min-w-[200px]">
                  {getDashboardLabel()}
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 min-w-[200px]">
                  Ver Tecnologias
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-primary-700 mb-1">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Como Funciona
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nossa plataforma utiliza tecnologia blockchain para criar um 
              ecossistema transparente e eficiente de transferência de tecnologia.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="h-full animate-slide-up" style={{ animationDelay: `${index * 150}ms` }}>
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-primary-700 text-white">
        <div className="container text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Pronto para Inovar?
          </h2>
          <p className="text-lg mb-8 text-gray-100 max-w-2xl mx-auto">
            {state.isConnected 
              ? 'Sua carteira está conectada! Explore nossas funcionalidades e comece a tokenizar suas tecnologias.'
              : 'Conecte sua carteira e faça parte da revolução na transferência de tecnologia no Brasil.'
            }
          </p>
          
          {state.isConnected ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={getDashboardLink()}>
                <Button variant="secondary" size="lg">
                  Acessar Dashboard
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  Explorar Marketplace
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex justify-center">
              <Button variant="secondary" size="lg">
                Conectar Carteira para Começar
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}