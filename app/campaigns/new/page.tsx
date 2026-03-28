"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, ImageIcon } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useCampaigns } from "@/lib/hooks/useCampaigns";
import PageWrapper from "@/components/layout/PageWrapper";
import { ToastContainer, useToast } from "@/components/ui/Toast";
import ProgressBar from "@/components/ui/ProgressBar";

const inputClass = `
  w-full px-4 py-3 rounded-xl text-sm text-text-main bg-white
  border border-[#D6E8E3] outline-none
  placeholder:text-text-muted
  transition-all duration-200
  focus:border-primary focus:ring-2 focus:ring-primary/20
  disabled:opacity-60 disabled:cursor-not-allowed
`;

const labelClass = "text-sm font-medium text-text-main";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  });
}

export default function NewCampaignPage() {
  const router = useRouter();
  const { profile, role, signOut } = useAuth();
  const { create } = useCampaigns();
  const { toasts, toast, dismiss } = useToast();

  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
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
            Apenas pacientes podem criar campanhas de arrecadação.
          </p>
          <Link href="/campaigns" className="px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary-light transition-all duration-200">
            Ver campanhas ativas
          </Link>
        </div>
      </PageWrapper>
    );
  }

  const parsedGoal = parseFloat(goalAmount.replace(",", ".").replace(/[^0-9.]/g, "")) || 0;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!profile?.id) return;
    if (parsedGoal <= 0) {
      toast("Informe um valor de meta válido.", "error");
      return;
    }

    setLoading(true);
    const result = await create({
      patient_id: profile.id,
      title: title.trim(),
      story: story.trim() || null,
      goal_amount: parsedGoal,
      cover_image_url: coverImageUrl.trim() || null,
      status: "active",
    });

    if (!result) {
      toast("Algo deu errado ao publicar a campanha. Tente novamente.", "error");
      setLoading(false);
      return;
    }

    toast("Campanha publicada com sucesso! 💚", "success");
    setTimeout(() => router.push(`/campaigns/${result.id}`), 1200);
  }

  const isValid = title.trim().length >= 5 && parsedGoal > 0;

  // Story completion preview
  const storyWordCount = story.trim() ? story.trim().split(/\s+/).length : 0;
  const storyQuality = Math.min(100, Math.round((storyWordCount / 100) * 100));

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
          href="/campaigns"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors"
          aria-label="Voltar para campanhas"
        >
          <ArrowLeft size={16} />
          Voltar para campanhas
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Page header */}
        <div className="mb-6">
          <h1
            className="text-2xl md:text-3xl font-semibold text-text-main"
            style={{ fontFamily: "Fraunces, serif" }}
          >
            Criar campanha de saúde
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Conte sua história e conecte-se com pessoas que querem ajudar.
          </p>
        </div>

        {/* Tips banner */}
        <div className="bg-[#E6F4F1] rounded-2xl px-5 py-4 mb-6 flex gap-3">
          <span className="text-xl flex-shrink-0">💡</span>
          <div>
            <p className="text-sm font-medium text-primary mb-1">Dica para uma boa campanha</p>
            <p className="text-xs text-text-muted leading-relaxed">
              Campanhas com histórias detalhadas arrecadam até 3x mais. Seja honesto,
              específico e humano. Explique para que o dinheiro será usado.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 md:p-8 flex flex-col gap-6"
          style={{ boxShadow: "0 4px 24px rgba(26,107,90,0.08)" }}
          noValidate
        >
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="camp-title" className={labelClass}>
              Título da campanha <span className="text-accent" aria-hidden="true">*</span>
            </label>
            <input
              id="camp-title"
              type="text"
              required
              minLength={5}
              maxLength={120}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Ajude Ana a realizar sua cirurgia cardíaca"
              disabled={loading}
              className={inputClass}
              aria-describedby="camp-title-hint"
            />
            <p id="camp-title-hint" className="text-xs text-text-muted">
              {title.length}/120 — título claro e emocionalmente envolvente
            </p>
          </div>

          {/* Story */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="camp-story" className={labelClass}>
              Sua história <span className="text-accent" aria-hidden="true">*</span>
            </label>
            <textarea
              id="camp-story"
              rows={8}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Olá! Meu nome é... Estou passando por... Preciso de ajuda para... O dinheiro arrecadado será usado para..."
              disabled={loading}
              className={`${inputClass} resize-none leading-relaxed`}
              aria-describedby="camp-story-quality"
            />
            {/* Story quality indicator */}
            <div id="camp-story-quality">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-text-muted">
                  {storyWordCount} {storyWordCount === 1 ? "palavra" : "palavras"}
                </span>
                <span className={`font-medium ${storyQuality >= 80 ? "text-[#27AE60]" : storyQuality >= 40 ? "text-[#F39C12]" : "text-text-muted"}`}>
                  {storyQuality >= 80 ? "Excelente!" : storyQuality >= 40 ? "Bom — adicione mais detalhes" : "Continue escrevendo..."}
                </span>
              </div>
              <ProgressBar value={storyQuality} showPercent={false} size="sm" />
            </div>
          </div>

          {/* Goal amount */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="camp-goal" className={labelClass}>
              Meta de arrecadação <span className="text-accent" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-text-muted font-medium pointer-events-none">
                R$
              </span>
              <input
                id="camp-goal"
                type="number"
                min="100"
                step="50"
                required
                value={goalAmount}
                onChange={(e) => setGoalAmount(e.target.value)}
                placeholder="0"
                disabled={loading}
                className={`${inputClass} pl-9`}
                aria-describedby="camp-goal-hint"
              />
            </div>
            <p id="camp-goal-hint" className="text-xs text-text-muted">
              {parsedGoal > 0
                ? `Meta: ${formatBRL(parsedGoal)}`
                : "Informe o valor total necessário para o tratamento"}
            </p>
          </div>

          {/* Cover image URL */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="camp-cover" className={labelClass}>
              Imagem de capa
            </label>
            <div className="relative">
              <ImageIcon
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              />
              <input
                id="camp-cover"
                type="url"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="https://... (URL da imagem)"
                disabled={loading}
                className={`${inputClass} pl-9`}
              />
            </div>
            {/* Preview */}
            {coverImageUrl && (
              <div className="mt-2 rounded-xl overflow-hidden h-32 bg-[#E6F4F1]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImageUrl}
                  alt="Preview da capa"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
            <p className="text-xs text-text-muted">
              Cole a URL de uma imagem para ilustrar sua campanha (opcional)
            </p>
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-[#D6E8E3]">
            <button
              type="submit"
              disabled={loading || !isValid}
              aria-label="Publicar campanha"
              className="
                flex items-center justify-center gap-2
                flex-1 py-3 rounded-xl text-sm font-semibold text-white
                bg-accent hover:bg-[#E8704F]
                transition-all duration-200 active:scale-[0.97]
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-accent
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
              "
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Publicando...
                </>
              ) : (
                "Publicar campanha 💚"
              )}
            </button>
            <Link
              href="/campaigns"
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
