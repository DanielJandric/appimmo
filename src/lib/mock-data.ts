import { formatChf } from "./utils";

const CURRENT_YEAR = 2025;
const CHF_MILLION = 1_000_000;

type PropertySource = {
  id: string;
  adresse: string;
  ville: string;
  marketValueMChf: number;
  grossRentalMChf: number;
  netRentalMChf: number;
  vacancyRatePct: number;
  discountRatePct: number;
  siteArea: number;
  lettableArea: number;
  residentialSharePct: number;
  retailSharePct?: number;
  otherSharePct?: number;
  constructionYear: number;
  acquisitionYear?: number | null;
  renovationYear?: number | null;
};

export type PropertyAsset = {
  id: string;
  adresse: string;
  ville: string;
  marketValue: number;
  marketValueMChf: number;
  grossRental: number;
  grossRentalMChf: number;
  netRental: number;
  netRentalMChf: number;
  vacancyRate: number;
  discountRate: number;
  siteArea: number;
  lettableArea: number;
  mix: {
    residential: number;
    retail: number;
    other: number;
  };
  constructionYear: number;
  acquisitionYear?: number | null;
  renovationYear?: number | null;
};

export type BriefCard = {
  id: string;
  type: "indexation" | "facture" | "vacance" | "maintenance";
  titre: string;
  contenu: string;
  localisation: string;
  locataire?: string;
  montantActuel?: number;
  montantCible?: number;
  urgence?: "haute" | "normale";
  tags: string[];
  source: string;
};

export type StrategyMetric = {
  id: string;
  label: string;
  unit: "currency" | "percent" | "count";
  value: number;
  variation: number;
  tendency: "up" | "down";
  detail: string;
};

export type OpexPoint = {
  trimestre: string;
  budget: number;
  projection: number;
};

export type YieldGapPoint = {
  actif: string;
  ville: string;
  loyerActuel: number;
  loyerMarche: number;
};

export type BuildingTwin = {
  id: string;
  nom: string;
  ville: string;
  proprietaire: string;
  erp: string;
  scoreSante: number;
  scoreFinancier: number;
  scoreTechnique: number;
  scoreSocial: number;
  vacance: number;
  triBase: number;
  triSensibilite: number;
  hausseBase: number;
  hausseSensibilite: number;
  memo: string;
};

export type AuditItem = {
  id: string;
  sujet: string;
  resume: string;
  source: string;
  horodatage: string;
  urgent?: boolean;
  tags: string[];
};

