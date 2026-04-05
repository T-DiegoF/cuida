"use client";

import { useState, useMemo } from "react";
import { Search, Plus } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import PageWrapper from "@/components/layout/PageWrapper";
import CampaignCard from "@/components/features/CampaignCard";
import { CampaignWithPatient } from "@/types/database";
import Link from "next/link";

const CATEGORIES = [
  { value: "all", label: "Todas" },
  { value: "cirurgia", label: "Cirurgia" },
  { value: "medicação", label: "Medicação" },
  { value: "tratamento", label: "Tratamento" },
  { value: "reabilitação", label: "Reabilitação" },
  { value: "outros", label: "Outros" },
];

interface Props {
  initialCampaigns: CampaignWithPatient[];
  profile: { full_name: string | null; role: string | null; avatar_url: string | null } | null;
}

export default function CampaignsClient({ initialCampaigns, profile }: Props) {
  const { signOut } = useAuth();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const sorted = useMemo(() => {
    const filtered = initialCampaigns.filter((c) => {
      const matchSearch =
        !search.trim() ||
        c.title.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        category === "all" ||
        c.title.toLowerCase().includes(category);
      return matchSearch && matchCategory;
    });
    const withUrgency = filtered.map((c) => ({
      ...c,
      _urgent:
        c.goal_amount > 0 &&
        c.current_amount / c.goal_amount >= 0.85 &&
        c.current_amount < c.goal_amount,
    }));
    return [
      ...withUrgency.filter((c) => c._urgent),
      ...withUrgency.filter((c) => !c._urgent),
    ];
  }, [initialCampaigns, search, category]);

  return (
    <PageWrapper
      showNav
      isLoggedIn={!!profile}
      userName={profile?.full_name ?? undefined}
      userRole={profile?.role ?? undefined}
      avatarUrl={profile?.avatar_url ?? undefined}
      onSignOut={signOut}
    >
      {/* Hero banner */}
      <div className="relative bg-primary rounded-2xl overflow-hidden mb-8 px-6 py-10 md:py-14">
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
            {profile?.role === "patient" && (
              <Link
                href="/campaigns/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-primary bg-white hover:bg-[#F0FAF8] transition-all duration-200 active:scale-95"
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
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6 -mx-1 px-1" role="group" aria-label="Filtrar por categoria">
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
      <p className="text-xs text-text-muted mb-4">
        {sorted.length}{" "}
        {sorted.length === 1 ? "campanha encontrada" : "campanhas encontradas"}
      </p>

      {/* Grid */}
      <div id="campaigns-grid">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <p className="text-4xl mb-3">💚</p>
            <p className="text-base font-semibold text-text-main mb-2" style={{ fontFamily: "Fraunces, serif" }}>
              Nenhuma campanha encontrada
            </p>
            <p className="text-sm text-text-muted max-w-xs mb-4">
              {search || category !== "all"
                ? "Tente outro filtro ou busca."
                : "Não há campanhas ativas no momento."}
            </p>
            {(search || category !== "all") && (
              <button
                onClick={() => { setSearch(""); setCategory("all"); }}
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
