"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Menu } from "lucide-react";
import {
  killerKpis,
  portfolioBaseline,
  portfolioForecast,
} from "@/lib/mock-data";
import { cn, formatChf } from "@/lib/utils";

const navItems = [
  {
    id: "brief",
    label: "Brief",
    description: "Décisions express",
  },
  {
    id: "controle",
    label: "Contrôle",
    description: "Audit & alertes",
  },
  {
    id: "strategie",
    label: "Stratégie",
    description: "Lecture OPEX & yield",
  },
  {
    id: "jumeaux",
    label: "Jumeaux",
    description: "Jumeau numérique",
  },
];

const sparklineMax = Math.max(...killerKpis.freeCashFlow.sparkline);
const sparklineMin = Math.min(...killerKpis.freeCashFlow.sparkline);

type SegmentLink = {
  id: string;
  label: string;
  detail: string;
};

type AppShellProps = {
  children: React.ReactNode;
  segments: SegmentLink[];
  topSection?: React.ReactNode;
};

export function AppShell({
  children,
  segments,
  topSection,
}: AppShellProps) {
  const [activeId, setActiveId] = useState("brief");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const observer = useMemo(() => {
    if (typeof window === "undefined") return null;
    return new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0.1 }
    );
  }, []);

  useEffect(() => {
    if (!observer) return;
    const sections = document.querySelectorAll("[data-shell-section]");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
      observer.disconnect();
    };
  }, [observer]);

  const handleNavClick = useCallback((id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <div className="min-h-screen text-[#1b2738]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:px-10 lg:py-8">
        <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-64 flex-shrink-0 flex-col rounded-3xl border border-[#dfe2eb] bg-white p-6 shadow-[0_25px_60px_rgba(16,24,40,0.08)] lg:flex">
          <div className="mb-10 space-y-5">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[#677f91]">
                Neural Asset Manager
              </p>
              <p className="mt-2 text-lg font-semibold text-[#0f1f32]">
                Console IA Suisse romande
              </p>
              <p className="text-sm text-[#5e6674]">
                Alignée Banque Cantonale · Données Garaio / Privera
              </p>
            </div>
            <div className="rounded-2xl border border-[#dfe2eb] bg-[#f6f8fb] p-4">
              <p className="metric-label">Reporting live</p>
              <p className="mt-2 text-sm font-semibold text-[#1c2f4a]">
                +2.8 % rendement net hebdo
              </p>
              <p className="text-xs text-[#677f91]">
                Alignement automatique 05h04 · Source IA Banque Cantonale
              </p>
            </div>
          </div>

          <nav className="flex flex-1 flex-col gap-2">
            {navItems.map(({ id, label, description }) => (
              <button
                key={id}
                type="button"
                onClick={() => handleNavClick(id)}
                className={cn(
                  "flex flex-col gap-1 rounded-2xl border px-4 py-3 text-left transition-all",
                  activeId === id
                    ? "border-[#1c2f4a] bg-[#1c2f4a] text-white shadow-[0_18px_35px_rgba(17,31,48,0.3)]"
                    : "border-transparent bg-[#f4f4f4] text-[#4a5361] hover:border-[#d6dbe5] hover:bg-white"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold uppercase tracking-wide">
                    {label}
                  </span>
                </div>
                <p
                  className={cn(
                    "text-xs",
                    activeId === id ? "text-white/80" : "text-[#7a8494]"
                  )}
                >
                  {description}
                </p>
              </button>
            ))}
          </nav>

          <div className="mt-8 rounded-2xl border border-[#dfe2eb] bg-[#f6f8fb] p-4">
            <div className="flex items-center justify-between text-xs uppercase text-[#677f91]">
              <span>Flux prioritaire</span>
              <ArrowUpRight className="h-4 w-4 text-[#1c2f4a]" />
            </div>
            <p className="mt-2 text-sm font-semibold text-[#0f1f32]">
              Privera · Audit infiltration
            </p>
            <p className="text-xs text-[#5e6674]">
              Commander équipe Helvétique Facility avant 09h30.
            </p>
          </div>
        </aside>

        <main className="flex-1 space-y-12 pb-24 lg:pb-16">
          <div className="flex flex-col gap-3 lg:hidden">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-[#677f91]">
                  Investis Group
                </p>
                <p className="text-lg font-semibold text-[#0f1f32]">
                  Console mobile IA
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMobileNavOpen((prev) => !prev)}
                aria-expanded={mobileNavOpen}
                className="ml-auto flex items-center gap-2 rounded-full border border-[#dfe2eb] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#1c2f4a]"
              >
                Segments
                <Menu className="h-4 w-4" />
              </button>
            </div>
            {mobileNavOpen ? (
              <div className="rounded-3xl border border-[#e5e8f0] bg-white p-3 shadow-[0_15px_40px_rgba(15,23,42,0.15)]">
                <div className="grid gap-2 sm:grid-cols-2">
                  {segments.map((segment) => (
                    <button
                      key={segment.id}
                      type="button"
                      onClick={() => {
                        setMobileNavOpen(false);
                        handleNavClick(segment.id);
                      }}
                      className="rounded-2xl border border-[#eef1f7] px-3 py-2 text-left text-sm text-[#0f1f32] hover:border-[#dce2f0]"
                    >
                      <p className="font-semibold">{segment.label}</p>
                      <p className="text-xs text-[#6b7382]">
                        {segment.detail}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <section
            id="brief"
            data-shell-section
            className="space-y-6 scroll-mt-28"
          >
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <p className="metric-label">Investis Group</p>
                <p className="text-2xl font-semibold text-[#0f1f32]">
                  Brief matinal consolidé
                </p>
              </div>
              <span className="rounded-full border border-[#aa8f66]/40 bg-[#faefe2] px-3 py-1 text-xs font-medium text-[#5c452b]">
                Mode confiance IA
              </span>
              <div className="ml-auto hidden items-center gap-2 lg:flex">
                <p className="text-xs uppercase tracking-[0.3em] text-[#677f91]">
                  Segmentation IA
                </p>
                <div className="relative">
                  <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((prev) => !prev)}
                    className="rounded-full border border-[#dfe2eb] bg-white p-2 text-[#1c2f4a] shadow-sm hover:border-[#c7cedd]"
                  >
                    <Menu className="h-4 w-4" />
                  </button>
                  {menuOpen ? (
                    <div className="absolute right-0 top-12 z-30 w-64 rounded-2xl border border-[#dfe2eb] bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
                      <p className="text-xs uppercase tracking-[0.3em] text-[#677f91]">
                        Navigator
                      </p>
                      <div className="mt-3 space-y-3">
                        {segments.map((segment) => (
                          <button
                            key={segment.id}
                            type="button"
                            onClick={() => {
                              setMenuOpen(false);
                              handleNavClick(segment.id);
                            }}
                            className="w-full rounded-xl border border-[#e3e7f0] bg-[#f6f8fb] px-3 py-2 text-left text-[#1b2738] hover:border-[#d0d7e6] hover:bg-white"
                          >
                            <p className="text-sm font-semibold text-[#0f1f32]">
                              {segment.label}
                            </p>
                            <p className="text-xs text-[#6b7382]">
                              {segment.detail}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-[#dfe2eb] bg-white p-4 shadow-[0_25px_70px_rgba(16,24,40,0.08)] sm:p-6">
              <div className="grid gap-4 xl:grid-cols-4">
                <div className="rounded-3xl border border-[#f2c8b9] bg-[#fef4ef] p-4 shadow-[0_20px_50px_rgba(184,111,82,0.15)]">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.4em] text-[#b86f52]">
                    Manque à gagner
                  </p>
                  <span className="text-sm text-[#b86f52]">KPI #1</span>
                </div>
                <p className="mt-3 text-3xl font-semibold text-[#7f351e]">
                  {formatChf(killerKpis.revenueLeakage.total)}{" "}
                  <span className="text-base text-[#b86f52]">
                    / {killerKpis.revenueLeakage.cadence}
                  </span>
                </p>
                <p className="mt-2 text-xs text-[#7f351e]">
                  Dont {formatChf(killerKpis.revenueLeakage.breakdown.indexation)}{" "}
                  indexation · {formatChf(killerKpis.revenueLeakage.breakdown.vacance)} vacance ·{" "}
                  {formatChf(killerKpis.revenueLeakage.breakdown.contentieux)} impayés.
                </p>
                <button
                  type="button"
                  className="mt-4 w-full rounded-2xl border border-[#b86f52]/40 bg-[#b86f52] py-2 text-sm font-semibold text-white transition hover:bg-[#a65f45]"
                >
                  {killerKpis.revenueLeakage.action}
                </button>
              </div>

              <div className="rounded-3xl border border-[#d9c3a7] bg-[#fcf5ed] p-4 shadow-[0_20px_50px_rgba(170,143,102,0.18)]">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.4em] text-[#aa8f66]">
                    Potentiel marché
                  </p>
                  <span className="text-sm text-[#aa8f66]">KPI #2</span>
                </div>
                <p className="mt-3 text-3xl font-semibold text-[#5c452b]">
                  + {killerKpis.reversionaryPotential.percent.toFixed(1)} %
                </p>
                <p className="text-xs text-[#5c452b]">
                  {killerKpis.reversionaryPotential.statement}
                </p>
                <p className="mt-2 text-xs text-[#7c6141]">
                  {killerKpis.reversionaryPotential.recommendation}
                </p>
              </div>

                <div className="rounded-3xl border border-[#dfe2eb] bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.4em] text-[#677f91]">
                    Cashflow net (mois)
                  </p>
                  <span className="text-sm text-[#7a8291]">KPI #3</span>
                </div>
                <p className="mt-3 text-3xl font-semibold text-[#0f1f32]">
                  {formatChf(killerKpis.freeCashFlow.value)}
                </p>
                <p className="text-xs text-[#677f91]">
                  Budget {formatChf(killerKpis.freeCashFlow.budget)}
                </p>
                <div className="mt-3 flex h-12 items-end gap-1">
                  {killerKpis.freeCashFlow.sparkline.map((point, index) => {
                    const normalized =
                      (point - sparklineMin) / (sparklineMax - sparklineMin || 1);
                    return (
                      <div
                        key={`${point}-${index}`}
                        className="w-2 rounded-full bg-gradient-to-t from-[#dfe2eb] to-[#1c2f4a]"
                        style={{ height: `${Math.max(normalized * 100, 8)}%` }}
                      />
                    );
                  })}
                </div>
              </div>

                <div className="rounded-3xl border border-[#c7d6e5] bg-[#eef3f7] p-4 shadow-[0_20px_50px_rgba(103,127,145,0.2)]">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.4em] text-[#677f91]">
                    Risque vacance
                  </p>
                  <span className="text-sm text-[#677f91]">KPI #4</span>
                </div>
                <p className="mt-3 text-3xl font-semibold text-[#1c2f4a]">
                  {killerKpis.churnRisk.score}/100
                </p>
                <p className="text-xs text-[#677f91]">
                  {killerKpis.churnRisk.level} · {killerKpis.churnRisk.delta} pts ce matin
                </p>
                  <p className="mt-2 text-xs text-[#1c2f4a]">
                    {killerKpis.churnRisk.alert}
                  </p>
                </div>
              </div>
              {topSection ? <div className="mt-8">{topSection}</div> : null}
            </div>
          </section>

          {children}
        </main>
      </div>
    </div>
  );
}

