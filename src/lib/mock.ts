import { Technology, TechStatus } from '@/types';

export const mockTechnologies: Technology[] = [
  {
    tokenId: '1',
    name: 'Sistema Fotovoltaico Híbrido',
    category: 'solar',
    researchers: ['0x1234...5678', '0x2345...6789'],
    royaltyRate: 5,
    isExclusive: false,
    licensePrice: '0.001',
    expirationDate: Math.floor(Date.now() / 1000) + 31536000,
    ipfsHash: 'QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx',
    status: TechStatus.APPROVED,
    description: 'Sistema inovador que combina energia solar fotovoltaica com armazenamento inteligente...',
    images: ['/api/placeholder/400/300'],
  },
  {
    tokenId: '2',
    name: 'Biomassa de Resíduos Agrícolas',
    category: 'biomassa',
    researchers: ['0x3456...7890'],
    royaltyRate: 8,
    isExclusive: true,
    licensePrice: '0.002',
    expirationDate: Math.floor(Date.now() / 1000) + 31536000,
    ipfsHash: 'QmYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYy',
    status: TechStatus.APPROVED,
    description: 'Processo para conversão eficiente de resíduos agrícolas em biomassa energética...',
    images: ['/api/placeholder/400/300'],
  },
  {
    tokenId: '3',
    name: 'Turbina Eólica de Baixa Velocidade',
    category: 'eolica',
    researchers: ['0x4567...8901', '0x5678...9012'],
    royaltyRate: 6,
    isExclusive: false,
    licensePrice: '0.0015',
    expirationDate: Math.floor(Date.now() / 1000) + 31536000,
    ipfsHash: 'QmZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZz',
    status: TechStatus.APPROVED,
    description: 'Turbina eólica otimizada para funcionar eficientemente em ventos de baixa velocidade...',
    images: ['/api/placeholder/400/300'],
  },
];

export function getTechnologyById(tokenId: string): Technology | undefined {
  return mockTechnologies.find((t) => t.tokenId === tokenId);
}
