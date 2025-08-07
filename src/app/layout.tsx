import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Web3Provider } from '@/contexts/Web3Context';
import Header from '@/components/layout/Header';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'UNESP Tech - Transferência de Tecnologia',
  description: 'Plataforma blockchain para tokenização e licenciamento de tecnologias UNESP',
  keywords: ['blockchain', 'NFT', 'UNESP', 'transferência de tecnologia', 'inovação'],
  authors: [{ name: 'Luis Gustavo' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#003366',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} antialiased`}>
        <Web3Provider>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <footer className="bg-white border-t border-gray-200 mt-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      UNESP Tech
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Plataforma blockchain para facilitar a transferência de 
                      tecnologia entre a UNESP e o setor produtivo.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">
                      Links Úteis
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>
                        <a 
                          href="https://www2.unesp.br/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-primary-700"
                        >
                          UNESP
                        </a>
                      </li>
                      <li>
                        <a 
                          href="https://www2.unesp.br/auin/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-primary-700"
                        >
                          AUIN
                        </a>
                      </li>
                      <li>
                        <a 
                          href="https://sepolia.etherscan.io" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-primary-700"
                        >
                          Sepolia Explorer
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">
                      Suporte
                    </h4>
                    <p className="text-sm text-gray-600">
                      Para dúvidas técnicas ou suporte, entre em contato através dos 
                      canais oficiais da AUIN.
                    </p>
                  </div>
                </div>
                <div className="border-t border-gray-200 mt-8 pt-6 text-center">
                  <p className="text-sm text-gray-600">
                    © 2025 UNESP Tech. Desenvolvido para o Hacka Transferência de Tecnologia UNESP 2025.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </Web3Provider>
      </body>
    </html>
  );
}