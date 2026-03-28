"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, AlertCircle, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/ui/Logo";
import { UserRole } from "@/types/database";

// ─── Role selector cards ───────────────────────────────────────────────────────

interface RoleCard {
  role: UserRole;
  emoji: string;
  title: string;
  subtitle: string;
}

const roleCards: RoleCard[] = [
  {
    role: "patient",
    emoji: "🏥",
    title: "Preciso de ajuda",
    subtitle: "Busco suporte médico ou recursos para minha saúde",
  },
  {
    role: "doctor",
    emoji: "🩺",
    title: "Quero ajudar",
    subtitle: "Sou profissional de saúde e quero oferecer meu apoio",
  },
  {
    role: "donor",
    emoji: "💚",
    title: "Quero doar",
    subtitle: "Quero contribuir com campanhas de saúde",
  },
];

// ─── Error translation ─────────────────────────────────────────────────────────

const SUPABASE_ERROR_MAP: Record<string, string> = {
  "User already registered": "Este e-mail já possui uma conta. Tente entrar.",
  "Password should be at least 6 characters":
    "A senha precisa ter pelo menos 6 caracteres.",
  "Unable to validate email address": "Endereço de e-mail inválido.",
  "Signup is disabled": "O cadastro está temporariamente indisponível.",
};

