# Cuida 💚

**"Conectando quem cuida com quem precisa"**

Cuida é uma plataforma social de saúde que conecta médicos voluntários, pacientes e doadores. Pacientes podem criar pedidos de assistência médica e campanhas de arrecadação. Médicos voluntários respondem aos pedidos. Doadores apoiam campanhas de saúde.

Construído com Next.js 14 (App Router), Tailwind CSS e Supabase.

---

## Funcionalidades

- **Autenticação** — Cadastro com seleção de papel (paciente / médico / doador)
- **Pedidos médicos** — Pacientes criam pedidos; médicos voluntários respondem
- **Campanhas de saúde** — Crowdfunding com meta, história e doadores
- **Fluxo de doação** — Valores predefinidos, doação anônima, mensagem de apoio
- **Dashboards por papel** — Interfaces distintas para cada tipo de usuário
- **Design system completo** — Fontes Fraunces + DM Sans, paleta teal + coral

---

## Status da demo

Esta é uma versão de demonstração. Algumas limitações conhecidas:

- **Tela de carregamento infinito ao navegar para "Ver campanhas"** após visitar o perfil — esta é uma limitação da demo atual; o fluxo completo de perfil de usuário ainda está em desenvolvimento.
- O cadastro e edição de perfil estão parcialmente implementados.
- Funcionalidades como notificações, chat e histórico médico ainda não foram desenvolvidas.

---

## Estrutura do projeto

```
cuida/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── not-found.tsx            # Página 404
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/
│   │   ├── page.tsx             # Redireciona por papel
│   │   ├── patient/page.tsx
│   │   ├── doctor/page.tsx
│   │   └── donor/page.tsx
│   ├── requests/
│   │   ├── page.tsx             # Lista de pedidos
│   │   ├── [id]/page.tsx        # Detalhe
│   │   └── new/page.tsx         # Criar pedido
│   └── campaigns/
│       ├── page.tsx             # Lista de campanhas
│       ├── [id]/page.tsx        # Detalhe + doação
│       └── new/page.tsx         # Criar campanha
├── components/
│   ├── ui/                      # Button, Card, Logo, Toast, etc.
│   ├── features/                # RequestCard, CampaignCard
│   └── layout/                  # Sidebar, Navbar, MobileNav, PageWrapper
├── lib/
│   ├── supabase/client.ts
│   ├── supabase/server.ts
│   ├── hooks/useAuth.ts
│   ├── hooks/useRequests.ts
│   ├── hooks/useCampaigns.ts
│   └── seed.ts
├── middleware.ts
└── types/database.ts
```

---

## Deploy no Vercel

1. Faça push do projeto para um repositório GitHub
2. Acesse [vercel.com/new](https://vercel.com/new) e importe o repositório
3. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Clique em **Deploy**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## Tecnologias

| Tecnologia | Uso |
|---|---|
| Next.js 14 | Framework React (App Router) |
| TypeScript | Tipagem estática |
| Tailwind CSS | Estilização utilitária |
| Supabase | Banco de dados + autenticação |
| Lucide React | Ícones |
| Fraunces | Fonte display (headings) |
| DM Sans | Fonte body |

---

## Paleta de cores

| Token | Cor | Uso |
|---|---|---|
| `primary` | `#1A6B5A` | Ações principais, teal médico |
| `primary-light` | `#2D9E87` | Hover, acentos |
| `accent` | `#F4845F` | CTAs coral, urgência |
| `surface` | `#F8FAF9` | Background das páginas |
| `text-main` | `#1C2B27` | Texto principal |
| `text-muted` | `#6B8A82` | Texto secundário |

---

Feito com 💚 para transformar o acesso à saúde no Brasil.
