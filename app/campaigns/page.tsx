"use client";

import { useEffect, useState, useCallback } from "react";
import { Search } from "lucide-react";
import { useCampaigns } from "@/lib/hooks/useCampaigns";
import { useAuth } from "@/lib/hooks/useAuth";
import PageWrapper from "@/components/layout/PageWrapper";
import { SkeletonCampaignCard } from "@/components/ui/Skeleton";
import CampaignCard from "@/components/features/CampaignCard";
import { CampaignWithPatient } from "@/types/database";
import Link from "next/link";
import { Plus } from "lucide-react";

const CATEGORIES = [
  { value: "all", label: "Todas" },
  { value: "cirurgia", label: "Cirurgia" },
  { value: "medicação", label: "Medicação" },
  { value: "tratamento", label: "Tratamento" },
  { value: "reabilitação", label: "Reabilitação" },
  { value: "outros", label: "Outros" },
];

export default function CampaignsPage() {
  const { profile, role, signOut } = useAuth();
  const { getAll } = useCampaigns();

  const [campaigns, setCampaigns] = useState<CampaignWithPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    const data = await getAll({ status: "active" });
    setCampaigns(data);
    setLoading(false);
  }, [getAll]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  // Client-side category/search filter (categories are stored in title/story for MVP)
  const filtered = campaigns.filter((c) => {
    const matchSearch =
      !search.trim() ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.story?.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      category === "all" ||
      c.title.toLowerCase().includes(category) ||
      c.story?.toLowerCase().includes(category);
    return matchSearch && matchCategory;
  });

  // Pin campaigns near their goal as "urgent"
  const withUrgency = filtered.map((c) => ({
    ...c,
    _urgent:
      c.goal_amount > 0 &&
      c.current_amount / c.goal_amount >= 0.85 &&
      c.current_amount < c.goal_amount,
  }));
  const sorted = [
    ...withUrgency.filter((c) => c._urgent),
    ...withUrgency.filter((c) => !c._urgent),
  ];

  return (
    <PageWrapper
      showNav
      isLoggedIn={!!profile}
      userName={profile?.full_name ?? undefined}
      userRole={role ?? undefined}
      avatarUrl={profile?.avatar_url ?? undefined}
      onSignOut={signOut}
    >
      {/* Hero banner */}
      <div className="relative bg-primary rounded-2xl overflow-hidden mb-8 px-6 py-10 md:py-14">
        {/* Decorative circle */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
        <div className="relative z-10 max-w-xl">
          <h1
            className="text-3xl md:text-4xl font-semibold text-white mb-3"
            style={{ fontFamily: "Fraunces, serif", letterSpacing: "-0.01em" }}
          >
            Ajude quem mais precisa
          </h1>
          <p className="text-white/80 text-sm md:text-base leading-relaxed mb-6">
            Cada contribuição transforma uma vida. Apoie campanhas reais de saúde
            criadas por famílias que precisam do seu apoio.
          </p>
          <div className="flex flex-wrap gap-3">
            {role === "patient" && (
              <Link
                href="/campaigns/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-primary bg-white hover:bg-[#F0FAF8] transition-all duration-200 active:scale-95"
                aria-label="Criar nova campanha"
              >
                <Plus size={15} />
                Criar campanha
              </Link>
            )}
            <a
              href="#campaigns-grid"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white border border-white/30 hover:bg-white/10 transition-all duration-200"
            >
              Ver campanhas →
            </a>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
        />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar campanhas..."
          aria-label="Buscar campanhas"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-text-main bg-white border border-[#D6E8E3] outline-none placeholder:text-text-muted transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Category pills */}
      <div
        className="flex gap-2 overflow-x-auto pb-1 mb-6 -mx-1 px-1"
        role="group"
        aria-label="Filtrar por categoria"
      >
        {CATEGORIES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setCategory(value)}
            aria-pressed={category === value}
            className={`
              flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
              ${category === value
                ? "bg-primary text-white shadow-sm"
                : "bg-white text-text-muted border border-[#D6E8E3] hover:border-primary hover:text-primary"
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-xs text-text-muted mb-4">
          {sorted.length}{" "}
          {sorted.length === 1 ? "campanha encontrada" : "campanhas encontradas"}
        </p>
      )}

      {/* Grid */}
      <div id="campaigns-grid">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCampaignCard key={i} />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <svg
              width="120"
              height="100"
              viewBox="0 0 120 100"
              fill="none"
              aria-hidden="true"
              className="mb-6 opacity-60"
            >
              <circle cx="60" cy="45" r="35" fill="#FDE8DF" />
              <path
                d="M60 30 C60 30, 44 22, 38 34 C32 46, 44 54, 60 67 C76 54, 88 46, 82 34 C76 22, 60 30, 60 30Z"
                fill="#F4845F"
                opacity="0.3"
                stroke="#F4845F"
                strokeWidth="2"
              />
              <path
                d="M30 85 Q60 95 90 85"
                stroke="#D6E8E3"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <p
              className="text-base font-semibold text-text-main mb-2"
              style={{ fontFamily: "Fraunces, serif" }}
            >
              Nenhuma campanha encontrada
            </p>
            <p className="text-sm text-text-muted max-w-xs mb-4">
              {search || category !== "all"
                ? "Tente outro filtro ou busca."
                : "Não há campanhas ativas no momento. Volte em breve."}
            </p>
            {(search || category !== "all") && (
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("all");
                }}
                className="px-4 py-2 rounded-xl text-sm font-medium text-primary border border-[#D6E8E3] hover:border-primary hover:bg-[#E6F4F1] transition-all duration-200"
              >
                Limpar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sorted.map((camp) => (
              <CampaignCard key={camp.id} campaign={camp} featured={camp._urgent} />
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