const propertySources: PropertySource[] = [
  {
    id: "rue-du-mole-5",
    adresse: "Rue du Môle 5",
    ville: "Genève",
    marketValueMChf: 19.4,
    grossRentalMChf: 0.6,
    netRentalMChf: 0.6,
    vacancyRatePct: 0,
    discountRatePct: 2.54,
    siteArea: 277,
    lettableArea: 1518,
    residentialSharePct: 85,
    retailSharePct: 0,
    otherSharePct: 15,
    constructionYear: 1957,
    acquisitionYear: 2000,
    renovationYear: 2014,
  },
  {
    id: "rue-de-la-servette-23",
    adresse: "Rue de la Servette 23",
    ville: "Genève",
    marketValueMChf: 20.9,
    grossRentalMChf: 0.8,
    netRentalMChf: 0.8,
    vacancyRatePct: 0,
    discountRatePct: 2.55,
    siteArea: 421,
    lettableArea: 2149,
    residentialSharePct: 61,
    retailSharePct: 16,
    otherSharePct: 23,
    constructionYear: 1967,
    acquisitionYear: 1999,
  },
  {
    id: "rue-du-grand-pre-39",
    adresse: "Rue du Grand-Pré 39",
    ville: "Genève",
    marketValueMChf: 16.8,
    grossRentalMChf: 0.6,
    netRentalMChf: 0.6,
    vacancyRatePct: 3.3,
    discountRatePct: 2.51,
    siteArea: 393,
    lettableArea: 2043,
    residentialSharePct: 87,
    retailSharePct: 0,
    otherSharePct: 13,
    constructionYear: 1962,
    acquisitionYear: 1997,
  },
  {
    id: "rue-des-asters-8",
    adresse: "Rue des Asters 8",
    ville: "Genève",
    marketValueMChf: 9.1,
    grossRentalMChf: 0.3,
    netRentalMChf: 0.3,
    vacancyRatePct: 0,
    discountRatePct: 2.61,
    siteArea: 302,
    lettableArea: 1115,
    residentialSharePct: 83,
    retailSharePct: 0,
    otherSharePct: 17,
    constructionYear: 1910,
    acquisitionYear: 2002,
    renovationYear: 2022,
  },
  {
    id: "avenue-echallens-87-89",
    adresse: "Avenue d'Echallens 87/89",
    ville: "Lausanne",
    marketValueMChf: 6.1,
    grossRentalMChf: 0.2,
    netRentalMChf: 0.2,
    vacancyRatePct: 0,
    discountRatePct: 2.85,
    siteArea: 535,
    lettableArea: 822,
    residentialSharePct: 100,
    retailSharePct: 0,
    otherSharePct: 0,
    constructionYear: 1899,
    acquisitionYear: 2015,
    renovationYear: 2022,
  },
  {
    id: "chemin-montmeillan-19-21",
    adresse: "Chemin de Montmeillan 19/21",
    ville: "Lausanne",
    marketValueMChf: 13.6,
    grossRentalMChf: 0.5,
    netRentalMChf: 0.5,
    vacancyRatePct: 0,
    discountRatePct: 2.65,
    siteArea: 1158,
    lettableArea: 1661,
    residentialSharePct: 85,
    retailSharePct: 0,
    otherSharePct: 15,
    constructionYear: 1966,
    acquisitionYear: 2004,
    renovationYear: 2009,
  },
  {
    id: "avenue-du-censuy-18-26",
    adresse: "Avenue du Censuy 18-26",
    ville: "Renens",
    marketValueMChf: 36.9,
    grossRentalMChf: 1.4,
    netRentalMChf: 1.4,
    vacancyRatePct: 0.1,
    discountRatePct: 2.65,
    siteArea: 6321,
    lettableArea: 6014,
    residentialSharePct: 91,
    retailSharePct: 6,
    otherSharePct: 3,
    constructionYear: 1972,
    acquisitionYear: 2003,
    renovationYear: 2009,
  },
  {
    id: "avenue-tir-federal-79-81",
    adresse: "Avenue du Tir-Fédéral 79/81",
    ville: "Chavannes-Renens",
    marketValueMChf: 27.4,
    grossRentalMChf: 1.0,
    netRentalMChf: 1.0,
    vacancyRatePct: 0.2,
    discountRatePct: 2.71,
    siteArea: 2898,
    lettableArea: 3442,
    residentialSharePct: 100,
    retailSharePct: 0,
    otherSharePct: 0,
    constructionYear: 1962,
    acquisitionYear: 1997,
    renovationYear: 2007,
  },
  {
    id: "rue-de-couvaloup-24",
    adresse: "Rue de Couvaloup 24",
    ville: "Morges",
    marketValueMChf: 12.4,
    grossRentalMChf: 0.6,
    netRentalMChf: 0.6,
    vacancyRatePct: 0,
    discountRatePct: 3.11,
    siteArea: 612,
    lettableArea: 1869,
    residentialSharePct: 50,
    retailSharePct: 20,
    otherSharePct: 30,
    constructionYear: 1963,
    acquisitionYear: 2021,
  },
  {
    id: "route-aloys-fauquez-122-124",
    adresse: "Route Aloys Fauquez 122/124",
    ville: "Lausanne",
    marketValueMChf: 25.7,
    grossRentalMChf: 0.9,
    netRentalMChf: 0.9,
    vacancyRatePct: 0,
    discountRatePct: 2.75,
    siteArea: 1447,
    lettableArea: 3472,
    residentialSharePct: 91,
    retailSharePct: 4,
    otherSharePct: 5,
    constructionYear: 1968,
    acquisitionYear: 2016,
    renovationYear: 2023,
  },
  {
    id: "avenue-victor-ruffy-33",
    adresse: "Avenue Victor-Ruffy 33",
    ville: "Lausanne",
    marketValueMChf: 7.2,
    grossRentalMChf: 0.3,
    netRentalMChf: 0.3,
    vacancyRatePct: 0,
    discountRatePct: 2.65,
    siteArea: 1097,
    lettableArea: 1120,
    residentialSharePct: 100,
    retailSharePct: 0,
    otherSharePct: 0,
    constructionYear: 1952,
    acquisitionYear: 2018,
  },
];

