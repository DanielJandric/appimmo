import { AppShell } from "@/components/AppShell";
import { AuditPanel } from "@/components/AuditPanel";
import { BuildingTwin } from "@/components/BuildingTwin";
import { SectionFrame } from "@/components/SectionFrame";
import { StrategyDashboard } from "@/components/StrategyDashboard";
import { SwipeDeck } from "@/components/SwipeDeck";
import {
  auditFeed,
  buildingTwins,
  morningBriefCards,
  opexLandingData,
  strategyMetrics,
  yieldGapData,
} from "@/lib/mock-data";
export default function Home() {
  const menuSegments = [
    {
      id: "brief",
      label: "Brief",
      detail: "Décisions Garaio / Privera",
    },
    {
      id: "controle",
      label: "Contrôle",
      detail: `${auditFeed.length} alertes`,
    },
    {
      id: "strategie",
      label: "Stratégie",
      detail: `${yieldGapData.length} actifs comparés`,
    },
    {
      id: "jumeaux",
      label: "Jumeaux",
      detail: `${buildingTwins.length} immeubles`,
    },
  ];

  const briefTopSection = (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-[#677f91]">
          Vue &quot;Brief Matinal&quot;
        </p>
        <p className="mt-2 text-sm text-[#5e6674]">
          Cartes générées à partir des 11 actifs du fichier propertylist.txt :
          signaux Garaio, Privera et Banque Cantonale.
        </p>
      </div>
      <SwipeDeck cards={morningBriefCards} />
    </div>
  );

  return (
    <AppShell segments={menuSegments} topSection={briefTopSection}>
      <div className="space-y-14">
        <SectionFrame
          id="controle"
          accent="terracotta"
          eyebrow="Vue Contrôle"
          title="Contrôle & Audit"
          description="Sentinelle email Privera, badge urgent pour fuites et Sismographe gérance Banque Cantonale."
          chip="Audit continu"
          hoverDescription="Flux d’emails analysés (badge URGENT, tags) + Sismographe gérance (temps de réponse) + synthèse IA avec KPIs escalades/conformité/satisfaction."
        >
          <AuditPanel feed={auditFeed} />
        </SectionFrame>

        <SectionFrame
          id="strategie"
          accent="bronze"
          eyebrow="Vue Stratégie"
          title="Stratégie portefeuille"
          description="Comparaison Budget 2025 vs projection IA, yield gap Genève/Vaud et indicateurs agrégés."
          chip="Budget 2025"
          hoverDescription="LineChart Recharts (Budget vs Projection IA) avec tooltip personnalisé + BarChart yield gap. Les cartes métriques synthétisent leakage, vacance pondérée et discount watch."
        >
          <StrategyDashboard
            metrics={strategyMetrics}
            opexData={opexLandingData}
            yieldData={yieldGapData}
          />
        </SectionFrame>

        <SectionFrame
          id="jumeaux"
          accent="slate"
          eyebrow="Vue Jumeau numérique"
          title="Jumeaux numériques"
          description="Scores santé, mix d'exploitation et simulateur CAPEX pour chaque actif issu de propertylist.txt."
          chip="Simulation CAPEX"
          hoverDescription="Sidebar listant les 11 immeubles du fichier public : sélectionner un actif révèle scores financiers/techniques/sociaux et le slider CAPEX met à jour TRI projeté + hausse de loyer."
        >
          <BuildingTwin assets={buildingTwins} />
        </SectionFrame>
      </div>
    </AppShell>
  );
}
