"use client";

import Link from "next/link";
import { Plus, FileText, Heart } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import PageWrapper from "@/components/layout/PageWrapper";
import ProgressBar from "@/components/ui/ProgressBar";
import RequestCard from "@/components/features/RequestCard";
import CampaignCard from "@/components/features/CampaignCard";
import { MedicalRequestWithPatient, CampaignWithPatient } from "@/types/database";

type Profile = {
  id: string;
  full_name: string | null;
  role: string | null;
  avatar_url: string | null;
  location: string | null;
  bio: string | null;
  specialty: string | null;
};

function profileCompletion(profile: Profile | null): number {
  if (!profile) return 0;
  const fields = [profile.full_name, profile.role, profile.avatar_url, profile.location, profile.bio];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}

interface Props {
  profile: Profile | null;
  requests: MedicalRequestWithPatient[];
  campaigns: CampaignWithPatient[];
}

export default function PatientDashboardClient({ profile, requests, campaigns }: Props) {
  const { signOut } = useAuth();
  const completionPct = profileCompletion(profile);
  const firstName = profile?.full_name?.split(" ")[0] ?? "você";

  return (
    <PageWrapper
      showNav
      isLoggedIn
      userName={profile?.full_name ?? undefined}
      userRole={profile?.role ?? "patient"}
      avatarUrl={profile?.avatar_url ?? undefined}
      onSignOut={signOut}
    >
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-text-main" style={{ fontFamily: "Fraunces, serif" }}>
          Olá, {firstName} 👋
        </h1>
        <p className="text-text-muted mt-1 text-sm">Como podemos ajudar hoje?</p>
      </div>

      {/* Profile completion */}
      {completionPct < 80 && (
        <div className="bg-white rounded-2xl p-5 mb-6 flex flex-col gap-3" style={{ boxShadow: "0 4px 24px rgba(26,107,90,0.08)" }}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-text-main">Complete seu perfil</p>
            <Link href="/auth/register" className="text-xs text-primary font-medium hover:text-primary-light transition-colors">
              Editar →
            </Link>
          </div>
          <ProgressBar value={completionPct} label="Perfil completo" />
          <p className="text-xs text-text-muted">
            Um perfil completo aumenta suas chances de receber ajuda mais rápido.
          </p>
        </div>
      )}

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link href="/requests/new" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-light transition-all duration-200 active:scale-95">
          <Plus size={16} />
          Novo Pedido
        </Link>
        <Link href="/campaigns/new" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-accent hover:bg-[#E8704F] transition-all duration-200 active:scale-95">
          <Plus size={16} />
          Criar Campanha
        </Link>
      </div>

      {/* My active requests */}
      <section className="mb-10" aria-labelledby="requests-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="requests-heading" className="text-lg font-semibold text-text-main flex items-center gap-2" style={{ fontFamily: "Fraunces, serif" }}>
            <FileText size={18} className="text-primary" />
            Meus pedidos ativos
          </h2>
          <Link href="/requests" className="text-xs text-primary font-medium hover:text-primary-light transition-colors">
            Ver todos →
          </Link>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center" style={{ boxShadow: "0 4px 24px rgba(26,107,90,0.06)" }}>
            <p className="text-4xl mb-3">🏥</p>
            <p className="text-sm font-medium text-text-main mb-1">Nenhum pedido ativo</p>
            <p className="text-xs text-text-muted mb-4">Crie um pedido para conectar com médicos voluntários.</p>
            <Link href="/requests/new" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-light transition-colors">
              <Plus size={12} />
              Criar meu primeiro pedido
            </Link>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
            {requests.map((req) => (
              <RequestCard key={req.id} request={req} compact />
            ))}
          </div>
        )}
      </section>

      {/* My campaigns */}
      <section aria-labelledby="campaigns-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="campaigns-heading" className="text-lg font-semibold text-text-main flex items-center gap-2" style={{ fontFamily: "Fraunces, serif" }}>
            <Heart size={18} className="text-accent" />
            Minhas campanhas
          </h2>
          <Link href="/campaigns" className="text-xs text-primary font-medium hover:text-primary-light transition-colors">
            Ver todas →
          </Link>
        </div>

        {campaigns.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center" style={{ boxShadow: "0 4px 24px rgba(26,107,90,0.06)" }}>
            <p className="text-4xl mb-3">💚</p>
            <p className="text-sm font-medium text-text-main mb-1">Nenhuma campanha ainda</p>
            <p className="text-xs text-text-muted mb-4">Conte sua história e receba apoio da comunidade.</p>
            <Link href="/campaigns/new" className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-[#E8704F] transition-colors">
              <Plus size={12} />
              Criar minha primeira campanha
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map((camp) => (
              <CampaignCard key={camp.id} campaign={camp} />
            ))}
          </div>
        )}
      </section>
    </PageWrapper>
  );
}
