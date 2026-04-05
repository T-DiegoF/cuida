"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, TrendingUp, Users } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import PageWrapper from "@/components/layout/PageWrapper";
import CampaignCard from "@/components/features/CampaignCard";
import { CampaignWithPatient } from "@/types/database";

type DonationWithCampaign = {
  id: string;
  amount: number;
  created_at: string;
  campaign_id: string | null;
  anonymous: boolean;
  message: string | null;
  campaigns: { title: string } | null;
};

type Profile = {
  id: string;
  full_name: string | null;
  role: string | null;
  avatar_url: string | null;
  location: string | null;
  bio: string | null;
  specialty: string | null;
};

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

const filterLabels = { active: "Ativas", completed: "Concluídas", all: "Todas" } as const;

interface Props {
  profile: Profile | null;
  initialCampaigns: CampaignWithPatient[];
  donations: DonationWithCampaign[];
}

export default function DonorDashboardClient({ profile, initialCampaigns, donations }: Props) {
  const { signOut } = useAuth();
  const [filter, setFilter] = useState<"active" | "completed" | "all">("active");

  const campaigns = filter === "all"
    ? initialCampaigns
    : initialCampaigns.filter((c) => c.status === filter);

  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);
  const uniqueCampaigns = new Set(donations.map((d) => d.campaign_id)).size;
  const firstName = profile?.full_name?.split(" ")[0] ?? "doador(a)";

  return (
    <PageWrapper
      showNav
      isLoggedIn
      userName={profile?.full_name ?? undefined}
      userRole={profile?.role ?? "donor"}
      avatarUrl={profile?.avatar_url ?? undefined}
      onSignOut={signOut}
    >
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-text-main" style={{ fontFamily: "Fraunces, serif" }}>
          Olá, {firstName} 👋
        </h1>
        <p className="text-text-muted mt-1 text-sm">Seu apoio faz a diferença. Obrigado!</p>
      </div>

      {/* Impact card */}
      <div className="bg-primary rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-6" style={{ boxShadow: "0 8px 32px rgba(26,107,90,0.2)" }}>
        <div className="flex-1">
          <p className="text-white/70 text-xs font-medium uppercase tracking-wider mb-1">Seu impacto total</p>
          <p className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: "Fraunces, serif" }}>
            {formatBRL(totalDonated)}
          </p>
          <p className="text-white/70 text-sm mt-1">doados para campanhas de saúde</p>
        </div>
        <div className="flex gap-6">
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
              <TrendingUp size={18} className="text-white" />
            </div>
            <p className="text-xl font-bold text-white" style={{ fontFamily: "Fraunces, serif" }}>{donations.length}</p>
            <p className="text-xs text-white/60">doações</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
              <Users size={18} className="text-white" />
            </div>
            <p className="text-xl font-bold text-white" style={{ fontFamily: "Fraunces, serif" }}>{uniqueCampaigns}</p>
            <p className="text-xs text-white/60">campanhas apoiadas</p>
          </div>
        </div>
      </div>

      {/* Campaigns */}
      <section className="mb-10" aria-labelledby="campaigns-heading">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 id="campaigns-heading" className="text-lg font-semibold text-text-main flex items-center gap-2" style={{ fontFamily: "Fraunces, serif" }}>
            <Heart size={18} className="text-accent" />
            Campanhas para apoiar
          </h2>
          <div className="flex gap-2" role="group" aria-label="Filtrar campanhas">
            {(["active", "completed", "all"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  filter === f ? "bg-primary text-white" : "bg-white text-text-muted border border-[#D6E8E3] hover:border-primary hover:text-primary"
                }`}
              >
                {filterLabels[f]}
              </button>
            ))}
          </div>
        </div>

        {campaigns.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center" style={{ boxShadow: "0 4px 24px rgba(26,107,90,0.06)" }}>
            <p className="text-4xl mb-3">💚</p>
            <p className="text-sm font-medium text-text-main mb-1">Nenhuma campanha encontrada</p>
            <p className="text-xs text-text-muted">Tente outro filtro ou volte em breve.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map((camp, i) => (
              <CampaignCard key={camp.id} campaign={camp} featured={i === 0 && camp.status === "active"} />
            ))}
          </div>
        )}
      </section>

      {/* Donations timeline */}
      <section aria-labelledby="donations-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="donations-heading" className="text-lg font-semibold text-text-main flex items-center gap-2" style={{ fontFamily: "Fraunces, serif" }}>
            <TrendingUp size={18} className="text-primary" />
            Minhas doações
          </h2>
          <Link href="/campaigns" className="text-xs text-primary font-medium hover:text-primary-light transition-colors">
            Ver campanhas →
          </Link>
        </div>

        {donations.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center" style={{ boxShadow: "0 4px 24px rgba(26,107,90,0.06)" }}>
            <p className="text-4xl mb-3">🤝</p>
            <p className="text-sm font-medium text-text-main mb-1">Nenhuma doação ainda</p>
            <p className="text-xs text-text-muted mb-4">Apoie uma campanha e faça a diferença hoje.</p>
            <Link href="/campaigns" className="text-xs font-semibold text-accent hover:text-[#E8704F] transition-colors">
              Explorar campanhas →
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl divide-y divide-[#D6E8E3]" style={{ boxShadow: "0 4px 24px rgba(26,107,90,0.06)" }}>
            {donations.map((donation) => (
              <div key={donation.id} className="flex items-center gap-4 px-5 py-4">
                <div className="w-9 h-9 rounded-full bg-[#E6F4F1] flex items-center justify-center text-primary flex-shrink-0">
                  <Heart size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-main truncate">
                    {donation.campaigns?.title ?? "Campanha"}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    {formatDate(donation.created_at)}
                    {donation.anonymous && " · Doação anônima 💚"}
                    {donation.message && ` · "${donation.message}"`}
                  </p>
                </div>
                <span className="text-sm font-semibold text-primary flex-shrink-0">
                  {formatBRL(donation.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </PageWrapper>
  );
}
