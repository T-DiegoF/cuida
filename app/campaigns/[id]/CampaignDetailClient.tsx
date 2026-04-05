"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Loader2, Heart, EyeOff, ChevronUp, X } from "lucide-react";
import { useCampaigns } from "@/lib/hooks/useCampaigns";
import { useAuth } from "@/lib/hooks/useAuth";
import PageWrapper from "@/components/layout/PageWrapper";
import ProgressBar from "@/components/ui/ProgressBar";
import { ToastContainer, useToast } from "@/components/ui/Toast";
import { CampaignWithPatient, DonationWithDonor } from "@/types/database";

const PRESET_AMOUNTS = [25, 50, 100, 250];

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

interface DonationFormProps {
  campaign: CampaignWithPatient;
  donorCount: number;
  onDonationSuccess: (amount: number) => void;
}

function DonationForm({ campaign, donorCount, onDonationSuccess }: DonationFormProps) {
  const { user } = useAuth();
  const { donate } = useCampaigns();
  const { toasts, toast, dismiss } = useToast();

  const [selectedPreset, setSelectedPreset] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const percent = campaign.goal_amount > 0
    ? Math.min(100, Math.round((campaign.current_amount / campaign.goal_amount) * 100))
    : 0;

  const amount = isCustom ? parseFloat(customAmount.replace(",", ".")) || 0 : selectedPreset ?? 0;

  async function handleDonate() {
    if (!amount || amount <= 0) { toast("Informe um valor válido para a doação.", "error"); return; }
    if (!user) { toast("Faça login para realizar uma doação.", "error"); return; }
    setLoading(true);
    const result = await donate(campaign.id, amount, message.trim() || undefined, anonymous);
    if (!result) { toast("Algo deu errado. Tente novamente.", "error"); setLoading(false); return; }
    toast(`Ótimo! Sua doação de ${formatBRL(amount)} foi registrada 💚`, "success");
    onDonationSuccess(amount);
    setSelectedPreset(50); setCustomAmount(""); setIsCustom(false); setMessage(""); setLoading(false);
  }

  return (
    <div className="flex flex-col gap-5">
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
      <div className="flex flex-col gap-2">
        <ProgressBar value={percent} showPercent={false} />
        <div className="flex items-center justify-between text-sm">
          <div>
            <span className="font-bold text-text-main">{formatBRL(campaign.current_amount)}</span>
            <span className="text-text-muted text-xs"> de {formatBRL(campaign.goal_amount)}</span>
          </div>
          <span className="font-semibold text-primary">{percent}%</span>
        </div>
        <p className="text-xs text-text-muted flex items-center gap-1"><Users size={11} />{donorCount} doador{donorCount !== 1 ? "es" : ""}</p>
      </div>
      <div className="border-t border-[#D6E8E3]" />
      <div>
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Escolha um valor</p>
        <div className="grid grid-cols-2 gap-2">
          {PRESET_AMOUNTS.map((preset) => (
            <button key={preset} type="button" onClick={() => { setSelectedPreset(preset); setIsCustom(false); }} aria-pressed={!isCustom && selectedPreset === preset}
              className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${!isCustom && selectedPreset === preset ? "border-primary bg-[#E6F4F1] text-primary" : "border-[#D6E8E3] bg-white text-text-main hover:border-primary hover:text-primary"}`}>
              {formatBRL(preset)}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => { setIsCustom(true); setSelectedPreset(null); }} aria-pressed={isCustom}
          className={`w-full mt-2 py-2.5 rounded-xl text-sm font-medium border-2 transition-all duration-200 ${isCustom ? "border-primary bg-[#E6F4F1] text-primary" : "border-[#D6E8E3] bg-white text-text-muted hover:border-primary hover:text-primary"}`}>
          Outro valor
        </button>
        {isCustom && (
          <div className="mt-2 relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-text-muted font-medium">R$</span>
            <input type="number" min="1" step="1" value={customAmount} onChange={(e) => setCustomAmount(e.target.value)} placeholder="0" autoFocus
              className="w-full pl-9 pr-4 py-3 rounded-xl text-sm text-text-main bg-white border border-[#D6E8E3] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200" />
          </div>
        )}
      </div>
      <label className="flex items-center gap-3 cursor-pointer">
        <button type="button" role="switch" aria-checked={anonymous} onClick={() => setAnonymous((v) => !v)}
          className={`relative w-10 h-5 rounded-full transition-all duration-200 flex-shrink-0 ${anonymous ? "bg-primary" : "bg-[#D6E8E3]"}`}>
          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200 ${anonymous ? "left-5" : "left-0.5"}`} />
        </button>
        <div className="flex items-center gap-1.5 text-sm text-text-main"><EyeOff size={14} className="text-text-muted" />Doar anonimamente</div>
      </label>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="donation-message" className="text-xs font-medium text-text-muted">Mensagem (opcional)</label>
        <textarea id="donation-message" rows={2} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Deixe uma mensagem de apoio..." maxLength={200}
          className="w-full px-3.5 py-2.5 rounded-xl text-sm text-text-main bg-white border border-[#D6E8E3] outline-none placeholder:text-text-muted resize-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20" />
      </div>
      <button type="button" onClick={handleDonate} disabled={loading || amount <= 0}
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-bold text-white bg-accent hover:bg-[#E8704F] transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ boxShadow: loading || amount <= 0 ? "none" : "0 4px 20px rgba(244,132,95,0.4)" }}>
        {loading ? <><Loader2 size={16} className="animate-spin" />Processando...</> : <><Heart size={16} />Fazer minha doação 💚</>}
      </button>
      {!user && (
        <p className="text-xs text-text-muted text-center">
          <Link href="/auth/login" className="text-primary font-medium hover:underline">Faça login</Link>{" "}para fazer uma doação
        </p>
      )}
    </div>
  );
}

interface Props {
  campaign: CampaignWithPatient;
  initialDonors: DonationWithDonor[];
  profile: { full_name: string | null; role: string | null; avatar_url: string | null } | null;
}

export default function CampaignDetailClient({ campaign: initialCampaign, initialDonors, profile }: Props) {
  const router = useRouter();
  const { signOut } = useAuth();

  const [campaign, setCampaign] = useState(initialCampaign);
  const [donors] = useState<DonationWithDonor[]>(initialDonors);
  const [donorCount, setDonorCount] = useState(initialDonors.length);
  const [showMobileSheet, setShowMobileSheet] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  function handleDonationSuccess(amount: number) {
    setCampaign((prev) => ({ ...prev, current_amount: prev.current_amount + amount }));
    setDonorCount((c) => c + 1);
  }

  const patient = campaign.profiles;

  return (
    <PageWrapper showNav isLoggedIn={!!profile} userName={profile?.full_name ?? undefined} userRole={profile?.role ?? undefined} avatarUrl={profile?.avatar_url ?? undefined} onSignOut={signOut}>
      <div className="mb-4">
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors">
          <ArrowLeft size={16} />Voltar para campanhas
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1 min-w-0">
          <div className="relative h-56 md:h-72 rounded-2xl overflow-hidden mb-6 bg-[#E6F4F1]">
            {campaign.cover_image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={campaign.cover_image_url} alt={campaign.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">💚</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h1 className="text-xl md:text-2xl font-semibold text-white leading-snug" style={{ fontFamily: "Fraunces, serif" }}>{campaign.title}</h1>
              {patient?.full_name && (
                <p className="text-sm text-white/80 mt-1">por <span className="font-medium">{patient.full_name}</span></p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 mb-6" style={{ boxShadow: "0 4px 24px rgba(26,107,90,0.08)" }}>
            <h2 className="text-base font-semibold text-text-main mb-4" style={{ fontFamily: "Fraunces, serif" }}>Nossa história</h2>
            {campaign.story
              ? <p className="text-sm text-text-main leading-[1.8] whitespace-pre-wrap">{campaign.story}</p>
              : <p className="text-sm text-text-muted italic">Nenhuma história adicionada.</p>}
          </div>

          {donors.length > 0 && (
            <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "0 4px 24px rgba(26,107,90,0.08)" }}>
              <h2 className="text-base font-semibold text-text-main mb-4" style={{ fontFamily: "Fraunces, serif" }}>Quem apoiou</h2>
              <div className="flex flex-col divide-y divide-[#D6E8E3]">
                {donors.map((donation) => {
                  const donor = donation.profiles;
                  const isAnon = donation.anonymous || !donor;
                  const initials = donor?.full_name ? donor.full_name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() : "?";
                  return (
                    <div key={donation.id} className="flex items-start gap-3 py-3.5">
                      <div className="w-9 h-9 rounded-full bg-[#E6F4F1] flex items-center justify-center text-xs font-semibold text-primary flex-shrink-0 overflow-hidden">
                        {isAnon ? "💚" : donor?.avatar_url
                          // eslint-disable-next-line @next/next/no-img-element
                          ? <img src={donor.avatar_url} alt={donor.full_name ?? ""} className="w-full h-full object-cover" />
                          : initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="text-sm font-medium text-text-main truncate">{isAnon ? "Doador anônimo 💚" : donor?.full_name}</p>
                          <span className="text-sm font-semibold text-primary flex-shrink-0">{formatBRL(donation.amount)}</span>
                        </div>
                        {donation.message && <p className="text-xs text-text-muted mt-0.5 line-clamp-2">&ldquo;{donation.message}&rdquo;</p>}
                        <p className="text-xs text-text-muted mt-0.5">{formatDate(donation.created_at)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <aside className="hidden lg:block w-80 xl:w-96 flex-shrink-0 sticky top-24">
          <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "0 4px 24px rgba(26,107,90,0.10)" }}>
            <h2 className="text-base font-semibold text-text-main mb-5" style={{ fontFamily: "Fraunces, serif" }}>Fazer uma doação</h2>
            <DonationForm campaign={campaign} donorCount={donorCount} onDonationSuccess={handleDonationSuccess} />
          </div>
        </aside>
      </div>

      <div className="lg:hidden">
        {!showMobileSheet && (
          <div className="fixed bottom-[72px] left-0 right-0 z-30 px-4 pb-2">
            <button onClick={() => setShowMobileSheet(true)}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white bg-accent hover:bg-[#E8704F] transition-all duration-200 active:scale-[0.97]"
              style={{ boxShadow: "0 4px 20px rgba(244,132,95,0.45)" }}>
              <Heart size={16} />Fazer minha doação 💚
            </button>
          </div>
        )}
        {showMobileSheet && <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setShowMobileSheet(false)} aria-hidden="true" />}
        <div ref={sheetRef}
          className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl transition-transform duration-300 ease-out max-h-[90vh] overflow-y-auto ${showMobileSheet ? "translate-y-0" : "translate-y-full"}`}
          style={{ boxShadow: "0 -8px 32px rgba(26,107,90,0.15)" }}>
          <div className="flex items-center justify-between px-6 py-4 sticky top-0 bg-white border-b border-[#D6E8E3] rounded-t-3xl">
            <div className="w-10 h-1 rounded-full bg-[#D6E8E3] mx-auto absolute left-1/2 -translate-x-1/2 top-3" aria-hidden="true" />
            <h2 className="text-base font-semibold text-text-main" style={{ fontFamily: "Fraunces, serif" }}>Fazer uma doação</h2>
            <button onClick={() => setShowMobileSheet(false)} className="text-text-muted hover:text-text-main transition-colors p-1"><X size={18} /></button>
          </div>
          <div className="px-6 py-5 pb-10">
            <DonationForm campaign={campaign} donorCount={donorCount} onDonationSuccess={(amount) => { handleDonationSuccess(amount); setShowMobileSheet(false); }} />
          </div>
        </div>
        {showMobileSheet && (
          <button className="fixed bottom-[calc(90vh+8px)] left-1/2 -translate-x-1/2 z-50 w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary shadow-md" onClick={() => setShowMobileSheet(false)}>
            <ChevronUp size={16} />
          </button>
        )}
      </div>
    </PageWrapper>
  );
}
