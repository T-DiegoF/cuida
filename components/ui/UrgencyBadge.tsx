import { UrgencyLevel } from "@/types/database";

const urgencyConfig: Record<
  UrgencyLevel,
  { label: string; classes: string; pulse?: boolean }
> = {
  low: {
    label: "Baixa",
    classes: "bg-[#E8F5E9] text-[#27AE60]",
  },
  medium: {
    label: "Média",
    classes: "bg-[#FFF8E1] text-[#F39C12]",
  },
  high: {
    label: "Alta",
    classes: "bg-[#FFF3E0] text-[#E67E22]",
  },
  critical: {
    label: "Crítico",
    classes: "bg-[#FEECEC] text-[#C0392B]",
    pulse: true,
  },
};

interface UrgencyBadgeProps {
  urgency: UrgencyLevel;
  className?: string;
}

export default function UrgencyBadge({ urgency, className = "" }: UrgencyBadgeProps) {
  const config = urgencyConfig[urgency];
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
        ${config.classes}
        ${className}
      `}
      aria-label={`Urgência: ${config.label}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full bg-current ${config.pulse ? "animate-pulse" : ""}`}
        aria-hidden="true"
      />
      {config.label}
    </span>
  );
}
