import Link from "next/link";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { MedicalRequestWithPatient } from "@/types/database";
import UrgencyBadge from "@/components/ui/UrgencyBadge";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface RequestCardProps {
  request: MedicalRequestWithPatient;
  compact?: boolean;
}

export default function RequestCard({ request, compact = false }: RequestCardProps) {
  const patient = request.profiles;
  const initials = patient?.full_name
    ? patient.full_name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <Link
      href={`/requests/${request.id}`}
      aria-label={`Ver pedido: ${request.title}`}
      className={`
        group block bg-white rounded-2xl transition-all duration-200
        hover:-translate-y-[3px] focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        ${compact ? "min-w-[260px] max-w-[280px]" : "w-full"}
      `}
      style={{
        boxShadow: "0 4px 24px rgba(26,107,90,0.08)",
      }}
    >
      <div className="p-5 flex flex-col gap-3">
        {/* Header: avatar + patient name */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-[#D6E8E3] flex items-center justify-center text-xs font-semibold text-primary flex-shrink-0">
            {patient?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={patient.avatar_url}
                alt={patient.full_name ?? "avatar"}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              initials
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-text-muted truncate">
              {patient?.full_name ?? "Paciente"}
            </p>
            <h3
              className="text-sm font-semibold text-text-main leading-snug line-clamp-2 mt-0.5 group-hover:text-primary transition-colors duration-200"
              style={{ fontFamily: "Fraunces, serif" }}
            >
              {request.title}
            </h3>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <UrgencyBadge urgency={request.urgency} />
          {request.specialty_needed && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#E6F4F1] text-primary">
              {request.specialty_needed}
            </span>
          )}
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
          {request.location && (
            <span className="flex items-center gap-1">
              <MapPin size={11} />
              {request.location}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar size={11} />
            {formatDate(request.created_at)}
          </span>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-end text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-1">
          Ver pedido
          <ArrowRight size={12} className="ml-1" />
        </div>
      </div>
    </Link>
  );
}
