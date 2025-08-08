'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWeb3 } from '@/contexts/Web3Context';
import WalletConnect from '@/components/web3/WalletConnect';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types';
import { getNftContractReadOnly } from '@/lib/contract';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
}

function NavLink({ href, children, isActive }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'px-3 py-2 rounded-md text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary-700 text-white'
          : 'text-gray-700 hover:text-primary-700 hover:bg-gray-50'
      )}
    >
      {children}
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const { state } = useWeb3();
  const [isOwner, setIsOwner] = useState(false);
  const [isResearcher, setIsResearcher] = useState(false);

  useEffect(() => {
    const checkRoles = async () => {
      try {
        if (!state.isConnected || !state.address) {
          setIsOwner(false);
          setIsResearcher(false);
          return;
        }
        const contract = getNftContractReadOnly();
        const ownerAddr: string = await contract.owner();
        setIsOwner(ownerAddr.toLowerCase() === state.address.toLowerCase());
        try {
          const res: boolean = await contract.isResearcher(state.address);
          setIsResearcher(!!res);
        } catch {
          setIsResearcher(false);
        }
      } catch {
        setIsOwner(false);
        setIsResearcher(false);
      }
    };
    checkRoles();
  }, [state.isConnected, state.address]);

  // Navegação principal sempre visível
  const baseItems = [
    { href: '/', label: 'Home' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/reports', label: 'Relatórios' },
  ];

  const navigationItems = [...baseItems];

  // Mostrar AUIN apenas para owner
  if (isOwner) {
    navigationItems.push({ href: '/auin', label: 'AUIN' });
  }

  // Mostrar Pesquisador se on-chain researcher ou se contexto indicar (fallback)
  if (isResearcher || state.user?.role === UserRole.RESEARCHER) {
    navigationItems.push({ href: '/researcher', label: 'Pesquisador' });
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo e nome */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-700 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">UNESP Tech</h1>
                <p className="text-xs text-gray-600 hidden sm:block">
                  Transferência de Tecnologia
                </p>
              </div>
            </Link>
          </div>

          {/* Navegação central */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                isActive={pathname === item.href}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Conexão da carteira */}
          <div className="flex items-center">
            <WalletConnect />
          </div>
        </div>

        {/* Navegação mobile */}
        <div className="md:hidden border-t border-gray-200 pt-2 pb-3">
          <nav className="flex flex-wrap gap-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                isActive={pathname === item.href}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}