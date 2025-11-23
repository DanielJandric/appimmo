"use client";

import { AuditItem, managementPulse } from "@/lib/mock-data";
import { AlertTriangle, MailCheck, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

type AuditPanelProps = {
  feed: AuditItem[];
};

export function AuditPanel({ feed }: AuditPanelProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
      <div className="rounded-3xl border border-[#dfe2eb] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="metric-label">Sentinelle email · Privera</p>
            <p className="text-xl font-semibold text-[#0f1f32]">
              Contrôle automatique des flux
            </p>
          </div>
          <Shield className="h-6 w-6 text-[#677f91]" strokeWidth={1.5} />
        </div>

        <div className="space-y-4">
          {feed.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-[#e4e7f0] bg-[#f9fafc] p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#0f1f32]">
                    {item.sujet}
                  </p>
                  <p className="text-xs text-[#677f91]">{item.source}</p>
                </div>
                <span
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-semibold uppercase",
                    item.urgent
                      ? "border-[#b86f52]/40 bg-[#fdece5] text-[#7f351e]"
                      : "border-[#dfe2eb] bg-[#f4f5f8] text-[#5e6775]"
                  )}
                >
                  {item.urgent ? "Urgent" : "Normal"}
                </span>
              </div>
              <p className="mt-2 text-sm text-[#1b2738]">{item.resume}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#dfe2eb] bg-[#f6f8fb] px-3 py-1 text-xs uppercase tracking-wide text-[#677f91]"
                  >
                    {tag}
                  </span>
                ))}
                <span className="text-xs text-[#677f91]">{item.horodatage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-3xl border border-[#f2c8b9] bg-[#fef4ef] p-6 text-[#7f351e] shadow-[0_20px_60px_rgba(184,111,82,0.2)]">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-[#b86f52]" strokeWidth={1.3} />
            <div>
              <p className="metric-label text-[#b86f52]">Sismographe Gérance</p>
              <p className="text-lg font-semibold">
                Temps de réponse moyen : 3.4 jours
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm">
            Au-dessus du SLA Banque Cantonale (2 jours). Déployer task-force infiltration.
          </p>
        </div>

        <div className="rounded-3xl border border-[#dfe2eb] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] space-y-4">
          <div className="flex items-center gap-3">
            <MailCheck className="h-5 w-5 text-[#1c2f4a]" strokeWidth={1.5} />
            <div>
              <p className="metric-label">Statut contrôle</p>
              <p className="text-lg font-semibold text-[#0f1f32]">
                Synthèse IA Contrôle
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <PulseStat
              label="Escalades actives"
              value={managementPulse.escalations}
              tone="rose"
            />
            <PulseStat
              label="Conformité audit"
              value={`${managementPulse.compliance}%`}
              tone="emerald"
            />
            <PulseStat
              label="Satisfaction locataires"
              value={`${managementPulse.satisfaction}/5`}
              tone="sky"
            />
            <PulseStat
              label="Tickets en cours"
              value={managementPulse.backlog}
              tone="amber"
            />
          </div>
        </div>
        <div className="rounded-3xl border border-[#dfe2eb] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] space-y-3">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-[#1c2f4a]" strokeWidth={1.5} />
            <div>
              <p className="metric-label">Backlog email par gérant</p>
              <p className="text-lg font-semibold text-[#0f1f32]">
                File active
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {[
              { name: "Cyril Dupuis", count: 7 },
              { name: "Beat Hotz", count: 2 },
              { name: "Stéphane Chapuis", count: 4 },
            ].map((manager) => (
              <div
                key={manager.name}
                className="flex items-center justify-between rounded-2xl border border-[#e4e7f0] bg-[#f9fafc] px-4 py-2"
              >
                <p className="text-sm font-semibold text-[#1b2738]">
                  {manager.name}
                </p>
                <span className="font-mono text-base text-[#1c2f4a]">
                  {manager.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PulseStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | number;
  tone: "rose" | "emerald" | "sky" | "amber";
}) {
  const toneMap = {
    rose: "text-[#7f351e] border-[#f2c8b9] bg-[#fef4ef]",
    emerald: "text-[#1c2f4a] border-[#dfe2eb] bg-[#f6f8fb]",
    sky: "text-[#35506a] border-[#c7d6e5] bg-[#eef3f7]",
    amber: "text-[#5c452b] border-[#d9c3a7] bg-[#fcf5ed]",
  } as const;

  return (
    <div className={cn("rounded-2xl border p-4", toneMap[tone])}>
      <p className="text-xs uppercase tracking-wide text-[#677f91]">{label}</p>
      <p className="mt-2 font-mono text-xl">{value}</p>
    </div>
  );
}