function translateError(msg: string): string {
  for (const [key, value] of Object.entries(SUPABASE_ERROR_MAP)) {
    if (msg.includes(key)) return value;
  }
  return "Algo deu errado. Tente novamente.";
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  function handleRoleSelect(role: UserRole) {
    setSelectedRole(role);
    setError(null);
  }

  function handleNextStep() {
    if (!selectedRole) {
      setError("Escolha um perfil para continuar.");
      return;
    }
    setError(null);
    setStep(2);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!selectedRole) {
      setStep(1);
      return;
    }

    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    // 1. Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName.trim(), role: selectedRole },
      },
    });

    if (authError) {
      setError(translateError(authError.message));
      setLoading(false);
      return;
    }

    const userId = authData.user?.id;
    if (!userId) {
      setError("Não foi possível criar a conta. Tente novamente.");
      setLoading(false);
      return;
    }

    // 2. Insert into profiles table
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: profileError } = await (supabase as any)
      .from("profiles")
      .upsert({
        id: userId,
        full_name: fullName.trim(),
        role: selectedRole,
        avatar_url: null,
        specialty: null,
        location: null,
        bio: null,
      });

    if (profileError) {
      console.error("Erro ao criar perfil:", profileError.message);
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="w-full max-w-lg animate-fade-up">
      {/* Card */}
      <div
        className="bg-white rounded-2xl px-8 py-10 flex flex-col gap-6"
        style={{ boxShadow: "0 4px 24px rgba(26,107,90,0.08)" }}
      >
        {/* Logo */}
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>

        {/* Heading */}
        <div className="text-center space-y-1">
          <h1
            className="text-2xl font-semibold text-text-main"
            style={{ fontFamily: "Fraunces, serif" }}
          >
            {step === 1 ? "Como você quer participar?" : "Crie sua conta"}
          </h1>
          <p className="text-sm text-text-muted">
            {step === 1
              ? "Escolha o perfil que melhor descreve você"
              : "Bem-vindo ao Cuida 💚 Vamos começar?"}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 justify-center">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`
                  w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold
                  transition-all duration-300
                  ${
                    step >= s
                      ? "bg-primary text-white"
                      : "bg-[#D6E8E3] text-text-muted"
                  }
                `}
              >
                {step > s ? <Check size={12} /> : s}
              </div>
              {s < 2 && (
                <div
                  className={`w-12 h-0.5 rounded-full transition-all duration-300 ${
                    step > s ? "bg-primary" : "bg-[#D6E8E3]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Error banner */}
        {error && (
          <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-[#FDE8DF] border border-[#F4845F]/30 text-sm text-[#C0392B]">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* ── Step 1: Role selector ── */}
        {step === 1 && (
          <div className="flex flex-col gap-3">
            {roleCards.map(({ role, emoji, title, subtitle }) => {
              const active = selectedRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleSelect(role)}
                  aria-pressed={active}
                  aria-label={`Selecionar perfil: ${title}`}
                  className={`
                    flex items-start gap-4 w-full text-left px-5 py-4 rounded-2xl border-2
                    transition-all duration-200 group
                    ${
                      active
                        ? "border-primary bg-[#E6F4F1]"
                        : "border-[#D6E8E3] bg-white hover:border-primary-light hover:bg-surface"
                    }
                  `}
                >
                  {/* Emoji icon */}
                  <span
                    className={`
                      flex items-center justify-center w-12 h-12 rounded-xl text-2xl flex-shrink-0
                      transition-all duration-200
                      ${active ? "bg-primary/10" : "bg-surface group-hover:bg-primary/5"}
                    `}
                  >
                    {emoji}
                  </span>

                  {/* Text */}
                  <div className="flex-1 min-w-0 pt-1">
                    <p
                      className={`text-sm font-semibold transition-colors duration-200 ${
                        active ? "text-primary" : "text-text-main"
                      }`}
                    >
                      {title}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                      {subtitle}
                    </p>
                  </div>

                  {/* Check indicator */}
                  <div
                    className={`
                      flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1
                      transition-all duration-200
                      ${active ? "border-primary bg-primary" : "border-[#D6E8E3]"}
                    `}
                  >
                    {active && <Check size={10} className="text-white" strokeWidth={3} />}
                  </div>
                </button>
              );
            })}

            <button
              type="button"
              onClick={handleNextStep}
              disabled={!selectedRole}
              aria-label="Continuar para o próximo passo"
              className="
                mt-2 flex items-center justify-center gap-2
                w-full py-3 rounded-xl text-sm font-semibold text-white
                bg-primary hover:bg-primary-light
                transition-all duration-200 active:scale-[0.97]
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
              "
            >
              Continuar
            </button>
          </div>
        )}

        {/* ── Step 2: Account form ── */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            {/* Full name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="fullName" className="text-sm font-medium text-text-main">
                Nome completo
              </label>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Maria da Silva"
                disabled={loading}
                className="
                  w-full px-4 py-3 rounded-xl text-sm text-text-main bg-white
                  border border-[#D6E8E3] outline-none
                  placeholder:text-text-muted
                  transition-all duration-200
                  focus:border-primary focus:ring-2 focus:ring-primary/20
                  disabled:opacity-60 disabled:cursor-not-allowed
                "
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-text-main">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                disabled={loading}
                className="
                  w-full px-4 py-3 rounded-xl text-sm text-text-main bg-white
                  border border-[#D6E8E3] outline-none
                  placeholder:text-text-muted
                  transition-all duration-200
                  focus:border-primary focus:ring-2 focus:ring-primary/20
                  disabled:opacity-60 disabled:cursor-not-allowed
                "
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-text-main">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  disabled={loading}
                  className="
                    w-full px-4 py-3 pr-11 rounded-xl text-sm text-text-main bg-white
                    border border-[#D6E8E3] outline-none
                    placeholder:text-text-muted
                    transition-all duration-200
                    focus:border-primary focus:ring-2 focus:ring-primary/20
                    disabled:opacity-60 disabled:cursor-not-allowed
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-xs text-text-muted">
                {password.length > 0 && password.length < 6
                  ? "Adicione mais " + (6 - password.length) + " caracteres"
                  : "Use pelo menos 6 caracteres"}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2 mt-1">
              <button
                type="submit"
                disabled={loading || !fullName || !email || password.length < 6}
                aria-label="Criar conta"
                className="
                  flex items-center justify-center gap-2
                  w-full py-3 rounded-xl text-sm font-semibold text-white
                  bg-primary hover:bg-primary-light
                  transition-all duration-200 active:scale-[0.97]
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                "
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  "Criar conta 💚"
                )}
              </button>

              <button
                type="button"
                onClick={() => { setStep(1); setError(null); }}
                disabled={loading}
                className="
                  w-full py-2.5 rounded-xl text-sm font-medium text-text-muted
                  hover:text-text-main hover:bg-surface
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                ← Voltar
              </button>
            </div>
          </form>
        )}

        {/* Login link */}
        <p className="text-center text-sm text-text-muted">
          Já tem conta?{" "}
          <Link
            href="/auth/login"
            className="text-primary font-medium hover:text-primary-light transition-colors"
          >
            Entrar
          </Link>
        </p>
      </div>

      {/* Back to home */}
      <p className="text-center mt-6 text-xs text-text-muted">
        <Link href="/" className="hover:text-text-main transition-colors">
          ← Voltar para o início
        </Link>
      </p>
    </div>
  );
}
