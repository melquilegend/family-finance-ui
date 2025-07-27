# 💰 Aplicativo de Gestão Financeira Familiar

Um aplicativo moderno e bonito para gestão financeira familiar construído com React, TypeScript e Tailwind CSS. Perfeito para casais e famílias acompanharem gastos, gerenciarem poupanças, definirem metas financeiras e se organizarem juntos.

![App Finanças Familiares](https://images.pexels.com/photos/6289065/pexels-photo-6289065.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## ✨ Funcionalidades

### 🔐 **Autenticação & Segurança**
- **Registro & Login de Usuário** - Criação segura de conta e autenticação
- **Autenticação de Dois Fatores (2FA)** - Segurança aprimorada com suporte TOTP
- **Redefinição de Senha** - Funcionalidade de esqueci minha senha com verificação por email
- **Gestão de Perfil** - Perfis de usuário personalizáveis com upload de foto
- **Hash Seguro de Senhas** - Todas as senhas são adequadamente criptografadas e armazenadas

### 💸 **Rastreamento de Despesas**
- **Adicionar/Editar/Excluir Despesas** - Operações CRUD completas para gestão de despesas
- **Organização por Categoria** - Categorias pré-definidas (Supermercado, Contas, Entretenimento, etc.)
- **Busca & Filtro** - Encontre despesas por descrição, categoria ou data
- **Análises Visuais** - Divisão de despesas por categoria com barras de progresso
- **Resumos Mensais** - Acompanhe padrões de gastos ao longo do tempo

### 🏦 **Gestão de Poupanças**
- **Rastreamento de Poupanças** - Registre e monitore todos os depósitos de poupança
- **Cálculo da Taxa de Poupança** - Cálculo automático da porcentagem de poupança
- **Recomendações** - Sugestões de poupança alimentadas por IA baseadas nos gastos
- **Integração com Metas** - Vincule poupanças a objetivos financeiros específicos

### 🎯 **Definição de Metas**
- **Metas Financeiras** - Defina e acompanhe o progresso em direção aos objetivos financeiros
- **Atribuição Multi-Usuário** - Atribua metas aos membros da família
- **Visualização de Progresso** - Belas barras de progresso e acompanhamento de conclusão
- **Gestão de Prazos** - Defina datas-alvo e acompanhe prazos
- **Categorias de Metas** - Fundos de emergência, férias, grandes compras, etc.

### ✅ **Gestão de Tarefas**
- **Tarefas Familiares** - Organize tarefas financeiras e domésticas
- **Sistema de Atribuição** - Atribua tarefas a membros específicos da família
- **Rastreamento de Prazos** - Nunca perca prazos financeiros importantes
- **Status de Conclusão** - Marque tarefas como concluídas com feedback visual
- **Gestão de Prioridades** - Organize tarefas por importância

### 🧠 **Insights Alimentados por IA**
- **Consultor Financeiro** - Recomendações personalizadas usando OpenAI
- **Análise de Gastos** - Insights orientados por IA sobre padrões de gastos
- **Otimização de Orçamento** - Sugestões inteligentes para melhorias no orçamento
- **Potencial de Poupança** - Identifique áreas onde você pode economizar dinheiro
- **Análise de Tendências** - Tendências de gastos e poupanças de 6 meses

### 🎨 **Temas & Personalização**
- **9 Temas Bonitos** - Claro, Escuro, Casal, Oceano, Floresta, Pôr do Sol, Roxo, Rosa, Meia-Noite
- **Design Responsivo** - Perfeito em desktop, tablet e celular
- **Suporte Multi-Idioma** - Inglês e Português
- **Suporte a Moedas** - USD, EUR, BRL, AOA com formatação adequada
- **Personalização de Perfil** - Faça upload de fotos, adicione descrições, defina preferências

### 📱 **Experiência do Usuário**
- **Design Mobile-First** - Otimizado para todos os tamanhos de tela
- **Navegação Intuitiva** - Interface limpa e moderna com barra lateral recolhível
- **Atualizações em Tempo Real** - Sincronização instantânea de dados em todo o app
- **Animações Suaves** - Micro-interações e transições polidas
- **Acessibilidade** - Compatível com WCAG com taxas de contraste adequadas

## 🚀 Começando

### Pré-requisitos
- Node.js 18+ 
- Gerenciador de pacotes npm ou yarn
- Navegador web moderno

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seuusuario/family-finance-app.git
cd family-finance-app
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
Crie um arquivo `.env` no diretório raiz:
```env
VITE_OPENAI_API_KEY=sua_chave_api_openai_aqui
```

4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

5. **Abra seu navegador**
Navegue para `http://localhost:5173`

### Construindo para Produção

```bash
npm run build
```

Os arquivos construídos estarão no diretório `dist`, prontos para implantação.

## 🏗️ Stack Tecnológica

### **Frontend**
- **React 18** - React moderno com hooks e recursos concorrentes
- **TypeScript** - Desenvolvimento type-safe com excelente suporte IDE
- **Vite** - Ferramenta de build ultrarrápida e servidor de desenvolvimento
- **Tailwind CSS** - Framework CSS utility-first para estilização rápida

### **Componentes UI**
- **Lucide React** - Ícones bonitos e personalizáveis
- **Componentes Customizados** - Componentes Button, Input, Modal, Card reutilizáveis
- **Grid Responsivo** - CSS Grid e Flexbox para layouts

### **Gestão de Estado**
- **React Context** - Gestão de estado global para auth, tema, idioma
- **Hooks Customizados** - Lógica reutilizável para busca de dados e estado
- **Local Storage** - Armazenamento persistente de dados no navegador

### **Integração IA**
- **API OpenAI** - GPT-3.5-turbo para conselhos financeiros e insights
- **Análises Inteligentes** - Análise de padrões de gastos alimentada por IA
- **Recomendações Personalizadas** - Sugestões financeiras conscientes do contexto

### **Segurança**
- **Hash de Senhas** - Armazenamento seguro de senhas
- **2FA TOTP** - Senhas únicas baseadas em tempo
- **Validação de Entrada** - Validação de formulários do lado do cliente
- **Proteção XSS** - Entradas de usuário sanitizadas

## 📁 Estrutura do Projeto

```
src/
├── components/           # Componentes UI reutilizáveis
│   ├── auth/            # Componentes de autenticação
│   ├── layout/          # Componentes de layout (Sidebar, etc.)
│   ├── pages/           # Páginas principais da aplicação
│   └── ui/              # Componentes UI base (Button, Input, etc.)
├── contexts/            # Provedores React Context
│   ├── AuthContext.tsx  # Estado de autenticação
│   ├── DataContext.tsx  # Dados da aplicação
│   ├── ThemeContext.tsx # Gestão de temas
│   ├── LanguageContext.tsx # Internacionalização
│   └── CurrencyContext.tsx # Formatação de moedas
├── i18n/               # Internacionalização
│   └── translations.ts # Traduções de idiomas
├── types/              # Definições de tipos TypeScript
├── utils/              # Funções utilitárias
│   ├── storage.ts      # Wrapper LocalStorage
│   ├── crypto.ts       # Utilitários de criptografia
│   └── openai.ts       # Integração IA
└── App.tsx             # Componente principal da aplicação
```

## 🎨 Temas

O app inclui 9 temas cuidadosamente elaborados:

| Tema | Descrição | Cores |
|-------|-------------|---------|
| **Claro** | Interface limpa e brilhante | Branco, cinzas |
| **Escuro** | Suave para os olhos | Cinzas escuros, azuis |
| **Casal** | Gradiente rosa e azul para casais | Gradientes rosa, azul |
| **Oceano** | Azuis e verdes-azulados calmos | Tons ciano, azul |
| **Floresta** | Verdes naturais e tons terrosos | Verdes, marrons |
| **Pôr do Sol** | Laranjas e vermelhos quentes | Gradientes laranja, vermelho |
| **Roxo** | Roxos e violetas ricos | Tons roxo, violeta |
| **Rosa** | Rosas e tons elegantes | Tons rosa, rosa |
| **Meia-Noite** | Azuis e roxos profundos | Índigo, roxo |

## 🌍 Internacionalização

Idiomas atualmente suportados:
- **Inglês** (en) 🇺🇸
- **Português** (pt) 🇧🇷

### Adicionando Novos Idiomas

1. Adicione traduções a `src/i18n/translations.ts`
2. Atualize o seletor de idioma na página de Perfil
3. Adicione opção de idioma ao contexto

## 💱 Suporte a Moedas

Moedas suportadas com formatação adequada:
- **USD** ($) - Dólar Americano 🇺🇸
- **EUR** (€) - Euro 🇪🇺
- **BRL** (R$) - Real Brasileiro 🇧🇷
- **AOA** (Kz) - Kwanza Angolano 🇦🇴

## 🤖 Recursos de IA

### Integração OpenAI
O app usa GPT-3.5-turbo da OpenAI para:
- **Conselhos Financeiros** - Recomendações personalizadas
- **Insights de Gastos** - Análise de padrões
- **Otimização de Orçamento** - Sugestões inteligentes
- **Estratégias de Poupança** - Conselhos orientados a metas

### Configurar Recursos de IA
1. Obtenha uma chave API OpenAI da [Plataforma OpenAI](https://platform.openai.com)
2. Adicione-a ao seu arquivo `.env` como `VITE_OPENAI_API_KEY`
3. O app fornecerá automaticamente insights de IA

## 💾 Armazenamento de Dados

### Implementação Atual
- **LocalStorage** - Armazenamento baseado no navegador
- **Apenas Cliente** - Nenhum servidor necessário
- **Específico do Dispositivo** - Dados permanecem no dispositivo

### Estrutura de Dados
```typescript
// Usuários
interface User {
  id: string;
  name: string;
  email: string;
  theme: Theme;
  language: Language;
  currency: Currency;
  profilePicture?: string;
  description?: string;
  createdAt: Date;
}

// Despesas
interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  createdAt: Date;
}

// Metas
interface Goal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  dueDate: Date;
  assignedTo: string[];
  createdBy: string;
  createdAt: Date;
}
```

### Atualizando para Banco de Dados Real
Para uso em produção, considere atualizar para:
- **Supabase** (PostgreSQL) - Recomendado
- **Firebase** (NoSQL)
- **MongoDB Atlas**
- **PlanetScale** (MySQL)

## 🚀 Implantação

### Implantação HostGator

1. **Construa o projeto**
```bash
npm run build
```

2. **Faça upload dos arquivos para o HostGator**
- Faça upload de todos os arquivos da pasta `dist/` para `public_html/`
- Certifique-se de que `index.html` esteja no diretório raiz

3. **Configure roteamento SPA**
Crie arquivo `.htaccess` em `public_html/`:
```apache
RewriteEngine On
RewriteBase /

# Lidar com roteamento do lado do cliente
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### Outras Opções de Implantação
- **Netlify** - Implantação arrastar e soltar
- **Vercel** - Implantação baseada em Git
- **GitHub Pages** - Hospedagem estática gratuita
- **AWS S3** - Hospedagem em nuvem escalável

## 🔧 Desenvolvimento

### Scripts Disponíveis

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Construir para produção
npm run build

# Visualizar build de produção
npm run preview

# Executar linting
npm run lint
```

### Estilo de Código
- **ESLint** - Linting e formatação de código
- **TypeScript** - Verificação de tipos
- **Prettier** - Formatação de código (recomendado)

### Contribuindo
1. Faça fork do repositório
2. Crie uma branch de feature
3. Faça suas alterações
4. Adicione testes se aplicável
5. Envie um pull request

## 🐛 Solução de Problemas

### Problemas Comuns

**Erros de Build**
- Certifique-se de que Node.js 18+ esteja instalado
- Limpe `node_modules` e reinstale: `rm -rf node_modules && npm install`

**Recursos de IA Não Funcionando**
- Verifique a chave API OpenAI no arquivo `.env`
- Verifique se a chave API tem créditos suficientes
- Verifique o console do navegador para erros

**Tema Não Aplicando**
- Limpe cache do navegador e localStorage
- Verifique se o tema está adequadamente selecionado no Perfil

**Problemas Mobile**
- Certifique-se de que a meta tag viewport esteja presente
- Teste em dispositivos reais, não apenas ferramentas dev do navegador

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🤝 Suporte

Para suporte e perguntas:
- Crie uma issue no GitHub
- Verifique a documentação
- Revise a seção de solução de problemas

## 🎯 Roadmap

### Recursos Futuros
- [ ] **Integração com Banco de Dados Real** (Supabase/Firebase)
- [ ] **Exportação/Importação de Dados** (CSV, JSON)
- [ ] **Transações Recorrentes** 
- [ ] **Categorias e Limites de Orçamento**
- [ ] **Upload de Foto de Recibos**
- [ ] **Integração com Conta Bancária**
- [ ] **Rastreamento de Investimentos**
- [ ] **Lembretes de Contas**
- [ ] **Compartilhamento Familiar & Permissões**
- [ ] **Relatórios Avançados**
- [ ] **App Mobile** (React Native)
- [ ] **Suporte Offline** (PWA)

### Recursos Concluídos ✅
- [x] Autenticação de Usuário & 2FA
- [x] Rastreamento de Despesas & Poupanças
- [x] Gestão de Metas
- [x] Organização de Tarefas
- [x] Insights Alimentados por IA
- [x] Suporte Multi-Tema
- [x] Internacionalização
- [x] Design Responsivo Mobile
- [x] Personalização de Perfil

---

## 🌟 Capturas de Tela

### Painel
![Painel](https://images.pexels.com/photos/6289025/pexels-photo-6289025.jpeg?auto=compress&cs=tinysrgb&w=800)

### Rastreamento de Despesas
![Despesas](https://images.pexels.com/photos/6289028/pexels-photo-6289028.jpeg?auto=compress&cs=tinysrgb&w=800)

### Insights de IA
![Insights IA](https://images.pexels.com/photos/8358029/pexels-photo-8358029.jpeg?auto=compress&cs=tinysrgb&w=800)

---

**Construído com ❤️ para famílias que querem assumir o controle de suas finanças juntas.**

*Feliz orçamento! 💰✨*