"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";

// ─── Count-up hook ────────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1800, started = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start: number | null = null;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);
  return value;
}

// ─── Stat item ────────────────────────────────────────────────────────────────

function StatItem({
  prefix = "",
  target,
  suffix = "",
  label,
  started,
  decimals = 0,
}: {
  prefix?: string;
  target: number;
  suffix?: string;
  label: string;
  started: boolean;
  decimals?: number;
}) {
  const raw = useCountUp(target * Math.pow(10, decimals), 1800, started);
  const display =
    decimals > 0 ? (raw / Math.pow(10, decimals)).toFixed(1) : raw;
  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className="text-3xl md:text-4xl font-bold text-white"
        style={{ fontFamily: "Fraunces, serif" }}
      >
        {prefix}
        {display}
        {suffix}
      </span>
      <span className="text-sm text-white/80 font-medium">{label}</span>
    </div>
  );
}

// ─── Hero illustration ────────────────────────────────────────────────────────

function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 420 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-md mx-auto"
      aria-hidden="true"
    >
      {/* Background glow circles */}
      <circle cx="210" cy="190" r="160" fill="#1A6B5A" opacity="0.06" />
      <circle cx="210" cy="190" r="120" fill="#1A6B5A" opacity="0.05" />

      {/* Left hand */}
      <path
        d="M60 260 C55 240, 50 210, 58 190 C64 175, 76 168, 90 172 C100 175, 108 184, 112 198 L118 220"
        stroke="#1A6B5A" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
      <path
        d="M112 198 C116 185, 128 180, 140 186 C150 191, 154 204, 150 216 L144 232"
        stroke="#1A6B5A" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
      <path
        d="M150 216 C154 205, 164 200, 174 206 C182 211, 184 222, 180 233"
        stroke="#1A6B5A" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
      <path
        d="M60 260 C62 275, 74 290, 90 294 C106 298, 122 292, 134 280 L180 233"
        stroke="#1A6B5A" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="#1A6B5A" fillOpacity="0.08"
      />

      {/* Right hand (mirror) */}
      <path
        d="M360 260 C365 240, 370 210, 362 190 C356 175, 344 168, 330 172 C320 175, 312 184, 308 198 L302 220"
        stroke="#1A6B5A" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
      <path
        d="M308 198 C304 185, 292 180, 280 186 C270 191, 266 204, 270 216 L276 232"
        stroke="#1A6B5A" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
      <path
        d="M270 216 C266 205, 256 200, 246 206 C238 211, 236 222, 240 233"
        stroke="#1A6B5A" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
      <path
        d="M360 260 C358 275, 346 290, 330 294 C314 298, 298 292, 286 280 L240 233"
        stroke="#1A6B5A" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="#1A6B5A" fillOpacity="0.08"
      />

      {/* Heart shape */}
      <path
        d="M210 155 C210 155, 175 130, 160 148 C145 165, 155 185, 180 200 L210 222 L240 200 C265 185, 275 165, 260 148 C245 130, 210 155, 210 155 Z"
        fill="#1A6B5A" fillOpacity="0.13" stroke="#1A6B5A" strokeWidth="2.5"
      />

      {/* Pulse line inside heart */}
      <path
        d="M172 176 L183 176 L190 160 L200 192 L208 170 L214 176 L222 176 L229 168 L236 176 L248 176"
        stroke="#F4845F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />

      {/* Accent dot at top */}
      <circle cx="210" cy="128" r="10" fill="#F4845F" opacity="0.85" />
      <circle cx="210" cy="128" r="6" fill="#F4845F" />

      {/* Medical cross */}
      <line x1="210" y1="52" x2="210" y2="76" stroke="#F4845F" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="198" y1="64" x2="222" y2="64" stroke="#F4845F" strokeWidth="3.5" strokeLinecap="round" />

      {/* Decorative dots */}
      <circle cx="120" cy="130" r="5" fill="#2D9E87" opacity="0.4" />
      <circle cx="100" cy="160" r="3" fill="#F4845F" opacity="0.4" />
      <circle cx="300" cy="130" r="5" fill="#2D9E87" opacity="0.4" />
      <circle cx="320" cy="160" r="3" fill="#F4845F" opacity="0.4" />
      <circle cx="160" cy="90" r="4" fill="#1A6B5A" opacity="0.25" />
      <circle cx="258" cy="90" r="4" fill="#1A6B5A" opacity="0.25" />

      {/* Bottom arc */}
      <path d="M140 310 Q210 330 280 310" stroke="#D6E8E3" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// ─── Feature card ─────────────────────────────────────────────────────────────

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div
      className="bg-white rounded-2xl px-6 py-8 flex flex-col items-start gap-4 transition-all duration-200 hover:-translate-y-1 cursor-default"
      style={{ boxShadow: "0 4px 24px rgba(26,107,90,0.08)" }}
    >
      <div className="w-12 h-12 rounded-2xl bg-[#E6F4F1] flex items-center justify-center text-2xl">
        {icon}
      </div>
      <div>
        <h3
          className="text-lg font-semibold text-text-main mb-1.5"
          style={{ fontFamily: "Fraunces, serif" }}
        >
          {title}
        </h3>
        <p className="text-sm text-text-muted leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// ─── Testimonial card ─────────────────────────────────────────────────────────

