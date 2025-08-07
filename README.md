# UNESP Tech - DApp de Transferência de Tecnologia

## 🏆 Hacka Transferência de Tecnologia UNESP 2025

Uma plataforma blockchain revolucionária para tokenização e licenciamento de tecnologias da UNESP como NFTs (ERC-721), facilitando a transferência de tecnologia entre universidades e setor produtivo.

## 🚀 Funcionalidades

### Para Pesquisadores UNESP
- ✅ Registrar tecnologias como NFTs
- ✅ Upload de documentação técnica (IPFS simulado)
- ✅ Definir termos de licenciamento (preço, royalties, exclusividade)
- ✅ Visualizar histórico e receitas de royalties

### Para AUIN (Agência UNESP de Inovação)
- ✅ Dashboard para aprovar tecnologias registradas
- ✅ Gestão de contratos de licenciamento
- ✅ Relatórios de transferência de tecnologia
- ✅ Validação de autenticidade

### Para Empresas
- ✅ Marketplace de tecnologias aprovadas
- ✅ Sistema de busca por categoria
- ✅ Processo de aquisição de licenças
- ✅ Visualização de termos e condições

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Blockchain**: Ethereum (rede Sepolia para testes)
- **Smart Contract**: Solidity + OpenZeppelin (ERC-721)
- **Web3**: ethers.js v6
- **Provider**: Alchemy (configuração necessária)
- **Carteira**: MetaMask

## 🏗️ Arquitetura

```
src/
├── app/                    # Pages (App Router)
│   ├── page.tsx           # Homepage
│   ├── marketplace/       # Marketplace de tecnologias
│   ├── researcher/        # Dashboard do pesquisador
│   └── auin/             # Dashboard da AUIN
├── components/
│   ├── ui/               # Componentes base (Button, Card, Badge)
│   ├── web3/             # Componentes Web3 (WalletConnect)
│   ├── features/         # Componentes específicos por feature
│   └── layout/           # Layout components (Header, Footer)
├── contexts/             # React Contexts (Web3Context)
├── hooks/                # Custom hooks
├── lib/                  # Utilitários e configurações
├── types/                # TypeScript types
└── contracts/            # ABIs e endereços dos contratos
```

## 🎨 Design System

### Paleta de Cores
- **Primary**: Azul UNESP (#003366)
- **Secondary**: Verde sustentabilidade (#10B981)
- **Accent**: Laranja energia (#F97316)
- **Neutral**: Cinzas (#6B7280, #374151, #1F2937)

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ instalado
- MetaMask instalado no navegador
- ETH de teste na rede Sepolia (faucet)

### Instalação
```bash
# Clonar o repositório
git clone <repo-url>
cd transfertec

# Instalar dependências
npm install

# Instalar Tailwind CSS v3 (versão estável)
npm install tailwindcss@^3.4.0 postcss autoprefixer

# Executar em modo desenvolvimento
npm run dev
```

### Configuração da Blockchain

1. **Conectar MetaMask à rede Sepolia**
   - Abrir MetaMask
   - Trocar para rede Sepolia
   - Obter ETH de teste: https://sepoliafaucet.com/

2. **Configurar Alchemy (Opcional)**
   - Criar conta em https://alchemy.com
   - Criar app na rede Sepolia
   - Atualizar `SEPOLIA_RPC_URL` em `src/lib/constants.ts`

### Testando a Aplicação

1. **Abrir** http://localhost:3000
2. **Conectar** MetaMask
3. **Explorar** as diferentes funcionalidades baseadas no seu papel:
   - Endereços terminados em 0,1,2 → Pesquisador
   - Endereços terminados em 3,4,5 → AUIN
   - Outros → Empresa

## 🎯 Funcionalidades Implementadas

### ✅ Base Sólida
- [x] Configuração completa do projeto Next.js 14
- [x] Integração Web3 com ethers.js v6
- [x] Context para gerenciamento de estado da carteira
- [x] Conexão e desconexão do MetaMask
- [x] Detecção automática de rede e troca para Sepolia
- [x] Sistema de tipos TypeScript completo

### ✅ Interface de Usuário
- [x] Design system com paleta UNESP
- [x] Componentes UI reutilizáveis (Button, Card, Badge)
- [x] Layout responsivo e moderno
- [x] Navegação baseada no papel do usuário
- [x] Animações e transições suaves

### ✅ Páginas Funcionais
- [x] Homepage com hero section e estatísticas
- [x] Marketplace com busca e filtros
- [x] Dashboard do Pesquisador (registro e gerenciamento)
- [x] Dashboard AUIN (aprovações e relatórios)
- [x] Controle de acesso baseado em papéis

### ✅ Experiência do Usuário
- [x] Auto-detecção de papel do usuário
- [x] Feedback visual para estados de loading
- [x] Tratamento de erros Web3
- [x] Interface intuitiva e acessível

## 🔮 Próximos Passos

### Smart Contract Integration
- [ ] Deploy do contrato TechLicenseNFT na Sepolia
- [ ] Integração completa com funções do contrato
- [ ] Listeners para eventos blockchain
- [ ] Cache de dados para performance

### Features Avançadas
- [ ] Sistema de upload IPFS real
- [ ] Notificações em tempo real
- [ ] Histórico de transações detalhado
- [ ] Sistema de reviews e ratings

### Melhorias UX
- [ ] PWA (Progressive Web App)
- [ ] Modo escuro
- [ ] Internacionalização (i18n)
- [ ] Tour guiado para novos usuários

## 📊 Dados Mockados

Para fins de demonstração, a aplicação utiliza dados mockados que simulam:
- **27 tecnologias** registradas
- **3 categorias** principais (Solar, Biomassa, Eólica)
- **Diferentes status** (Pendente, Aprovada, Licenciada)
- **Múltiplos pesquisadores** e tecnologias

## 🎤 Apresentação no Hackathon

### Demonstração Sugerida (5 minutos)

1. **Introdução** (30s)
   - Problema: barreiras na transferência de tecnologia
   - Solução: tokenização blockchain

2. **Demo Live** (3 minutos)
   - Conectar MetaMask
   - Navegar marketplace como empresa
   - Trocar para pesquisador → registrar tecnologia
   - Trocar para AUIN → aprovar tecnologia

3. **Diferencial Técnico** (1 minuto)
   - Next.js 14 + TypeScript
   - Web3 integration com ethers.js
   - Design responsivo e acessível

4. **Impacto** (30s)
   - Facilita transferência de tecnologia
   - Transparência blockchain
   - Royalties automatizados

### Screenshots Importantes
- Homepage com hero section
- Marketplace com filtros
- Dashboard do pesquisador
- Sistema de aprovação AUIN

## 🤝 Contribuição

Para contribuir com o projeto:

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/amazing-feature`)
3. Commit suas mudanças (`git commit -m 'Add amazing feature'`)
4. Push para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🏫 Desenvolvido para

**Hacka Transferência de Tecnologia UNESP 2025**  
Quebrando barreiras na transferência de tecnologia entre universidades e setor produtivo.

---

**Desenvolvido com ❤️ para inovação e sustentabilidade**