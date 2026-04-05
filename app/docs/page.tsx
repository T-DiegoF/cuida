"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";

type Lang = "pt-BR" | "es";

const content: Record<Lang, {
  lang: string;
  title: string;
  subtitle: string;
  sections: { id: string; title: string; content: React.ReactNode }[];
}> = {
  "pt-BR": {
    lang: "Português",
    title: "Documentação do Cuida",
    subtitle: "Guia completo para configurar, usar e contribuir com a plataforma",
    sections: [
      {
        id: "sobre",
        title: "Sobre o Cuida",
        content: (
          <div className="space-y-3 text-sm text-[#1C2B27] leading-relaxed">
            <p>O <strong>Cuida</strong> é uma plataforma social de saúde que conecta médicos voluntários, pacientes e doadores no Brasil.</p>
            <ul className="list-disc list-inside space-y-1.5 ml-2">
              <li><strong>Pacientes</strong> criam pedidos de assistência médica e campanhas de arrecadação</li>
              <li><strong>Médicos voluntários</strong> respondem aos pedidos e oferecem orientação gratuita</li>
              <li><strong>Doadores</strong> apoiam campanhas de saúde com qualquer valor</li>
            </ul>
            <p>Construído com <strong>Next.js 14</strong> (App Router), <strong>Tailwind CSS</strong> e <strong>Supabase</strong>.</p>
          </div>
        ),
      },
      {
        id: "stack",
        title: "Tecnologias",
        content: (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#E6F4F1]">
                  <th className="text-left px-4 py-2 rounded-tl-lg font-semibold text-[#1A6B5A]">Tecnologia</th>
                  <th className="text-left px-4 py-2 rounded-tr-lg font-semibold text-[#1A6B5A]">Uso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D6E8E3]">
                {[
                  ["Next.js 14", "Framework React com App Router"],
                  ["TypeScript", "Tipagem estática"],
                  ["Tailwind CSS", "Estilização utilitária"],
                  ["Supabase", "Banco de dados + autenticação"],
                  ["Lucide React", "Ícones"],
                  ["Fraunces", "Fonte display (headings)"],
                  ["DM Sans", "Fonte body"],
                ].map(([tech, uso]) => (
                  <tr key={tech} className="hover:bg-[#F8FAF9]">
                    <td className="px-4 py-2.5 font-medium text-[#1C2B27]">{tech}</td>
                    <td className="px-4 py-2.5 text-[#6B8A82]">{uso}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ),
      },
      {
        id: "setup",
        title: "Configuração",
        content: (
          <div className="space-y-5 text-sm">
            <Step n={1} title="Clonar o repositório">
              <Code>{"git clone <seu-repositorio>\ncd cuida\nnpm install"}</Code>
            </Step>
            <Step n={2} title="Criar projeto no Supabase">
              <p className="text-[#6B8A82]">Acesse <strong>supabase.com</strong>, crie um projeto e copie a <strong>Project URL</strong> e a <strong>anon key</strong> em Settings → API.</p>
            </Step>
            <Step n={3} title="Configurar variáveis de ambiente">
              <Code>{"NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ..."}</Code>
            </Step>
            <Step n={4} title="Iniciar o servidor">
              <Code>{"npm run dev"}</Code>
              <p className="text-[#6B8A82] mt-2">Acesse <strong>http://localhost:3000</strong></p>
            </Step>
          </div>
        ),
      },
      {
        id: "rotas",
        title: "Rotas da aplicação",
        content: (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#E6F4F1]">
                  <th className="text-left px-4 py-2 font-semibold text-[#1A6B5A]">Rota</th>
                  <th className="text-left px-4 py-2 font-semibold text-[#1A6B5A]">Descrição</th>
                  <th className="text-left px-4 py-2 font-semibold text-[#1A6B5A]">Acesso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D6E8E3]">
                {[
                  ["/", "Landing page", "Público"],
                  ["/auth/login", "Login", "Público"],
                  ["/auth/register", "Cadastro com seleção de papel", "Público"],
                  ["/dashboard", "Redireciona por papel", "Autenticado"],
                  ["/dashboard/patient", "Dashboard do paciente", "Paciente"],
                  ["/dashboard/doctor", "Dashboard do médico", "Médico"],
                  ["/dashboard/donor", "Dashboard do doador", "Doador"],
                  ["/requests", "Lista de pedidos médicos", "Público"],
                  ["/requests/[id]", "Detalhe do pedido", "Público"],
                  ["/requests/new", "Criar pedido", "Paciente"],
                  ["/campaigns", "Lista de campanhas", "Público"],
                  ["/campaigns/[id]", "Detalhe + doação", "Público"],
                  ["/campaigns/new", "Criar campanha", "Paciente"],
                ].map(([rota, desc, acesso]) => (
                  <tr key={rota} className="hover:bg-[#F8FAF9]">
                    <td className="px-4 py-2.5 font-mono text-xs text-[#1A6B5A]">{rota}</td>
                    <td className="px-4 py-2.5 text-[#1C2B27]">{desc}</td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        acesso === "Público" ? "bg-[#E6F4F1] text-[#1A6B5A]" : "bg-[#FDE8DF] text-[#F4845F]"
                      }`}>{acesso}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ),
      },
      {
        id: "cores",
        title: "Paleta de cores",
        content: (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: "primary", hex: "#1A6B5A", desc: "Verde médico — ações principais" },
              { name: "primary-light", hex: "#2D9E87", desc: "Verde claro — hover" },
              { name: "accent", hex: "#F4845F", desc: "Coral — CTAs, urgência" },
              { name: "accent-soft", hex: "#FDE8DF", desc: "Coral suave — backgrounds" },
              { name: "surface", hex: "#F8FAF9", desc: "Background das páginas" },
              { name: "text-main", hex: "#1C2B27", desc: "Texto principal" },
              { name: "text-muted", hex: "#6B8A82", desc: "Texto secundário" },
              { name: "border", hex: "#D6E8E3", desc: "Bordas e divisores" },
            ].map(({ name, hex, desc }) => (
              <div key={name} className="flex items-center gap-3 p-3 rounded-xl border border-[#D6E8E3] bg-white">
                <div className="w-10 h-10 rounded-lg flex-shrink-0 border border-[#D6E8E3]" style={{ backgroundColor: hex }} />
                <div>
                  <p className="text-xs font-mono font-semibold text-[#1C2B27]">{hex}</p>
                  <p className="text-xs text-[#6B8A82]">{name} — {desc}</p>
                </div>
              </div>
            ))}
          </div>
        ),
      },
      {
        id: "usuarios",
        title: "Usuários de teste",
        content: (
          <div className="space-y-4 text-sm">
            {[
              { role: "🏥 Paciente", email: "paciente@cuida.com", password: "Cuidar@2024", color: "bg-[#E6F4F1] text-[#1A6B5A]" },
              { role: "🩺 Médico", email: "rodrigo.mendes.dr@yopmail.com", password: "Cuidar@2024", color: "bg-[#FDE8DF] text-[#F4845F]" },
              { role: "💚 Doador", email: "carlos.lima.doador@yopmail.com", password: "Cuidar@2024", color: "bg-[#E8F5E9] text-[#27AE60]" },
            ].map(({ role, email, password, color }) => (
              <div key={email} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border border-[#D6E8E3] bg-white">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold w-fit ${color}`}>{role}</span>
                <div className="flex-1">
                  <p className="font-mono text-xs text-[#1C2B27]">{email}</p>
                  <p className="font-mono text-xs text-[#6B8A82] mt-0.5">Senha: {password}</p>
                </div>
              </div>
            ))}
            <p className="text-xs text-[#6B8A82]">Use as credenciais acima para explorar a plataforma com cada perfil de usuário.</p>
          </div>
        ),
      },
    ],
  },
  "es": {
    lang: "Español",
    title: "Documentación de Cuida",
    subtitle: "Guía completa para configurar, usar y contribuir con la plataforma",
    sections: [
      {
        id: "sobre",
        title: "Sobre Cuida",
        content: (
          <div className="space-y-3 text-sm text-[#1C2B27] leading-relaxed">
            <p><strong>Cuida</strong> es una plataforma social de salud que conecta médicos voluntarios, pacientes y donantes en Brasil.</p>
            <ul className="list-disc list-inside space-y-1.5 ml-2">
              <li><strong>Pacientes</strong> crean solicitudes de asistencia médica y campañas de recaudación</li>
              <li><strong>Médicos voluntarios</strong> responden a las solicitudes y ofrecen orientación gratuita</li>
              <li><strong>Donantes</strong> apoyan campañas de salud con cualquier monto</li>
            </ul>
            <p>Construido con <strong>Next.js 14</strong> (App Router), <strong>Tailwind CSS</strong> y <strong>Supabase</strong>.</p>
          </div>
        ),
      },
      {
        id: "stack",
        title: "Tecnologías",
        content: (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#E6F4F1]">
                  <th className="text-left px-4 py-2 rounded-tl-lg font-semibold text-[#1A6B5A]">Tecnología</th>
                  <th className="text-left px-4 py-2 rounded-tr-lg font-semibold text-[#1A6B5A]">Uso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D6E8E3]">
                {[
                  ["Next.js 14", "Framework React con App Router"],
                  ["TypeScript", "Tipado estático"],
                  ["Tailwind CSS", "Estilos utilitarios"],
                  ["Supabase", "Base de datos + autenticación"],
                  ["Lucide React", "Íconos"],
                  ["Fraunces", "Fuente display (headings)"],
                  ["DM Sans", "Fuente body"],
                ].map(([tech, uso]) => (
                  <tr key={tech} className="hover:bg-[#F8FAF9]">
                    <td className="px-4 py-2.5 font-medium text-[#1C2B27]">{tech}</td>
                    <td className="px-4 py-2.5 text-[#6B8A82]">{uso}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ),
      },
      {
        id: "setup",
        title: "Configuración",
        content: (
          <div className="space-y-5 text-sm">
            <Step n={1} title="Clonar el repositorio">
              <Code>{"git clone <tu-repositorio>\ncd cuida\nnpm install"}</Code>
            </Step>
            <Step n={2} title="Crear proyecto en Supabase">
              <p className="text-[#6B8A82]">Ve a <strong>supabase.com</strong>, crea un proyecto y copia la <strong>Project URL</strong> y la <strong>anon key</strong> en Settings → API.</p>
            </Step>
            <Step n={3} title="Configurar variables de entorno">
              <Code>{"NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ..."}</Code>
            </Step>
            <Step n={4} title="Iniciar el servidor">
              <Code>{"npm run dev"}</Code>
              <p className="text-[#6B8A82] mt-2">Abre <strong>http://localhost:3000</strong></p>
            </Step>
          </div>
        ),
      },
      {
        id: "rutas",
        title: "Rutas de la aplicación",
        content: (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#E6F4F1]">
                  <th className="text-left px-4 py-2 font-semibold text-[#1A6B5A]">Ruta</th>
                  <th className="text-left px-4 py-2 font-semibold text-[#1A6B5A]">Descripción</th>
                  <th className="text-left px-4 py-2 font-semibold text-[#1A6B5A]">Acceso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D6E8E3]">
                {[
                  ["/", "Landing page", "Público"],
                  ["/auth/login", "Inicio de sesión", "Público"],
                  ["/auth/register", "Registro con selección de rol", "Público"],
                  ["/dashboard", "Redirige por rol", "Autenticado"],
                  ["/dashboard/patient", "Dashboard del paciente", "Paciente"],
                  ["/dashboard/doctor", "Dashboard del médico", "Médico"],
                  ["/dashboard/donor", "Dashboard del donante", "Donante"],
                  ["/requests", "Lista de solicitudes médicas", "Público"],
                  ["/requests/[id]", "Detalle de solicitud", "Público"],
                  ["/requests/new", "Crear solicitud", "Paciente"],
                  ["/campaigns", "Lista de campañas", "Público"],
                  ["/campaigns/[id]", "Detalle + donación", "Público"],
                  ["/campaigns/new", "Crear campaña", "Paciente"],
                ].map(([ruta, desc, acceso]) => (
                  <tr key={ruta} className="hover:bg-[#F8FAF9]">
                    <td className="px-4 py-2.5 font-mono text-xs text-[#1A6B5A]">{ruta}</td>
                    <td className="px-4 py-2.5 text-[#1C2B27]">{desc}</td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        acceso === "Público" ? "bg-[#E6F4F1] text-[#1A6B5A]" : "bg-[#FDE8DF] text-[#F4845F]"
                      }`}>{acceso}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ),
      },
      {
        id: "colores",
        title: "Paleta de colores",
        content: (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: "primary", hex: "#1A6B5A", desc: "Verde médico — acciones principales" },
              { name: "primary-light", hex: "#2D9E87", desc: "Verde claro — hover" },
              { name: "accent", hex: "#F4845F", desc: "Coral — CTAs, urgencia" },
              { name: "accent-soft", hex: "#FDE8DF", desc: "Coral suave — backgrounds" },
              { name: "surface", hex: "#F8FAF9", desc: "Background de páginas" },
              { name: "text-main", hex: "#1C2B27", desc: "Texto principal" },
              { name: "text-muted", hex: "#6B8A82", desc: "Texto secundario" },
              { name: "border", hex: "#D6E8E3", desc: "Bordes y divisores" },
            ].map(({ name, hex, desc }) => (
              <div key={name} className="flex items-center gap-3 p-3 rounded-xl border border-[#D6E8E3] bg-white">
                <div className="w-10 h-10 rounded-lg flex-shrink-0 border border-[#D6E8E3]" style={{ backgroundColor: hex }} />
                <div>
                  <p className="text-xs font-mono font-semibold text-[#1C2B27]">{hex}</p>
                  <p className="text-xs text-[#6B8A82]">{name} — {desc}</p>
                </div>
              </div>
            ))}
          </div>
        ),
      },
      {
        id: "usuarios",
        title: "Usuarios de prueba",
        content: (
          <div className="space-y-4 text-sm">
            {[
              { role: "🏥 Paciente", email: "paciente@cuida.com", password: "Cuidar@2024", color: "bg-[#E6F4F1] text-[#1A6B5A]" },
              { role: "🩺 Médico", email: "rodrigo.mendes.dr@yopmail.com", password: "Cuidar@2024", color: "bg-[#FDE8DF] text-[#F4845F]" },
              { role: "💚 Donante", email: "carlos.lima.doador@yopmail.com", password: "Cuidar@2024", color: "bg-[#E8F5E9] text-[#27AE60]" },
            ].map(({ role, email, password, color }) => (
              <div key={email} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border border-[#D6E8E3] bg-white">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold w-fit ${color}`}>{role}</span>
                <div className="flex-1">
                  <p className="font-mono text-xs text-[#1C2B27]">{email}</p>
                  <p className="font-mono text-xs text-[#6B8A82] mt-0.5">Contraseña: {password}</p>
                </div>
              </div>
            ))}
            <p className="text-xs text-[#6B8A82]">Usa las credenciales de arriba para explorar la plataforma con cada perfil.</p>
          </div>
        ),
      },
    ],
  },
};

