"use client";

import { useMemo, useState } from "react";
import { BuildingTwin as BuildingTwinType } from "@/lib/mock-data";
import { cn, formatChf } from "@/lib/utils";

type BuildingTwinProps = {
  assets: BuildingTwinType[];
};

export function BuildingTwin({ assets }: BuildingTwinProps) {
  const [activeId, setActiveId] = useState(assets[0]?.id ?? "");
  const [capex, setCapex] = useState(350_000);
  const selected = useMemo(
    () => assets.find((asset) => asset.id === activeId) ?? assets[0],
    [assets, activeId]
  );

  if (!selected) {
    return null;
  }

  const capexRatio = capex / 1_000_000;
  const projectedTri = (selected.triBase + selected.triSensibilite * capexRatio).toFixed(1);
  const projectedRent =
    selected.hausseBase + selected.hausseSensibilite * capexRatio;

  return (
    <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
      <div className="space-y-3">
        {assets.map((asset) => (
          <button
            key={asset.id}
            type="button"
            onClick={() => setActiveId(asset.id)}
            className={cn(
              "w-full rounded-2xl border p-4 text-left transition",
              asset.id === selected.id
                ? "border-[#1c2f4a] bg-[#1c2f4a] text-white shadow-[0_12px_30px_rgba(17,31,48,0.35)]"
                : "border-[#dfe2eb] bg-white text-[#1b2738] hover:border-[#bfc7d6] hover:bg-[#f6f8fb]"
            )}
          >
            <p className="text-sm font-semibold">{asset.nom}</p>
            <p
              className={cn(
                "text-xs",
                asset.id === selected.id ? "text-white/80" : "text-[#677f91]"
              )}
            >
              {asset.ville}
            </p>
            <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-wide">
              <span>Score santé</span>
              <span className="font-mono text-base">
                {asset.scoreSante.toString().padStart(2, "0")}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-3xl border border-[#dfe2eb] bg-white p-6 shadow-[0_25px_70px_rgba(15,23,42,0.08)] space-y-6">
        <div className="flex flex-col gap-1">
          <p className="metric-label">Jumeau numérique</p>
          <h3 className="text-2xl font-semibold text-[#0f1f32]">{selected.nom}</h3>
          <p className="text-sm text-[#5e6674]">
            {selected.ville} · {selected.proprietaire}
          </p>
          <p className="text-xs text-[#677f91]">ERP : {selected.erp}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <ScorePill label="Financier" value={selected.scoreFinancier} tone="emerald" />
          <ScorePill label="Technique" value={selected.scoreTechnique} tone="amber" />
          <ScorePill label="Social" value={selected.scoreSocial} tone="sky" />
        </div>

        <div className="rounded-3xl border border-[#dfe2eb] bg-white p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="metric-label">Simulateur CAPEX</p>
              <p className="text-lg font-semibold">Montant investissement</p>
            </div>
            <p className="font-mono text-xl text-[#1c2f4a]">
              {formatChf(capex)}
            </p>
          </div>
          <input
            type="range"
            min={0}
            max={1_000_000}
            step={10_000}
            value={capex}
            onChange={(event) => setCapex(Number(event.target.value))}
            className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-[#dfe2eb] accent-[#1c2f4a]"
          />
          <div className="mt-3 flex justify-between text-xs text-[#677f91]">
            <span>0 CHF</span>
            <span>1&apos;000&apos;000 CHF</span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#e4e7f0] bg-[#f9fafc] p-4">
              <p className="metric-label">TRI projeté</p>
              <p className="font-mono text-2xl text-[#0f1f32]">{projectedTri} %</p>
              <p className="text-xs text-[#677f91]">
                Base {selected.triBase}% + sensibilité IA
              </p>
            </div>
            <div className="rounded-2xl border border-[#e4e7f0] bg-[#f9fafc] p-4">
              <p className="metric-label">Hausse loyer modélisée</p>
              <p className="font-mono text-2xl text-[#1c2f4a]">
                +{projectedRent.toFixed(2)} %
              </p>
              <p className="text-xs text-[#677f91]">
                Taux basé sur vacance {selected.vacance} %
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#e4e7f0] bg-[#f9fafc] p-4">
            <p className="metric-label">Notes IA</p>
            <p className="text-sm text-[#1b2738]">{selected.memo}</p>
          </div>
          <div className="rounded-2xl border border-[#e4e7f0] bg-[#f9fafc] p-4">
            <p className="metric-label">Vacance financière</p>
            <p className="font-mono text-xl text-[#b86f52]">
              {selected.vacance.toFixed(1)} %
            </p>
            <p className="text-xs text-[#677f91]">
              Objectif Banque Cantonale : 1.5 %
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScorePill({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "emerald" | "amber" | "sky";
}) {
  const toneMap = {
    emerald: "text-[#1c2f4a] border-[#dfe2eb] bg-[#f6f8fb]",
    amber: "text-[#5c452b] border-[#d9c3a7] bg-[#fcf5ed]",
    sky: "text-[#35506a] border-[#c7d6e5] bg-[#eef3f7]",
  } as const;

  return (
    <div className={cn("rounded-2xl border p-4", toneMap[tone])}>
      <p className="text-xs uppercase text-[#677f91]">{label}</p>
      <p className="mt-2 font-mono text-2xl">{value}</p>
    </div>
  );
}