export const propertyAssets: PropertyAsset[] = propertySources.map((asset) => {
  const retailShare = asset.retailSharePct ?? 0;
  const otherShare =
    asset.otherSharePct ??
    Math.max(0, 100 - asset.residentialSharePct - retailShare);

  return {
    id: asset.id,
    adresse: asset.adresse,
    ville: asset.ville,
    marketValue: Math.round(asset.marketValueMChf * CHF_MILLION),
    marketValueMChf: asset.marketValueMChf,
    grossRental: Math.round(asset.grossRentalMChf * CHF_MILLION),
    grossRentalMChf: asset.grossRentalMChf,
    netRental: Math.round(asset.netRentalMChf * CHF_MILLION),
    netRentalMChf: asset.netRentalMChf,
    vacancyRate: asset.vacancyRatePct,
    discountRate: asset.discountRatePct,
    siteArea: asset.siteArea,
    lettableArea: asset.lettableArea,
    mix: {
      residential: asset.residentialSharePct,
      retail: retailShare,
      other: Number(otherShare.toFixed(1)),
    },
    constructionYear: asset.constructionYear,
    acquisitionYear: asset.acquisitionYear ?? null,
    renovationYear: asset.renovationYear ?? null,
  };
});

const findAsset = (id: string) =>
  propertyAssets.find((asset) => asset.id === id)!;

const monthlyNet = (asset: PropertyAsset) => asset.netRental / 12;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const yearsSinceRefit = (asset: PropertyAsset) => {
  const reference = asset.renovationYear ?? asset.constructionYear;
  return CURRENT_YEAR - reference;
};

export const morningBriefCards: BriefCard[] = [
  (() => {
    const asset = findAsset("rue-du-mole-5");
    const actuel = monthlyNet(asset);
    const cible = actuel * 1.045;
    return {
      id: "brief-rue-du-mole",
      type: "indexation",
      titre: `${asset.adresse} — Indexation IPC`,
      contenu: `Valeur ${asset.marketValueMChf.toFixed(
        1
      )} MCHF, vacance ${asset.vacancyRate.toFixed(
        1
      )} %. Discount à 2.54 %. Augmenter la base nette mensuelle de ${formatChf(
        actuel
      )} à ${formatChf(
        cible
      )} pour rester aligné avec l'IPC genevois et le benchmark Banque Cantonale.`,
      localisation: `${asset.ville} · Parc résidentiel`,
      locataire: "Portefeuille résidentiel Garaio",
      montantActuel: Math.round(actuel),
      montantCible: Math.round(cible),
      urgence: "normale",
      tags: ["Indexation", "IPC Genève", "propertylist.txt"],
      source: "propertylist.txt · 30.06.2025",
    };
  })(),
  (() => {
    const asset = findAsset("avenue-du-censuy-18-26");
    const actuel = monthlyNet(asset);
    const cible = actuel * 1.06;
    return {
      id: "reloc-censuy",
      type: "indexation",
      titre: "Renens — hausse à la relocation",
      contenu:
        "Relocation 4.5 pièces escalier C. L'IA suggère +6 % dès la signature pour rattraper le marché.",
      localisation: `${asset.ville} · ${asset.adresse}`,
      locataire: "Nouveau bail BCV",
      montantActuel: Math.round(actuel),
      montantCible: Math.round(cible),
      tags: ["Relocation", "Indexation", "BCV"],
      source: "Workflow relocation · propertylist.txt",
    };
  })(),
  (() => {
    const asset = findAsset("rue-du-grand-pre-39");
    const actuel = monthlyNet(asset);
    const perte = (asset.vacancyRate / 100) * actuel;
    return {
      id: "vacance-grand-pre",
      type: "vacance",
      titre: `${asset.adresse} — Vacance 3.3 %`,
      contenu: `Perte mensuelle ${formatChf(
        perte
      )}. Publier l'annonce Carrefour Immobilier + Helvétique Facility.`,
      localisation: `${asset.ville} · Quartier Nations`,
      montantActuel: Math.round(actuel),
      montantCible: Math.round(actuel * 1.05),
      urgence: "haute",
      tags: ["Vacance", "Marketing", "Genève"],
      source: "Sentinelle IA · propertylist.txt",
    };
  })(),
  (() => {
    const asset = findAsset("avenue-victor-ruffy-33");
    return {
      id: "maintenance-ruffy",
      type: "maintenance",
      titre: "Lausanne — planning maintenance courante",
      contenu:
        "Demande de Helvétique Facility pour remplacer la ventilation des caves. Budget 18'400 CHF.",
      localisation: `${asset.ville} · ${asset.adresse}`,
      montantActuel: 18_400,
      tags: ["Maintenance", "Helvétique Facility"],
      source: "Ticket Facility · propertylist.txt",
    };
  })(),
];

const totalMarketValue = propertyAssets.reduce(
  (sum, asset) => sum + asset.marketValue,
  0
);
const totalNetRental = propertyAssets.reduce(
  (sum, asset) => sum + asset.netRental,
  0
);
const weightedVacancy =
  propertyAssets.reduce(
    (sum, asset) => sum + asset.vacancyRate * asset.netRental,
    0
  ) /
  (totalNetRental || 1);
