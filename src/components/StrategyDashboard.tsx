"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { StrategyMetric, OpexPoint, YieldGapPoint } from "@/lib/mock-data";
import { formatChf, formatPercent } from "@/lib/utils";

type StrategyDashboardProps = {
  metrics: StrategyMetric[];
  opexData: OpexPoint[];
  yieldData: YieldGapPoint[];
};

export function StrategyDashboard({
  metrics,
  opexData,
  yieldData,
}: StrategyDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="relative overflow-hidden rounded-3xl border border-[#e4e7f0] bg-white p-5 shadow-[0_15px_40px_rgba(15,23,42,0.08)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#1c2f4a]/5 via-transparent to-[#aa8f66]/10" />
            <div className="relative space-y-2">
              <p className="metric-label">{metric.label}</p>
              <p className="font-mono text-2xl text-[#0f1f32]">
                {metric.unit === "currency" && formatChf(metric.value)}
                {metric.unit === "percent" && formatPercent(metric.value)}
                {metric.unit === "count" && `${metric.value.toFixed(0)} dossiers`}
              </p>
              <p className="text-sm text-[#5e6674]">{metric.detail}</p>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                  metric.tendency === "down"
                    ? "border-[#1c2f4a]/30 bg-[#e9edf5] text-[#1c2f4a]"
                    : "border-[#aa8f66]/40 bg-[#fcf5ed] text-[#5c452b]"
                } border`}
              >
                {metric.tendency === "down" ? "Amélioration" : "Risque"}
                &nbsp;{metric.variation > 0 ? "+" : ""}
                {metric.variation.toFixed(1)} %
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-[#e4e7f0] bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="metric-label">OPEX Landing</p>
              <p className="text-lg font-semibold text-[#0f1f32]">
                Budget 2025 vs Projection IA
              </p>
            </div>
            <span className="rounded-full border border-[#f2c8b9] bg-[#fef4ef] px-3 py-1 text-xs font-semibold uppercase text-[#b86f52]">
              Drift T4
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={opexData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.25)" strokeDasharray="4 8" />
                <XAxis
                  dataKey="trimestre"
                  stroke="#94a3b8"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value.toFixed(1)} M`}
                />
                <Tooltip
                  content={<OpexTooltip />}
                  cursor={{ stroke: "rgba(148,163,184,0.3)", strokeWidth: 1 }}
                />
                <Line type="monotone" dataKey="budget" stroke="#677f91" strokeWidth={2} strokeDasharray="6 6" />
                <Line type="monotone" dataKey="projection" stroke="#aa8f66" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-[#e4e7f0] bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="metric-label">Yield Gap</p>
              <p className="text-lg font-semibold text-[#0f1f32]">
                Loyer actuel vs marché
              </p>
            </div>
            <span className="rounded-full border border-[#1c2f4a]/40 bg-[#e9edf5] px-3 py-1 text-xs font-semibold uppercase text-[#1c2f4a]">
              Focus IA
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yieldData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.2)" vertical={false} />
                <XAxis
                  dataKey="actif"
                  stroke="#94a3b8"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value / 1000} k`}
                />
                <Tooltip content={<YieldTooltip />} cursor={{ fill: "rgba(148,163,184,0.08)" }} />
                <Bar dataKey="loyerActuel" fill="#677f91" radius={[8, 8, 0, 0]} barSize={22} />
                <Bar dataKey="loyerMarche" fill="#aa8f66" radius={[8, 8, 0, 0]} barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function OpexTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const budget = payload.find((item) => item.dataKey === "budget")?.value;
  const projection = payload.find((item) => item.dataKey === "projection")?.value;

  return (
    <div className="rounded-2xl border border-[#dfe2eb] bg-white px-4 py-3 text-sm text-[#0f1f32] shadow-[0_15px_45px_rgba(15,23,42,0.15)]">
      <p className="text-xs uppercase tracking-wide text-[#677f91]">{label}</p>
      <p className="mt-1 text-[#1c2f4a]">
        Budget 2025 : <span className="font-mono">{budget?.toFixed(1)} M CHF</span>
      </p>
      <p className="text-[#aa8f66]">
        Projection IA : <span className="font-mono">{projection?.toFixed(1)} M CHF</span>
      </p>
      <p className="text-xs text-[#5e6674]">
        Drift : {(projection - budget).toFixed(1)} M CHF
      </p>
    </div>
  );
}

function YieldTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const actuel = payload.find((item) => item.dataKey === "loyerActuel")?.value;
  const marche = payload.find((item) => item.dataKey === "loyerMarche")?.value;

  return (
    <div className="rounded-2xl border border-[#dfe2eb] bg-white px-4 py-3 text-sm text-[#0f1f32] shadow-[0_15px_45px_rgba(15,23,42,0.15)]">
      <p className="text-xs uppercase tracking-wide text-[#677f91]">{label}</p>
      <p className="text-[#1c2f4a]">
        Loyer actuel : <span className="font-mono">{formatChf(Number(actuel ?? 0))}</span>
      </p>
      <p className="text-[#aa8f66]">
        Loyer marché : <span className="font-mono">{formatChf(Number(marche ?? 0))}</span>
      </p>
      <p className="text-xs text-[#5e6674]">
        Manque à gagner :{" "}
        {formatChf(Number(marche ?? 0) - Number(actuel ?? 0))}
      </p>
    </div>
  );
}

