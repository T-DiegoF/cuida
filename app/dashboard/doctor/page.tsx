"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Stethoscope, Clock, CheckCircle, BookOpen } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRequests } from "@/lib/hooks/useRequests";
import PageWrapper from "@/components/layout/PageWrapper";
import { SkeletonCard } from "@/components/ui/Skeleton";
import Skeleton from "@/components/ui/Skeleton";
import RequestCard from "@/components/features/RequestCard";
import { MedicalRequestWithPatient } from "@/types/database";

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: string;
}

function StatCard({ icon, value, label, color }: StatCardProps) {
  return (
    <div
      className="bg-white rounded-2xl p-5 flex items-start gap-4"
      style={{ boxShadow: "0 4px 24px rgba(26,107,90,0.08)" }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18` }}
      >
        <span style={{ color }}>{icon}</span>
      </div>
      <div>
        <p
          className="text-2xl font-bold text-text-main"
          style={{ fontFamily: "Fraunces, serif" }}
        >
          {value}
        </p>
        <p className="text-xs text-text-muted mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default function DoctorDashboard() {
  const { user, profile, role, loading: authLoading, signOut } = useAuth();
  const { getAll: getRequests } = useRequests();

  const [openRequests, setOpenRequests] = useState<MedicalRequestWithPatient[]>([]);
  const [myRequests, setMyRequests] = useState<MedicalRequestWithPatient[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setDataLoading(true);
    Promise.all([
      getRequests({ status: "open" }),
      getRequests({ status: "in_progress" }),
    ]).then(([open, inProgress]) => {
      setOpenRequests(open);
      // Simulate "my cases" as in_progress ones — in production, filter by doctor assignment
      setMyRequests(inProgress.slice(0, 3));
      setDataLoading(false);
    });
  }, [user, getRequests]);

  const firstName = profile?.full_name?.split(" ")[0] ?? "doutor(a)";

  return (
    <PageWrapper
      showNav
      isLoggedIn
      userName={profile?.full_name ?? undefined}
      userRole={role ?? "doctor"}
      avatarUrl={profile?.avatar_url ?? undefined}
      onSignOut={signOut}
    >
      {/* Greeting */}
      <div className="mb-8">
        <h1
          className="text-2xl md:text-3xl font-semibold text-text-main"
          style={{ fontFamily: "Fraunces, serif" }}
        >
          {authLoading ? "Carregando..." : `Olá, ${firstName} 👋`}
        </h1>
        <p className="text-text-muted mt-1 text-sm">
          {profile?.specialty ? `${profile.specialty} · ` : ""}
          Obrigado por cuidar de quem precisa.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {dataLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-5 flex items-start gap-4" style={{ boxShadow: "0 4px 24px rgba(26,107,90,0.06)" }}>
                <Skeleton className="w-11 h-11 rounded-xl" />
                <div className="flex flex-col gap-2 flex-1">
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <StatCard
              icon={<CheckCircle size={20} />}
              value={myRequests.length}
              label="casos em andamento"
              color="#1A6B5A"
            />
            <StatCard
              icon={<BookOpen size={20} />}
              value={profile?.specialty ?? "—"}
              label="especialidade"
              color="#2D9E87"
            />
            <StatCard
              icon={<Clock size={20} />}
              value={`${myRequests.length * 2}h`}
              label="horas voluntárias"
              color="#F4845F"
            />
          </>
        )}
      </div>

      {/* Open requests near you */}
      <section className="mb-10" aria-labelledby="open-requests-heading">
        <div className="flex items-center justify-between mb-4">
          <h2
            id="open-requests-heading"
            className="text-lg font-semibold text-text-main flex items-center gap-2"
            style={{ fontFamily: "Fraunces, serif" }}
          >
            <Stethoscope size={18} className="text-primary" />
            Pedidos próximos a você
          </h2>
          <Link
            href="/requests"
            className="text-xs text-primary font-medium hover:text-primary-light transition-colors"
          >
            Ver todos →
          </Link>
        </div>

        {dataLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : openRequests.length === 0 ? (
          <div
            className="bg-white rounded-2xl p-8 text-center"
            style={{ boxShadow: "0 4px 24px rgba(26,107,90,0.06)" }}
          >
            <p className="text-4xl mb-3">🌟</p>
            <p className="text-sm font-medium text-text-main mb-1">Nenhum pedido aberto no momento</p>
            <p className="text-xs text-text-muted">Novos pedidos aparecem aqui em tempo real.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {openRequests.slice(0, 6).map((req) => (
              <RequestCard key={req.id} request={req} />
            ))}
          </div>
        )}
      </section>

      {/* My active cases */}
      <section aria-labelledby="my-cases-heading">
        <div className="flex items-center justify-between mb-4">
          <h2
            id="my-cases-heading"
            className="text-lg font-semibold text-text-main flex items-center gap-2"
            style={{ fontFamily: "Fraunces, serif" }}
          >
            <CheckCircle size={18} className="text-[#27AE60]" />
            Casos que estou ajudando
          </h2>
        </div>

        {dataLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : myRequests.length === 0 ? (
          <div
            className="bg-white rounded-2xl p-8 text-center"
            style={{ boxShadow: "0 4px 24px rgba(26,107,90,0.06)" }}
          >
            <p className="text-4xl mb-3">💙</p>
            <p className="text-sm font-medium text-text-main mb-1">Você ainda não está ajudando nenhum caso</p>
            <p className="text-xs text-text-muted">Explore os pedidos acima e ofereça sua ajuda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myRequests.map((req) => (
              <RequestCard key={req.id} request={req} />
            ))}
          </div>
        )}
      </section>
    </PageWrapper>
  );
}