const leakageChf = propertyAssets.reduce(
  (sum, asset) => sum + (asset.vacancyRate / 100) * asset.netRental,
  0
);
const highDiscountCount = propertyAssets.filter(
  (asset) => asset.discountRate > 2.7
).length;

export const strategyMetrics: StrategyMetric[] = [
  {
    id: "leakage",
    label: "Pertes liées à la vacance",
    unit: "currency",
    value: Math.round(leakageChf),
    variation: -4.2,
    tendency: "down",
    detail: "Calcul pondéré sur propertylist.txt (mix Genève + Vaud).",
  },
  {
    id: "vacance-financiere",
    label: "Taux de vacance financière",
    unit: "percent",
    value: Number(weightedVacancy.toFixed(1)),
    variation: -0.2,
    tendency: "down",
    detail: "Vacance moyenne pondérée par loyers nets.",
  },
  {
    id: "discount-watch",
    label: "Actifs à arbitrer (discount > 2.7 %)",
    unit: "count",
    value: highDiscountCount,
    variation: 1.3,
    tendency: "up",
    detail: "Focus sur Lausanne Ouest + Renens.",
  },
];

const annualNetM = totalNetRental / CHF_MILLION;
const quarterBase = annualNetM / 4;

export const opexLandingData: OpexPoint[] = [
  { trimestre: "T1", budget: Number((quarterBase * 0.98).toFixed(2)), projection: Number((quarterBase * 0.96).toFixed(2)) },
  { trimestre: "T2", budget: Number((quarterBase * 1.0).toFixed(2)), projection: Number((quarterBase * 0.99).toFixed(2)) },
  { trimestre: "T3", budget: Number((quarterBase * 1.01).toFixed(2)), projection: Number((quarterBase * 1.04).toFixed(2)) },
  { trimestre: "T4", budget: Number((quarterBase * 1.03).toFixed(2)), projection: Number((quarterBase * 1.12).toFixed(2)) },
];

const yieldAssets = [
  { id: "rue-du-mole-5", uplift: 0.06 },
  { id: "rue-du-grand-pre-39", uplift: 0.12 },
  { id: "avenue-du-censuy-18-26", uplift: 0.05 },
  { id: "rue-de-couvaloup-24", uplift: 0.15 },
];

export const yieldGapData: YieldGapPoint[] = yieldAssets.map(({ id, uplift }) => {
  const asset = findAsset(id);
  const actuel = monthlyNet(asset);
  return {
    actif: asset.adresse,
    ville: asset.ville,
    loyerActuel: Number(actuel.toFixed(0)),
    loyerMarche: Number((actuel * (1 + uplift)).toFixed(0)),
  };
});

const ownerForCity = (ville: string) =>
  ville.toLowerCase().includes("genève")
    ? "Banque Cantonale de Genève"
    : "Banque Cantonale Vaudoise";

const computeFinancialScore = (asset: PropertyAsset) => {
  const netYield = (asset.netRentalMChf / asset.marketValueMChf) * 100;
  const base = 68 + netYield * 6 - asset.vacancyRate * 1.4;
  return Math.round(clamp(base, 60, 96));
};

const computeTechniqueScore = (asset: PropertyAsset) => {
  const age = yearsSinceRefit(asset);
  const base = 92 - age * 0.9;
  return Math.round(clamp(base, 58, 95));
};

const computeSocialScore = (asset: PropertyAsset) => {
  const base =
    65 + asset.mix.residential * 0.2 - asset.vacancyRate * 1.1;
  return Math.round(clamp(base, 55, 94));
};

export const buildingTwins: BuildingTwin[] = propertyAssets.map((asset) => {
  const scoreFinancier = computeFinancialScore(asset);
  const scoreTechnique = computeTechniqueScore(asset);
  const scoreSocial = computeSocialScore(asset);
  const scoreSante = Math.round(
    (scoreFinancier + scoreTechnique + scoreSocial) / 3
  );
  const triBase = Number((asset.discountRate + 4.5).toFixed(1));
  const triSensibilite = Number(
    ((asset.vacancyRate / 2 + (100 - asset.mix.residential) / 40) || 0.9).toFixed(1)
  );
  const hausseBase = Number(
    ((asset.netRentalMChf / asset.marketValueMChf) * 100).toFixed(1)
  );
  const hausseSensibilite = Number(
    ((asset.vacancyRate / 2 || 0.8) + 0.6).toFixed(1)
  );

  return {
    id: asset.id,
    nom: asset.adresse,
    ville: asset.ville,
    proprietaire: ownerForCity(asset.ville),
    erp: "Garaio REM",
    scoreSante,
    scoreFinancier,
    scoreTechnique,
    scoreSocial,
    vacance: Number(asset.vacancyRate.toFixed(1)),
    triBase,
    triSensibilite,
    hausseBase,
    hausseSensibilite,
    memo: `${asset.lettableArea.toLocaleString("fr-CH")} m² utiles · dernier rafraîchissement ${
      asset.renovationYear ?? asset.constructionYear
    } · résidentiel ${asset.mix.residential}%`,
  };
});

