"use client";

import { useState, FormEvent, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/ui/Logo";

const SUPABASE_ERROR_MAP: Record<string, string> = {
  "Invalid login credentials": "E-mail ou senha incorretos. Tente novamente.",
  "Email not confirmed": "Confirme seu e-mail antes de entrar.",
  "Too many requests": "Muitas tentativas. Aguarde um momento e tente novamente.",
  "User not found": "Nenhuma conta encontrada com esse e-mail.",
};

function translateError(msg: string): string {
  for (const [key, value] of Object.entries(SUPABASE_ERROR_MAP)) {
    if (msg.includes(key)) return value;
  }
  return "Algo deu errado. Tente novamente.";
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError) {
      setError(translateError(authError.message));
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <div className="w-full max-w-md animate-fade-up">
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
            Bem-vindo de volta
          </h1>
          <p className="text-sm text-text-muted">
            Entre na sua conta para continuar cuidando
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-[#FDE8DF] border border-[#F4845F]/30 text-sm text-[#C0392B]">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
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
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-text-main">
                Senha
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-xs text-primary hover:text-primary-light transition-colors"
              >
                Esqueci minha senha
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !email || !password}
            aria-label="Entrar na conta"
            className="
              flex items-center justify-center gap-2
              w-full py-3 rounded-xl text-sm font-semibold text-white
              bg-primary hover:bg-primary-light
              transition-all duration-200
              active:scale-[0.97]
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
              mt-1
            "
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </button>
        </form>

        {/* Register link */}
        <p className="text-center text-sm text-text-muted">
          Não tem conta?{" "}
          <Link
            href="/auth/register"
            className="text-primary font-medium hover:text-primary-light transition-colors"
          >
            Cadastre-se gratuitamente
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface" />}>
      <LoginForm />
    </Suspense>
  );
}
