"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, Calendar, ArrowLeft, Stethoscope, Loader2 } from "lucide-react";
import { useRequests } from "@/lib/hooks/useRequests";
import { useAuth } from "@/lib/hooks/useAuth";
import PageWrapper from "@/components/layout/PageWrapper";
import Skeleton from "@/components/ui/Skeleton";
import UrgencyBadge from "@/components/ui/UrgencyBadge";
import { MedicalRequestWithPatient, RequestStatus } from "@/types/database";

const STATUS_CONFIG: Record<RequestStatus, { label: string; classes: string }> = {
  open: { label: "Aberto", classes: "bg-[#E8F5E9] text-[#27AE60]" },
  in_progress: { label: "Em andamento", classes: "bg-[#FFF8E1] text-[#F39C12]" },
  resolved: { label: "Resolvido", classes: "bg-[#E6F4F1] text-primary" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getById, updateStatus } = useRequests();
  const { profile, role, signOut } = useAuth();

  const [request, setRequest] = useState<MedicalRequestWithPatient | null>(null);
  const [loading, setLoading] = useState(true);
  const [helping, setHelping] = useState(false);
  const [helped, setHelped] = useState(false);

  useEffect(() => {
    if (!id) return;
    getById(id).then((data) => {
      setRequest(data);
      setLoading(false);
    });
  }, [id, getById]);

  const patient = request?.profiles;
  const statusConfig = request ? STATUS_CONFIG[request.status] : null;
  const initials = patient?.full_name
    ? patient.full_name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  async function handleHelp() {
    if (!request) return;
    setHelping(true);
    await updateStatus(request.id, "in_progress");
    setHelped(true);
    setHelping(false);
    setRequest((prev) => prev ? { ...prev, status: "in_progress" } : prev);
  }

  return (
    <PageWrapper
      showNav
      isLoggedIn={!!profile}
      userName={profile?.full_name ?? undefined}
      userRole={role ?? undefined}
      avatarUrl={profile?.avatar_url ?? undefined}
      onSignOut={signOut}
    >
      {/* Back */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors"
          aria-label="Voltar para pedidos"
        >
          <ArrowLeft size={16} />
          Voltar para pedidos
        </button>
      </div>

      {loading ? (
        <RequestDetailSkeleton />
      ) : !request ? (
        <div className="flex flex-col items-center py-20 text-center">
          <p className="text-4xl mb-4">🔍</p>
          <h2 className="text-lg font-semibold text-text-main mb-2" style={{ fontFamily: "Fraunces, serif" }}>
            Pedido não encontrado
          </h2>
          <p className="text-sm text-text-muted mb-6">Esse pedido pode ter sido removido ou não existe.</p>
          <Link
            href="/requests"
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary-light transition-all duration-200"
          >
            Ver todos os pedidos
          </Link>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          {/* Header card */}
          <div
            className="bg-white rounded-2xl p-6 mb-6 flex flex-col gap-5"
            style={{ boxShadow: "0 4px 24px rgba(26,107,90,0.08)" }}
          >
            {/* Status + urgency */}
            <div className="flex flex-wrap items-center gap-2">
              {statusConfig && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.classes}`}>
                  {statusConfig.label}
                </span>
              )}
              <UrgencyBadge urgency={request.urgency} />
              {request.specialty_needed && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#E6F4F1] text-primary">
                  <Stethoscope size={11} className="mr-1.5" />
                  {request.specialty_needed}
                </span>
              )}
            </div>

            {/* Title */}
            <h1
              className="text-xl md:text-2xl font-semibold text-text-main leading-snug"
              style={{ fontFamily: "Fraunces, serif" }}
            >
              {request.title}
            </h1>

            {/* Patient info */}
            <div className="flex items-center gap-3 pt-1 border-t border-[#D6E8E3]">
              <div className="w-10 h-10 rounded-full bg-[#D6E8E3] flex items-center justify-center text-sm font-semibold text-primary flex-shrink-0 overflow-hidden">
                {patient?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={patient.avatar_url} alt={patient.full_name ?? "avatar"} className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/profile/${patient?.id}`}
                  className="text-sm font-medium text-text-main hover:text-primary transition-colors"
                >
                  {patient?.full_name ?? "Paciente"}
                </Link>
                <div className="flex flex-wrap gap-3 text-xs text-text-muted mt-0.5">
                  {(request.location ?? patient?.location) && (
                    <span className="flex items-center gap-1">
                      <MapPin size={11} />
                      {request.location ?? patient?.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar size={11} />
                    {formatDate(request.created_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div
            className="bg-white rounded-2xl p-6 mb-6"
            style={{ boxShadow: "0 4px 24px rgba(26,107,90,0.08)" }}
          >
            <h2
              className="text-base font-semibold text-text-main mb-4"
              style={{ fontFamily: "Fraunces, serif" }}
            >
              Sobre o pedido
            </h2>
            {request.description ? (
              <p className="text-sm text-text-main leading-relaxed whitespace-pre-wrap">
                {request.description}
              </p>
            ) : (
              <p className="text-sm text-text-muted italic">Nenhuma descrição fornecida.</p>
            )}
          </div>

          {/* Doctor CTA */}
          {role === "doctor" && request.status === "open" && (
            <div
              className="bg-[#E6F4F1] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              style={{ boxShadow: "0 4px 24px rgba(26,107,90,0.06)" }}
            >
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-main mb-1">
                  Você pode ajudar neste caso
                </p>
                <p className="text-xs text-text-muted">
                  Ao clicar, o status do pedido será atualizado para &quot;Em andamento&quot; e o paciente será notificado.
                </p>
              </div>
              <button
                onClick={handleHelp}
                disabled={helping || helped}
                aria-label="Quero ajudar com este caso"
                className="
                  flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white
                  bg-primary hover:bg-primary-light
                  transition-all duration-200 active:scale-95
                  disabled:opacity-60 disabled:cursor-not-allowed
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                  whitespace-nowrap
                "
              >
                {helping ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Registrando...
                  </>
                ) : helped ? (
                  "Você está ajudando 💚"
                ) : (
                  "Quero ajudar com este caso"
                )}
              </button>
            </div>
          )}

          {/* Already in progress notice */}
          {request.status === "in_progress" && (
            <div className="bg-[#FFF8E1] rounded-2xl p-5 border border-[#F2C94C]/40">
              <p className="text-sm font-medium text-[#F39C12]">
                Este pedido já está sendo atendido por um profissional de saúde.
              </p>
            </div>
          )}

          {request.status === "resolved" && (
            <div className="bg-[#E8F5E9] rounded-2xl p-5 border border-[#27AE60]/30">
              <p className="text-sm font-medium text-[#27AE60]">
                Ótima notícia! Este pedido foi resolvido. 💚
              </p>
            </div>
          )}
        </div>
      )}
    </PageWrapper>
  );
}

function RequestDetailSkeleton() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <div className="bg-white rounded-2xl p-6 flex flex-col gap-5" style={{ boxShadow: "0 4px 24px rgba(26,107,90,0.06)" }}>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <div className="flex items-center gap-3 pt-4 border-t border-[#D6E8E3]">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 flex flex-col gap-3" style={{ boxShadow: "0 4px 24px rgba(26,107,90,0.06)" }}>
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-4/5" />
        <Skeleton className="h-3.5 w-2/3" />
      </div>
    </div>
  );
}
