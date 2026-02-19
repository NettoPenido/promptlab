# 🚀 Welcome to Z.ai Code Scaffold

A modern, production-ready web application scaffold powered by cutting-edge technologies, designed to accelerate your development with [Z.ai](https://chat.z.ai)'s AI-powered coding assistance.

## ✨ Technology Stack

This scaffold provides a robust foundation built with:

### 🎯 Core Framework
- **⚡ Next.js 16** - The React framework for production with App Router
- **📘 TypeScript 5** - Type-safe JavaScript for better developer experience
- **🎨 Tailwind CSS 4** - Utility-first CSS framework for rapid UI development

### 🧩 UI Components & Styling
- **🧩 shadcn/ui** - High-quality, accessible components built on Radix UI
- **🎯 Lucide React** - Beautiful & consistent icon library
- **🌈 Framer Motion** - Production-ready motion library for React
- **🎨 Next Themes** - Perfect dark mode in 2 lines of code

### 📋 Forms & Validation
- **🎣 React Hook Form** - Performant forms with easy validation
- **✅ Zod** - TypeScript-first schema validation

### 🔄 State Management & Data Fetching
- **🐻 Zustand** - Simple, scalable state management
- **🔄 TanStack Query** - Powerful data synchronization for React
- **🌐 Fetch** - Promise-based HTTP request

### 🗄️ Database & Backend
- **🗄️ Prisma** - Next-generation TypeScript ORM
- **🔐 NextAuth.js** - Complete open-source authentication solution

### 🎨 Advanced UI Features
- **📊 TanStack Table** - Headless UI for building tables and datagrids
- **🖱️ DND Kit** - Modern drag and drop toolkit for React
- **📊 Recharts** - Redefined chart library built with React and D3
- **🖼️ Sharp** - High performance image processing

### 🌍 Internationalization & Utilities
- **🌍 Next Intl** - Internationalization library for Next.js
- **📅 Date-fns** - Modern JavaScript date utility library
- **🪝 ReactUse** - Collection of essential React hooks for modern development

## 🎯 Why This Scaffold?

- **🏎️ Fast Development** - Pre-configured tooling and best practices
- **🎨 Beautiful UI** - Complete shadcn/ui component library with advanced interactions
- **🔒 Type Safety** - Full TypeScript configuration with Zod validation
- **📱 Responsive** - Mobile-first design principles with smooth animations
- **🗄️ Database Ready** - Prisma ORM configured for rapid backend development
- **🔐 Auth Included** - NextAuth.js for secure authentication flows
- **📊 Data Visualization** - Charts, tables, and drag-and-drop functionality
- **🌍 i18n Ready** - Multi-language support with Next Intl
- **🚀 Production Ready** - Optimized build and deployment settings
- **🤖 AI-Friendly** - Structured codebase perfect for AI assistance

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Start production server
bun start
```

Open [http://localhost:3000](http://localhost:3000) to see your application running.

## 🤖 Powered by Z.ai

This scaffold is optimized for use with [Z.ai](https://chat.z.ai) - your AI assistant for:

- **💻 Code Generation** - Generate components, pages, and features instantly
- **🎨 UI Development** - Create beautiful interfaces with AI assistance  
- **🔧 Bug Fixing** - Identify and resolve issues with intelligent suggestions
- **📝 Documentation** - Auto-generate comprehensive documentation
- **🚀 Optimization** - Performance improvements and best practices

Ready to build something amazing? Start chatting with Z.ai at [chat.z.ai](https://chat.z.ai) and experience the future of AI-powered development!

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable React components
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
└── lib/                # Utility functions and configurations
```

## 🎨 Available Features & Components

This scaffold includes a comprehensive set of modern web development tools:

### 🧩 UI Components (shadcn/ui)
- **Layout**: Card, Separator, Aspect Ratio, Resizable Panels
- **Forms**: Input, Textarea, Select, Checkbox, Radio Group, Switch
- **Feedback**: Alert, Toast (Sonner), Progress, Skeleton
- **Navigation**: Breadcrumb, Menubar, Navigation Menu, Pagination
- **Overlay**: Dialog, Sheet, Popover, Tooltip, Hover Card
- **Data Display**: Badge, Avatar, Calendar

### 📊 Advanced Data Features
- **Tables**: Powerful data tables with sorting, filtering, pagination (TanStack Table)
- **Charts**: Beautiful visualizations with Recharts
- **Forms**: Type-safe forms with React Hook Form + Zod validation

### 🎨 Interactive Features
- **Animations**: Smooth micro-interactions with Framer Motion
- **Drag & Drop**: Modern drag-and-drop functionality with DND Kit
- **Theme Switching**: Built-in dark/light mode support

### 🔐 Backend Integration
- **Authentication**: Ready-to-use auth flows with NextAuth.js
- **Database**: Type-safe database operations with Prisma
- **API Client**: HTTP requests with Fetch + TanStack Query
- **State Management**: Simple and scalable with Zustand

### 🌍 Production Features
- **Internationalization**: Multi-language support with Next Intl
- **Image Optimization**: Automatic image processing with Sharp
- **Type Safety**: End-to-end TypeScript with Zod validation
- **Essential Hooks**: 100+ useful React hooks with ReactUse for common patterns

## 🤝 Get Started with Z.ai

1. **Clone this scaffold** to jumpstart your project
2. **Visit [chat.z.ai](https://chat.z.ai)** to access your AI coding assistant
3. **Start building** with intelligent code generation and assistance
4. **Deploy with confidence** using the production-ready setup

---

Built with ❤️ for the developer community. Supercharged by [Z.ai](https://chat.z.ai) 🚀

---

# 🧪 Prompt Lab — The AI Image Vault (Setup do zero)

## 1) Instalar dependências
No diretório do projeto:

```bash
bun install
```

## 2) Configurar `.env`
Crie um arquivo `.env` na raiz (copie de `.env.example`) e preencha:

- `JWT_SECRET`: string longa e aleatória (use 64+ caracteres)
- `HOTMART_HOTTOK`: token configurado no Hotmart Webhook (header `X-HOTMART-HOTTOK`)
- `DATABASE_URL`: para SQLite local

## 3) Banco de dados (Prisma)

```bash
bun run db:generate
bun run db:migrate
```

> O projeto usa SQLite por padrão (ótimo para começar). Em produção, você pode migrar para Postgres depois.

## 4) Rodar local

```bash
bunx next dev -p 3000
```

Abra: http://localhost:3000

## 5) Cadastrar prompts e imagens
Edite: `src/content/prompts.ts`

Coloque suas imagens em:

- `public/prompts/homens/`
- `public/prompts/mulheres/`
- `public/prompts/infantis/`
- `public/prompts/publicidade/`

E cadastre os itens no array `PROMPTS`.

## 6) Webhook Hotmart (automático)
Configure no Hotmart (Webhook / API e notificações):

- **URL de entrega:** `https://SEU-DOMINIO.com/api/hotmart/webhook`
- **Token (HOTTOK):** o mesmo valor que você colocou em `HOTMART_HOTTOK`
- **Eventos de compra recomendados:** purchase approved, purchase refunded, chargeback, purchase canceled/expired

Quando o pagamento for aprovado, o webhook salva o e-mail do comprador como **ACTIVE**.

## 7) Como o cliente desbloqueia
O comprador entra em:

- `https://SEU-DOMINIO.com/acessar`

Digita o mesmo e-mail usado na compra. Se estiver ACTIVE, o site libera o botão **Copiar**.


## Personalize imagens (Home cinematográfica)

- Foto grande do topo: substitua o arquivo `public/hero-waldir-bmw.jpg` pela sua imagem (mesmo nome).
- Capas das categorias (estilo Netflix):
  - `public/prompts/homens/cover.jpg`
  - `public/prompts/mulheres/cover.jpg`
  - `public/prompts/infantis/cover.jpg`
  - `public/prompts/publicidade/cover.jpg`

> Dica: pode usar JPG ou PNG, mas mantenha o nome e extensão conforme o código.
