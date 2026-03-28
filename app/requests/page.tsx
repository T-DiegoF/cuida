"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useRequests } from "@/lib/hooks/useRequests";
import PageWrapper from "@/components/layout/PageWrapper";
import { SkeletonCard } from "@/components/ui/Skeleton";
import RequestCard from "@/components/features/RequestCard";
import { useAuth } from "@/lib/hooks/useAuth";
import { MedicalRequestWithPatient, UrgencyLevel } from "@/types/database";

const SPECIALTIES = [
  "Cardiologia", "Pediatria", "Clínica Geral", "Neurologia",
  "Ortopedia", "Oncologia", "Psiquiatria", "Ginecologia",
  "Dermatologia", "Endocrinologia",
];

const URGENCY_OPTIONS: { value: UrgencyLevel; label: string }[] = [
  { value: "low", label: "Baixa" },
  { value: "medium", label: "Média" },
  { value: "high", label: "Alta" },
  { value: "critical", label: "Crítico" },
];

const LOCATIONS = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Salvador", "Fortaleza"];

export default function RequestsPage() {
  const { profile, role, signOut } = useAuth();
  const { getAll } = useRequests();

  const [requests, setRequests] = useState<MedicalRequestWithPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [selectedUrgency, setSelectedUrgency] = useState<UrgencyLevel | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    const data = await getAll({
      specialty: selectedSpecialty ?? undefined,
      urgency: selectedUrgency ?? undefined,
      location: selectedLocation ?? undefined,
      status: "open",
    });
    setRequests(data);
    setLoading(false);
  }, [getAll, selectedSpecialty, selectedUrgency, selectedLocation]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const filtered = search.trim()
    ? requests.filter(
        (r) =>
          r.title.toLowerCase().includes(search.toLowerCase()) ||
          r.description?.toLowerCase().includes(search.toLowerCase()) ||
          r.specialty_needed?.toLowerCase().includes(search.toLowerCase())
      )
    : requests;

  const hasActiveFilters = selectedSpecialty || selectedUrgency || selectedLocation;

  function clearFilters() {
    setSelectedSpecialty(null);
    setSelectedUrgency(null);
    setSelectedLocation(null);
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
      {/* Page header */}
      <div className="mb-6">
        <h1
          className="text-2xl md:text-3xl font-semibold text-text-main"
          style={{ fontFamily: "Fraunces, serif" }}
        >
          Pedidos de assistência
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Pessoas que precisam de apoio médico voluntário
        </p>
      </div>

      {/* Search + filter toggle */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título, especialidade..."
            aria-label="Buscar pedidos"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-text-main bg-white border border-[#D6E8E3] outline-none placeholder:text-text-muted transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button
          onClick={() => setShowFilters((v) => !v)}
          aria-expanded={showFilters}
          aria-label="Mostrar filtros"
          className={`
            flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200
            ${showFilters || hasActiveFilters
              ? "bg-primary text-white border-primary"
              : "bg-white text-text-muted border-[#D6E8E3] hover:border-primary hover:text-primary"
            }
          `}
        >
          <SlidersHorizontal size={15} />
          Filtros
          {hasActiveFilters && (
            <span className="w-4 h-4 rounded-full bg-white/30 text-xs flex items-center justify-center font-bold">
              {[selectedSpecialty, selectedUrgency, selectedLocation].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white rounded-2xl p-5 mb-5 flex flex-col gap-5 animate-fade-up" style={{ boxShadow: "0 4px 24px rgba(26,107,90,0.08)" }}>
          {/* Specialty */}
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Especialidade</p>
            <div className="flex flex-wrap gap-2">
              {SPECIALTIES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSpecialty(selectedSpecialty === s ? null : s)}
                  aria-pressed={selectedSpecialty === s}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    selectedSpecialty === s
                      ? "bg-primary text-white"
                      : "bg-[#E6F4F1] text-primary hover:bg-primary hover:text-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Urgency */}
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Urgência</p>
            <div className="flex flex-wrap gap-2">
              {URGENCY_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setSelectedUrgency(selectedUrgency === value ? null : value)}
                  aria-pressed={selectedUrgency === value}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    selectedUrgency === value
                      ? "bg-primary text-white"
                      : "bg-[#E6F4F1] text-primary hover:bg-primary hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Localização</p>
            <div className="flex flex-wrap gap-2">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setSelectedLocation(selectedLocation === loc ? null : loc)}
                  aria-pressed={selectedLocation === loc}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    selectedLocation === loc
                      ? "bg-primary text-white"
                      : "bg-[#E6F4F1] text-primary hover:bg-primary hover:text-white"
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-accent transition-colors self-start"
            >
              <X size={12} />
              Limpar filtros
            </button>
          )}
        </div>
      )}

      {/* Active filter chips */}
      {hasActiveFilters && !showFilters && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedSpecialty && (
            <FilterChip label={selectedSpecialty} onRemove={() => setSelectedSpecialty(null)} />
          )}
          {selectedUrgency && (
            <FilterChip
              label={URGENCY_OPTIONS.find((u) => u.value === selectedUrgency)?.label ?? selectedUrgency}
              onRemove={() => setSelectedUrgency(null)}
            />
          )}
          {selectedLocation && (
            <FilterChip label={selectedLocation} onRemove={() => setSelectedLocation(null)} />
          )}
        </div>
      )}

      {/* Results count */}
      {!loading && (
        <p className="text-xs text-text-muted mb-4">
          {filtered.length} {filtered.length === 1 ? "pedido encontrado" : "pedidos encontrados"}
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState hasFilters={!!hasActiveFilters || !!search} onClear={() => { clearFilters(); setSearch(""); }} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((req) => (
            <RequestCard key={req.id} request={req} />
          ))}
        </div>
      )}
    </PageWrapper>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full text-xs font-medium bg-[#E6F4F1] text-primary">
      {label}
      <button onClick={onRemove} aria-label={`Remover filtro ${label}`} className="hover:text-accent transition-colors">
        <X size={11} />
      </button>
    </span>
  );
}

function EmptyState({ hasFilters, onClear }: { hasFilters: boolean; onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {/* Simple SVG illustration */}
      <svg width="120" height="100" viewBox="0 0 120 100" fill="none" aria-hidden="true" className="mb-6 opacity-60">
        <circle cx="60" cy="45" r="35" fill="#E6F4F1" />
        <path d="M45 45 C45 37, 52 30, 60 30 C68 30, 75 37, 75 45 C75 55, 66 62, 60 67 C54 62, 45 55, 45 45Z" fill="#1A6B5A" opacity="0.2" stroke="#1A6B5A" strokeWidth="2" />
        <path d="M50 45 L55 45 L57 39 L61 51 L63 43 L65 45 L70 45" stroke="#F4845F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M30 85 Q60 95 90 85" stroke="#D6E8E3" strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
      <p className="text-base font-semibold text-text-main mb-2" style={{ fontFamily: "Fraunces, serif" }}>
        Nenhum pedido encontrado
      </p>
      <p className="text-sm text-text-muted max-w-xs">
        {hasFilters
          ? "Tente remover os filtros para ver mais pedidos."
          : "Não há pedidos abertos no momento. Volte em breve."}
      </p>
      {hasFilters && (
        <button
          onClick={onClear}
          className="mt-4 px-4 py-2 rounded-xl text-sm font-medium text-primary border border-[#D6E8E3] hover:border-primary hover:bg-[#E6F4F1] transition-all duration-200"
        >
          Limpar filtros
        </button>
      )}
    </div>
  );
}
