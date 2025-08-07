'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWeb3 } from '@/contexts/Web3Context';
import WalletConnect from '@/components/web3/WalletConnect';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types';

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

  // Navegação baseada no papel do usuário
  const getNavigationItems = () => {
    if (!state.isConnected || !state.user) {
      return [
        { href: '/', label: 'Home' },
        { href: '/marketplace', label: 'Marketplace' },
      ];
    }

    const role = state.user.role;
    const items = [
      { href: '/', label: 'Home' },
      { href: '/marketplace', label: 'Marketplace' },
    ];

    if (role === UserRole.RESEARCHER) {
      items.push({ href: '/researcher', label: 'Painel Pesquisador' });
    } else if (role === UserRole.AUIN) {
      items.push({ href: '/auin', label: 'Painel AUIN' });
    }

    return items;
  };

  const navigationItems = getNavigationItems();

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