function Code({ children }: { children: string }) {
  return (
    <pre className="bg-[#1C2B27] text-[#E6F4F1] text-xs rounded-xl p-4 overflow-x-auto leading-relaxed mt-2">
      <code>{children}</code>
    </pre>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
        {n}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-[#1C2B27] mb-1">{title}</p>
        {children}
      </div>
    </div>
  );
}

export default function DocsPage() {
  const [lang, setLang] = useState<Lang>("pt-BR");
  const [activeSection, setActiveSection] = useState("sobre");
  const c = content[lang];

  return (
    <div className="min-h-screen bg-[#F8FAF9]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-[#D6E8E3]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link href="/" aria-label="Voltar ao início">
            <Logo size="md" />
          </Link>
          <div className="flex items-center gap-2">
            {(["pt-BR", "es"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  lang === l
                    ? "bg-primary text-white"
                    : "bg-[#E6F4F1] text-primary hover:bg-primary hover:text-white"
                }`}
              >
                {l === "pt-BR" ? "🇧🇷 PT" : "🇪🇸 ES"}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col lg:flex-row gap-8">
        {/* Sidebar nav */}
        <aside className="lg:w-56 flex-shrink-0">
          <div className="sticky top-24">
            <p className="text-xs font-semibold text-[#6B8A82] uppercase tracking-wider mb-3">
              {lang === "pt-BR" ? "Navegação" : "Navegación"}
            </p>
            <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {c.sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveSection(s.id);
                    document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`
                    flex-shrink-0 text-left px-3 py-2 rounded-xl text-sm transition-all duration-200
                    ${activeSection === s.id
                      ? "bg-[#E6F4F1] text-primary font-semibold border-l-2 border-primary"
                      : "text-[#6B8A82] hover:bg-white hover:text-[#1C2B27]"
                    }
                  `}
                >
                  {s.title}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          {/* Page title */}
          <div className="mb-8">
            <h1
              className="text-3xl md:text-4xl font-semibold text-[#1C2B27] mb-2"
              style={{ fontFamily: "Fraunces, serif" }}
            >
              {c.title}
            </h1>
            <p className="text-[#6B8A82]">{c.subtitle}</p>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {c.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="bg-white rounded-2xl p-6 scroll-mt-24"
                style={{ boxShadow: "0 4px 24px rgba(26,107,90,0.08)" }}
              >
                <h2
                  className="text-lg font-semibold text-[#1C2B27] mb-4"
                  style={{ fontFamily: "Fraunces, serif" }}
                >
                  {section.title}
                </h2>
                {section.content}
              </section>
            ))}
          </div>

          {/* Back to app */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-[#2D9E87] transition-all duration-200"
            >
              {lang === "pt-BR" ? "← Voltar para o Cuida" : "← Volver al Cuida"}
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
