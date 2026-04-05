import { memo } from "react";
import Link from "next/link";
import { Users, ArrowRight } from "lucide-react";
import { CampaignWithPatient } from "@/types/database";
import ProgressBar from "@/components/ui/ProgressBar";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });
}

interface CampaignCardProps {
  campaign: CampaignWithPatient;
  featured?: boolean;
}

export default memo(function CampaignCard({ campaign, featured = false }: CampaignCardProps) {
  const percent = campaign.goal_amount > 0
    ? Math.min(100, Math.round((campaign.current_amount / campaign.goal_amount) * 100))
    : 0;
  const donorCount = campaign.donations?.[0]
    ? (campaign.donations[0] as unknown as { count: number }).count
    : 0;

  return (
    <Link
      href={`/campaigns/${campaign.id}`}
      aria-label={`Ver campanha: ${campaign.title}`}
      className="group block bg-white rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-[3px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      style={{ boxShadow: "0 4px 24px rgba(26,107,90,0.08)" }}
    >
      {/* Cover image */}
      <div className="relative h-40 bg-[#E6F4F1] overflow-hidden">
        {campaign.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={campaign.cover_image_url}
            alt={campaign.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            💚
          </div>
        )}
        {/* Urgente badge */}
        {featured && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-accent text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" aria-hidden="true" />
            Urgente
          </span>
        )}
        {/* Status badge */}
        {campaign.status === "completed" && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#27AE60] text-white">
            Concluída
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3">
        <h3
          className="text-sm font-semibold text-text-main line-clamp-2 leading-snug group-hover:text-primary transition-colors duration-200"
          style={{ fontFamily: "Fraunces, serif" }}
        >
          {campaign.title}
        </h3>

        <ProgressBar value={percent} showPercent={false} size="sm" />

        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="font-semibold text-text-main">
              {formatBRL(campaign.current_amount)}
            </span>
            <span className="text-text-muted"> de {formatBRL(campaign.goal_amount)}</span>
          </div>
          <span className="text-primary font-semibold">{percent}%</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-text-muted">
            <Users size={11} />
            {donorCount} doador{donorCount !== 1 ? "es" : ""}
          </span>
          <span className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Apoiar
            <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
});
