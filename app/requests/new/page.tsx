"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRequests } from "@/lib/hooks/useRequests";
import PageWrapper from "@/components/layout/PageWrapper";
import { ToastContainer, useToast } from "@/components/ui/Toast";
import { UrgencyLevel } from "@/types/database";

const SPECIALTIES = [
  "Cardiologia", "Pediatria", "Clínica Geral", "Neurologia",
  "Ortopedia", "Oncologia", "Psiquiatria", "Ginecologia",
  "Dermatologia", "Endocrinologia", "Outra",
];

const URGENCY_OPTIONS: { value: UrgencyLevel; label: string; description: string }[] = [
  { value: "low", label: "Baixa", description: "Pode esperar algumas semanas" },
  { value: "medium", label: "Média", description: "Preciso de ajuda em alguns dias" },
  { value: "high", label: "Alta", description: "Preciso de ajuda o quanto antes" },
  { value: "critical", label: "Crítico", description: "Situação urgente, risco de saúde" },
];

const URGENCY_COLORS: Record<UrgencyLevel, string> = {
  low: "border-[#27AE60] bg-[#E8F5E9] text-[#27AE60]",
  medium: "border-[#F39C12] bg-[#FFF8E1] text-[#F39C12]",
  high: "border-[#E67E22] bg-[#FFF3E0] text-[#E67E22]",
  critical: "border-[#C0392B] bg-[#FEECEC] text-[#C0392B]",
};

const inputClass = `
  w-full px-4 py-3 rounded-xl text-sm text-text-main bg-white
  border border-[#D6E8E3] outline-none
  placeholder:text-text-muted
  transition-all duration-200
  focus:border-primary focus:ring-2 focus:ring-primary/20
  disabled:opacity-60 disabled:cursor-not-allowed
`;

const labelClass = "text-sm font-medium text-text-main";

export default function NewRequestPage() {
  const router = useRouter();
  const { profile, role, signOut } = useAuth();
  const { create } = useRequests();
  const { toasts, toast, dismiss } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [location, setLocation] = useState(profile?.location ?? "");
  const [urgency, setUrgency] = useState<UrgencyLevel>("medium");
  const [loading, setLoading] = useState(false);

  // Patients only guard
  if (role && role !== "patient") {
    return (
      <PageWrapper showNav isLoggedIn userName={profile?.full_name ?? undefined} userRole={role} onSignOut={signOut}>
        <div className="flex flex-col items-center py-20 text-center">
          <p className="text-4xl mb-4">🚫</p>
          <h2 className="text-lg font-semibold text-text-main mb-2" style={{ fontFamily: "Fraunces, serif" }}>
            Área exclusiva para pacientes
          </h2>
          <p className="text-sm text-text-muted mb-6">
            Apenas pacientes podem criar pedidos de assistência médica.
          </p>
          <Link href="/requests" className="px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary-light transition-all duration-200">
            Ver pedidos existentes
          </Link>
        </div>
      </PageWrapper>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!profile?.id) return;

    setLoading(true);
    const result = await create({
      patient_id: profile.id,
      title: title.trim(),
      description: description.trim() || null,
      specialty_needed: specialty || null,
      location: location.trim() || null,
      urgency,
      status: "open",
    });

    if (!result) {
      toast("Algo deu errado ao publicar o pedido. Tente novamente.", "error");
      setLoading(false);
      return;
    }

    toast("Pedido publicado com sucesso! 💚", "success");
    setTimeout(() => router.push("/requests"), 1200);
  }

  const isValid = title.trim().length >= 5;

  return (
    <PageWrapper
      showNav
      isLoggedIn={!!profile}
      userName={profile?.full_name ?? undefined}
      userRole={role ?? undefined}
      avatarUrl={profile?.avatar_url ?? undefined}
      onSignOut={signOut}
    >
      <ToastContainer toasts={toasts} onDismiss={dismiss} />

      {/* Back */}
      <div className="mb-6">
        <Link
          href="/requests"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors"
          aria-label="Voltar para pedidos"
        >
          <ArrowLeft size={16} />
          Voltar para pedidos
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Page header */}
        <div className="mb-6">
          <h1
            className="text-2xl md:text-3xl font-semibold text-text-main"
            style={{ fontFamily: "Fraunces, serif" }}
          >
            Novo pedido de assistência
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Descreva sua necessidade para conectar com médicos voluntários.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 md:p-8 flex flex-col gap-6"
          style={{ boxShadow: "0 4px 24px rgba(26,107,90,0.08)" }}
          noValidate
        >
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className={labelClass}>
              Título do pedido <span className="text-accent" aria-hidden="true">*</span>
            </label>
            <input
              id="title"
              type="text"
              required
              minLength={5}
              maxLength={120}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Preciso de orientação em cardiologia"
              disabled={loading}
              className={inputClass}
              aria-describedby="title-hint"
            />
            <p id="title-hint" className="text-xs text-text-muted">
              {title.length}/120 — seja claro e direto
            </p>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className={labelClass}>
              Descrição
            </label>
            <textarea
              id="description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva sua situação, histórico médico relevante, sintomas ou o que precisa..."
              disabled={loading}
              className={`${inputClass} resize-none leading-relaxed`}
            />
            <p className="text-xs text-text-muted">
              Quanto mais detalhes, mais fácil para o médico entender sua história.
            </p>
          </div>

          {/* Specialty */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="specialty" className={labelClass}>
              Especialidade necessária
            </label>
            <select
              id="specialty"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              disabled={loading}
              className={inputClass}
              aria-label="Selecionar especialidade médica"
            >
              <option value="">Selecione (opcional)</option>
              {SPECIALTIES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="location" className={labelClass}>
              Localização
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: São Paulo, SP"
              disabled={loading}
              className={inputClass}
            />
          </div>

          {/* Urgency */}
          <div className="flex flex-col gap-2">
            <p className={labelClass}>
              Nível de urgência <span className="text-accent" aria-hidden="true">*</span>
            </p>
            <div
              className="grid grid-cols-2 gap-2"
              role="radiogroup"
              aria-label="Selecionar urgência"
            >
              {URGENCY_OPTIONS.map(({ value, label, description }) => {
                const active = urgency === value;
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setUrgency(value)}
                    disabled={loading}
                    className={`
                      flex flex-col items-start gap-0.5 p-4 rounded-xl border-2 text-left
                      transition-all duration-200
                      ${active
                        ? `${URGENCY_COLORS[value]} border-current`
                        : "border-[#D6E8E3] bg-white hover:border-primary/40"
                      }
                    `}
                  >
                    <span className={`text-sm font-semibold ${active ? "" : "text-text-main"}`}>
                      {label}
                    </span>
                    <span className={`text-xs leading-relaxed ${active ? "opacity-80" : "text-text-muted"}`}>
                      {description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-[#D6E8E3]">
            <button
              type="submit"
              disabled={loading || !isValid}
              aria-label="Publicar pedido de assistência"
              className="
                flex items-center justify-center gap-2
                flex-1 py-3 rounded-xl text-sm font-semibold text-white
                bg-primary hover:bg-primary-light
                transition-all duration-200 active:scale-[0.97]
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
              "
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Publicando...
                </>
              ) : (
                "Publicar pedido"
              )}
            </button>
            <Link
              href="/requests"
              className="flex items-center justify-center px-5 py-3 rounded-xl text-sm font-medium text-text-muted border border-[#D6E8E3] hover:border-primary hover:text-primary transition-all duration-200"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
}