export const auditFeed: AuditItem[] = [
  {
    id: "audit-grand-pre",
    sujet: "Rue du Grand-Pré 39 — infiltration parking",
    resume:
      "Capteurs Privera ont détecté humidité cage B. Vacance 3.3 % déjà critique.",
    source: "Sentinelle Email · propertylist.txt",
    horodatage: "23 nov. · 05:12",
    urgent: true,
    tags: ["Vacance", "Hydrométrie", "Genève"],
  },
  {
    id: "audit-censuy",
    sujet: "Avenue du Censuy — pilotage retail",
    resume:
      "Part retail 6 % sous-performe. Proposer incentive loyers pour sécuriser nouvelle enseigne.",
    source: "Canal BCV · Renens",
    horodatage: "22 nov. · 19:40",
    tags: ["Retail", "BCV", "Renens"],
  },
  {
    id: "audit-echelon",
    sujet: "Avenue d'Echallens 87/89 — suivi façade",
    resume:
      "Besoins énergétiques confirmés par thermographie. Préparer dossier subventions cantonales.",
    source: "Audit IA · Lausanne",
    horodatage: "22 nov. · 16:05",
    tags: ["Energie", "Capex léger"],
  },
  {
    id: "audit-couvaloup",
    sujet: "Rue de Couvaloup 24 — arbitrage mix",
    resume:
      "Mix 50/50 résidentiel/commerce. Retail vide depuis 45j, relance Banque Cantonale requise.",
    source: "Gérance Morges",
    horodatage: "22 nov. · 11:22",
    urgent: true,
    tags: ["Retail", "Vacance", "Vaud"],
  },
];

const vacancyAlerts = propertyAssets.filter(
  (asset) => asset.vacancyRate >= 1
).length;

export const managementPulse = {
  avgResponseDays: 3.1,
  slaTargetDays: 2,
  escalations: vacancyAlerts,
  compliance: 92 - vacancyAlerts,
  satisfaction: 4.4,
  backlog: 5 + vacancyAlerts,
};

export const propertyAggregates = {
  totalMarketValue,
  totalNetRental,
  weightedVacancy: Number(weightedVacancy.toFixed(1)),
  portfolioCount: propertyAssets.length,
};

export const portfolioBaseline = {
  marketValue: 2_123_500_000, // CHF 2,123.5m
  grossRental: 81_300_000,
  netRental: 80_100_000,
  vacancy: 1.4,
  discountRate: 2.93,
  siteArea: 214_654,
  lettableArea: 291_111,
  units: 3_189,
};

const FORECAST_AUM_GROWTH = 1.032;
const FORECAST_NET_GROWTH = 1.045;
const FORECAST_VACANCY_DELTA = -0.35;

export const portfolioForecast = {
  aum: portfolioBaseline.marketValue * FORECAST_AUM_GROWTH,
  net: portfolioBaseline.netRental * FORECAST_NET_GROWTH,
  vacancy: Math.max(0, portfolioBaseline.vacancy + FORECAST_VACANCY_DELTA),
};

export const killerKpis = {
  revenueLeakage: {
    total: 24_500,
    cadence: "par mois",
    breakdown: {
      indexation: 12_000,
      vacance: 9_000,
      contentieux: 3_500,
    },
    action: "Lancer les lettres de hausse",
  },
  reversionaryPotential: {
    percent: 18.5,
    statement: "Vos loyers sont 18 % sous le marché Homegate.",
    recommendation: "Investir en CAPEX ciblé ou accélérer les relocations.",
  },
  freeCashFlow: {
    value: 345_000,
    period: "ce mois",
    budget: 332_000,
    sparkline: [320, 335, 310, 355, 360, 342, 345],
  },
  churnRisk: {
    score: 72,
    level: "Moyen",
    delta: -5,
    alert:
      "Attention, -5 pts sur Gare 10 (plaintes bruit). Intervention recommandée.",
  },
};