function TestimonialCard({
  quote,
  name,
  role,
  initials,
  color,
}: {
  quote: string;
  name: string;
  role: string;
  initials: string;
  color: string;
}) {
  return (
    <div
      className="bg-white rounded-2xl px-7 py-7 flex flex-col gap-5 transition-all duration-200 hover:-translate-y-1"
      style={{ boxShadow: "0 4px 24px rgba(26,107,90,0.08)" }}
    >
      <span
        className="text-5xl text-primary/20 font-bold select-none"
        style={{ fontFamily: "Fraunces, serif", lineHeight: "0.8" }}
        aria-hidden="true"
      >
        &ldquo;
      </span>
      <p className="text-sm text-text-main leading-relaxed -mt-2">{quote}</p>
      <div className="flex items-center gap-3 mt-auto">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
          style={{ background: color }}
        >
          {initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-text-main leading-tight">{name}</p>
          <p className="text-xs text-text-muted">{role}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-surface text-text-main">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-[#D6E8E3]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link href="/" aria-label="Cuida — início">
            <Logo size="md" />
          </Link>
          <nav className="flex items-center gap-3" aria-label="Ações principais">
            <Link
              href="/auth/login"
              className="px-4 py-2 rounded-xl text-sm font-medium text-primary border border-[#D6E8E3] hover:border-primary hover:bg-[#E6F4F1] transition-all duration-200"
              aria-label="Entrar na conta"
            >
              Entrar
            </Link>
            <Link
              href="/auth/register"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-accent hover:bg-[#E8704F] transition-all duration-200 active:scale-95"
              aria-label="Começar a usar o Cuida"
            >
              Começar agora
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12 md:gap-8">
        <div className="flex-1 flex flex-col gap-6 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E6F4F1] text-primary text-xs font-medium w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-light animate-pulse" />
            Plataforma de saúde colaborativa
          </div>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-text-main leading-tight"
            style={{ fontFamily: "Fraunces, serif", letterSpacing: "-0.02em" }}
          >
            Cuidar é um{" "}
            <span className="text-primary">ato de amor.</span>
          </h1>
          <p className="text-lg text-text-muted leading-relaxed max-w-lg">
            Conectamos quem cuida com quem precisa. Uma rede de médicos
            voluntários, pacientes e doadores unidos pela saúde e pela
            solidariedade.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-accent hover:bg-[#E8704F] transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              aria-label="Criar conta no Cuida"
            >
              Quero me cadastrar
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-medium text-primary border border-[#D6E8E3] hover:border-primary hover:bg-[#E6F4F1] transition-all duration-200"
              aria-label="Saiba mais sobre o Cuida"
            >
              Saiba mais
            </a>
          </div>
        </div>
        <div className="flex-1 flex justify-center items-center w-full max-w-sm md:max-w-none">
          <HeroIllustration />
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section ref={statsRef} className="bg-primary" aria-label="Nossos números">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <StatItem
              target={120}
              suffix="+"
              label="médicos voluntários"
              started={statsVisible}
            />
            <StatItem
              target={340}
              label="famílias ajudadas"
              started={statsVisible}
            />
            <StatItem
              prefix="R$"
              target={24}
              suffix="M arrecadados"
              label="em campanhas de saúde"
              started={statsVisible}
              decimals={1}
            />
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section
        id="features"
        className="max-w-6xl mx-auto px-4 sm:px-6 py-20"
        aria-labelledby="features-heading"
      >
        <div className="text-center mb-12">
          <h2
            id="features-heading"
            className="text-3xl md:text-4xl font-semibold text-text-main mb-3"
            style={{ fontFamily: "Fraunces, serif" }}
          >
            Tudo que você precisa, em um só lugar
          </h2>
          <p className="text-text-muted text-base max-w-xl mx-auto">
            O Cuida une tecnologia e solidariedade para transformar o acesso à
            saúde no Brasil.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon="🩺"
            title="Conectar"
            description="Médicos voluntários e pacientes se encontram de forma simples, segura e humana. Agende consultas e receba orientação especializada."
          />
          <FeatureCard
            icon="💚"
            title="Arrecadar"
            description="Crie campanhas de saúde e conte sua história. Receba apoio financeiro da comunidade para tratamentos, cirurgias e medicamentos."
          />
          <FeatureCard
            icon="🤝"
            title="Doar"
            description="Apoie campanhas reais de pessoas que precisam de ajuda. Cada contribuição, pequena ou grande, faz uma diferença enorme."
          />
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section
        className="bg-[#E6F4F1] py-20"
        aria-labelledby="testimonials-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2
              id="testimonials-heading"
              className="text-3xl md:text-4xl font-semibold text-text-main mb-3"
              style={{ fontFamily: "Fraunces, serif" }}
            >
              Histórias que inspiram
            </h2>
            <p className="text-text-muted text-base">
              Quem usa o Cuida transforma vidas — inclusive a sua.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <TestimonialCard
              quote="Minha filha precisava de uma cirurgia urgente e não tínhamos condições. Em menos de três semanas, a campanha no Cuida arrecadou tudo. Chorei de gratidão."
              name="Ana Paula Ferreira"
              role="Paciente, São Paulo"
              initials="AP"
              color="#1A6B5A"
            />
            <TestimonialCard
              quote="Como cardiologista, sempre quis ajudar mais além do consultório. O Cuida me conectou com pacientes que realmente precisavam do meu suporte. É muito gratificante."
              name="Dr. Rodrigo Mendes"
              role="Cardiologista voluntário, Rio de Janeiro"
              initials="RM"
              color="#F4845F"
            />
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h2
          className="text-3xl md:text-4xl font-semibold text-text-main mb-4"
          style={{ fontFamily: "Fraunces, serif" }}
        >
          Pronto para fazer parte?
        </h2>
        <p className="text-text-muted text-base mb-8 max-w-md mx-auto">
          Junte-se a milhares de pessoas que estão mudando o cuidado em saúde
          no Brasil.
        </p>
        <Link
          href="/auth/register"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white bg-accent hover:bg-[#E8704F] transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          aria-label="Criar conta gratuita no Cuida"
        >
          Quero me cadastrar gratuitamente →
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#1C2B27] py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Logo light size="md" />
            <p className="text-sm text-white/60">
              Conectando quem cuida com quem precisa
            </p>
          </div>
          <nav
            className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/60"
            aria-label="Links do rodapé"
          >
            <Link href="/requests" className="hover:text-white transition-colors">Pedidos</Link>
            <Link href="/campaigns" className="hover:text-white transition-colors">Campanhas</Link>
            <Link href="/auth/register" className="hover:text-white transition-colors">Cadastrar</Link>
            <Link href="/auth/login" className="hover:text-white transition-colors">Entrar</Link>
          </nav>
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Cuida. Feito com 💚 no Brasil.
          </p>
        </div>
      </footer>

    </div>
  );
}
