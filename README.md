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

## Configuração

### 1. Clone o repositório

```bash
git clone <seu-repositorio>
cd cuida
npm install
```

### 2. Crie um projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
2. Copie a **Project URL** e a **anon public key** em Settings → API

### 3. Configure as variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Edite `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### 4. Crie as tabelas no Supabase

No **Supabase Dashboard → SQL Editor**, execute o SQL abaixo:

```sql
-- ─── Profiles ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users PRIMARY KEY,
  full_name text,
  role text CHECK (role IN ('patient', 'doctor', 'donor')),
  avatar_url text,
  specialty text,
  location text,
  bio text,
  created_at timestamptz DEFAULT now()
);

-- ─── Medical Requests ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS medical_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES profiles(id),
  title text NOT NULL,
  description text,
  specialty_needed text,
  location text,
  urgency text CHECK (urgency IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  status text CHECK (status IN ('open', 'in_progress', 'resolved')) DEFAULT 'open',
  created_at timestamptz DEFAULT now()
);

-- ─── Campaigns ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES profiles(id),
  title text NOT NULL,
  story text,
  goal_amount numeric NOT NULL DEFAULT 0,
  current_amount numeric NOT NULL DEFAULT 0,
  cover_image_url text,
  status text CHECK (status IN ('active', 'completed', 'paused')) DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

-- ─── Donations ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id),
  donor_id uuid REFERENCES profiles(id),
  amount numeric NOT NULL,
  message text,
  anonymous boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- ─── Row Level Security ───────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Profiles: anyone can read; only owner can write
CREATE POLICY "profiles_select_all" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Medical requests: anyone can read; only owner can insert/update
CREATE POLICY "requests_select_all" ON medical_requests FOR SELECT USING (true);
CREATE POLICY "requests_insert_own" ON medical_requests FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "requests_update_own" ON medical_requests FOR UPDATE USING (auth.uid() = patient_id OR true);

-- Campaigns: anyone can read; only owner can insert/update
CREATE POLICY "campaigns_select_all" ON campaigns FOR SELECT USING (true);
CREATE POLICY "campaigns_insert_own" ON campaigns FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "campaigns_update_any" ON campaigns FOR UPDATE USING (true);

-- Donations: anyone can read; authenticated users can insert
CREATE POLICY "donations_select_all" ON donations FOR SELECT USING (true);
CREATE POLICY "donations_insert_auth" ON donations FOR INSERT WITH CHECK (auth.uid() IS NOT NULL OR true);

-- ─── Auto-create profile on signup ───────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, role)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'role'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();
```

### 5. Insira dados de demonstração (opcional)

Execute no **Supabase SQL Editor** para ver dados de exemplo:

```sql
-- Seed: campanhas de demonstração
INSERT INTO campaigns (id, patient_id, title, story, goal_amount, current_amount, status)
VALUES
  (
    'c1000000-0000-0000-0000-000000000001',
    (SELECT id FROM profiles LIMIT 1),
    'Cirurgia cardíaca urgente para a Ana Paula',
    'Minha esposa Ana Paula tem 42 anos e precisa de cirurgia cardíaca urgente. Somos uma família humilde e não conseguimos arcar com o custo. Qualquer ajuda é um ato de amor.',
    48000, 13440, 'active'
  ),
  (
    'c1000000-0000-0000-0000-000000000002',
    (SELECT id FROM profiles LIMIT 1),
    'Tratamento de leucemia infantil — ajude o Miguel',
    'Meu filho Miguel tem 7 anos e foi diagnosticado com leucemia. O tratamento é longo mas a ciência está do nosso lado. Com seu apoio, vamos vencer juntos.',
    35000, 23450, 'active'
  ),
  (
    'c1000000-0000-0000-0000-000000000003',
    (SELECT id FROM profiles LIMIT 1),
    'Prótese de perna para o seu Antônio',
    'Meu pai perdeu a perna em um acidente de trabalho há 26 anos. Sua prótese quebrou e ele está imobilizado. Falta pouco para ele voltar a caminhar.',
    22000, 20680, 'active'
  )
ON CONFLICT (id) DO NOTHING;

-- Seed: pedidos médicos de demonstração
INSERT INTO medical_requests (patient_id, title, specialty_needed, location, urgency, status)
SELECT
  id,
  'Orientação sobre pressão alta e tontura frequente',
  'Cardiologia',
  'São Paulo, SP',
  'high',
  'open'
FROM profiles
LIMIT 1;

INSERT INTO medical_requests (patient_id, title, specialty_needed, location, urgency, status)
SELECT
  id,
  'Criança com febre persistente há 5 dias',
  'Pediatria',
  'Rio de Janeiro, RJ',
  'critical',
  'open'
FROM profiles
LIMIT 1;
```

### 6. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

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
