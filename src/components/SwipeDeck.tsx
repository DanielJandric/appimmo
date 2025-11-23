"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useCallback, useState } from "react";
import {
  AlertTriangle,
  Check,
  Clock,
  Receipt,
  TrendingUp,
  Wrench,
  X,
} from "lucide-react";
import { BriefCard } from "@/lib/mock-data";
import { cn, formatChf } from "@/lib/utils";

type Decision = "valider" | "rejeter";

type SwipeDeckProps = {
  cards: BriefCard[];
};

export function SwipeDeck({ cards }: SwipeDeckProps) {
  const [deck, setDeck] = useState(cards);
  const [history, setHistory] = useState<
    { id: string; titre: string; decision: Decision; source: string }[]
  >([]);
  const [lastAction, setLastAction] = useState<{
    id: string;
    decision: Decision;
  } | null>(null);

  const topCard = deck[0];

  const handleDecision = useCallback(
    (card: BriefCard, decision: Decision) => {
      setLastAction({ id: card.id, decision });
      setDeck((prev) => prev.filter((c) => c.id !== card.id));
      setHistory((prev) => {
        const next = [
          { id: card.id, titre: card.titre, decision, source: card.source },
          ...prev,
        ];
        return next.slice(0, 4);
      });
    },
    []
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="relative min-h-[420px] flex items-end">
        <AnimatePresence initial={false}>
          {topCard ? (
            <motion.div
              key={topCard.id}
              layout
              data-testid={`card-${topCard.id}`}
              className="relative w-full overflow-hidden rounded-[36px] border border-[#dfe2eb] bg-white"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                scale: 0.95,
                x: lastAction?.decision === "valider" ? 600 : -600,
                rotate: lastAction?.decision === "valider" ? 6 : -6,
              }}
              transition={{ type: "spring", stiffness: 240, damping: 24 }}
            >
              <SwipeCard card={topCard} onDecision={handleDecision} />
            </motion.div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[36px] px-8 py-12 text-center">
              <p className="text-sm uppercase tracking-[0.4em] text-[#677f91]">
                Brief traité
              </p>
              <p className="text-xl font-semibold text-[#0f1f32]">
                Tous les dossiers de ce matin sont clôturés.
              </p>
              <p className="text-sm text-[#5e6674]">
                La tour IA vous préviendra dès qu&apos;un nouveau signal arrive.
              </p>
            </div>
          )}
        </AnimatePresence>

      </div>

      <aside className="rounded-[24px] border border-[#dfe2eb] bg-white p-4 shadow-[0_15px_60px_rgba(15,23,42,0.1)] sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="metric-label">Historique immédiat</p>
            <p className="text-lg font-semibold text-[#0f1f32]">Traces IA</p>
          </div>
          <Clock className="h-5 w-5 text-[#677f91]" strokeWidth={1.5} />
        </div>
        <div className="space-y-3">
          {history.length === 0 ? (
            <p className="text-sm text-[#677f91]">
              Glissez une carte pour enregistrer la décision de gouvernance.
            </p>
          ) : (
            history.map((event) => (
              <div
                key={`${event.id}-${event.decision}`}
                className="rounded-2xl border border-[#e4e7f0] bg-[#f7f8fb] p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#1b2738]">{event.titre}</span>
                  <span
                    className={cn(
                      "text-xs font-semibold uppercase",
                      event.decision === "valider"
                        ? "text-[#1c2f4a]"
                        : "text-[#b86f52]"
                    )}
                  >
                    {event.decision === "valider" ? "Validé" : "Rejeté"}
                  </span>
                </div>
                <p className="text-xs text-[#677f91]">{event.source}</p>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}

function SwipeCard({
  card,
  onDecision,
}: {
  card: BriefCard;
  onDecision: (card: BriefCard, decision: Decision) => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-12, 12]);
  const approveOpacity = useTransform(x, [40, 160], [0, 1]);
  const rejectOpacity = useTransform(x, [-160, -40], [1, 0]);
  const cardGlow = useTransform(x, [-200, 0, 200], [
    "0px 0px 50px rgba(184,111,82,0.25)",
    "0px 20px 50px rgba(17,31,48,0.18)",
    "0px 0px 50px rgba(28,47,74,0.25)",
  ]);

  const handleDragEnd = async (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number } }
  ) => {
    if (info.offset.x > 140) {
      await animate(x, 400, { duration: 0.2, ease: "easeOut" });
      onDecision(card, "valider");
      x.set(0);
      return;
    }
    if (info.offset.x < -140) {
      await animate(x, -400, { duration: 0.2, ease: "easeOut" });
      onDecision(card, "rejeter");
      x.set(0);
      return;
    }

    await animate(x, 0, {
      type: "spring",
      stiffness: 260,
      damping: 22,
    });
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      style={{ x, rotate, boxShadow: cardGlow }}
      dragElastic={0.15}
      onDragEnd={handleDragEnd}
      className="h-full"
    >
      <CardContent card={card} />
      <div className="pointer-events-none absolute inset-0 flex items-start justify-between p-6">
        <motion.span
          style={{ opacity: approveOpacity }}
          className="rounded-full border border-[#1c2f4a]/30 bg-[#ecf0f7] px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#1c2f4a]"
        >
          Valider
        </motion.span>
        <motion.span
          style={{ opacity: rejectOpacity }}
          className="rounded-full border border-[#b86f52]/30 bg-[#fdece5] px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#7f351e]"
        >
          Rejeter
        </motion.span>
      </div>
      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={() => onDecision(card, "rejeter")}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#b86f52]/30 bg-[#fdece5] px-4 py-2 text-sm font-semibold uppercase tracking-wide text-[#7f351e] transition hover:bg-[#fcd8ca]"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
          Rejeter
        </button>
        <button
          type="button"
          onClick={() => onDecision(card, "valider")}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#1c2f4a]/40 bg-[#ecf0f7] px-4 py-2 text-sm font-semibold uppercase tracking-wide text-[#1c2f4a] transition hover:bg-[#dfe6f1]"
        >
          <Check className="h-4 w-4" strokeWidth={1.5} />
          Valider
        </button>
      </div>
    </motion.div>
  );
}

function CardContent({
  card,
  muted = false,
}: {
  card: BriefCard;
  muted?: boolean;
}) {
  const styleMap = {
    indexation: {
      bgHeader: "bg-emerald-100",
      textHeader: "text-emerald-800",
      iconColor: "text-emerald-600",
      icon: TrendingUp,
      label: "Opportunité de Gain",
      valuePrefix: "+",
      valueColor: "text-emerald-700",
    },
    facture: {
      bgHeader: "bg-slate-100",
      textHeader: "text-slate-700",
      iconColor: "text-slate-500",
      icon: Receipt,
      label: "Validation Facture",
      valuePrefix: "-",
      valueColor: "text-slate-700",
    },
    vacance: {
      bgHeader: "bg-rose-100",
      textHeader: "text-rose-800",
      iconColor: "text-rose-600",
      icon: AlertTriangle,
      label: "Alerte Vacance",
      valuePrefix: "Perte ",
      valueColor: "text-rose-700",
    },
    maintenance: {
      bgHeader: "bg-amber-100",
      textHeader: "text-amber-800",
      iconColor: "text-amber-600",
      icon: Wrench,
      label: "Maintenance",
      valuePrefix: "Budget ",
      valueColor: "text-amber-700",
    },
  };

  const theme =
    styleMap[card.type as keyof typeof styleMap] ?? styleMap.indexation;
  const Icon = theme.icon;

  const mainAmount =
    card.type === "vacance"
      ? card.montantActuel || 0
      : card.montantCible && card.montantActuel
      ? card.montantCible - card.montantActuel
      : card.montantActuel || 0;

  const isMonthly = card.type === "indexation" || card.type === "vacance";
  const impactAnnuel = isMonthly ? mainAmount * 12 : mainAmount;

  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden bg-white",
        muted && "opacity-70"
      )}
    >
      <div
        className={cn("flex items-center gap-3 px-4 py-4 sm:px-6", theme.bgHeader)}
      >
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full bg-white/60",
            theme.iconColor
          )}
        >
          <Icon size={20} strokeWidth={2.5} />
        </div>
        <div>
          <p
            className={cn(
              "text-xs font-bold uppercase tracking-widest",
              theme.textHeader
            )}
          >
            {theme.label}
          </p>
          <p
            className={cn("text-sm font-medium opacity-80", theme.textHeader)}
          >
            {card.localisation}
          </p>
        </div>
        {card.urgence === "haute" && (
          <span className="ml-auto rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-rose-600 shadow-sm">
            Prioritaire
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="mb-1 text-xl font-bold leading-tight text-slate-900">
          {card.titre}
        </h3>
        {card.locataire ? (
          <p className="mb-6 text-sm text-slate-500">
            Locataire :{" "}
            <span className="font-medium text-slate-700">
              {card.locataire}
            </span>
          </p>
        ) : (
          <div className="h-6" />
        )}

        <div className="mb-6 rounded-2xl border border-slate-100 bg-slate-50 p-5 text-center">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Impact Financier (Annuel)
          </p>
          <div
            className={cn(
              "text-4xl font-mono font-bold tracking-tight",
              theme.valueColor
            )}
          >
            {theme.valuePrefix}
            {formatChf(impactAnnuel).replace("CHF ", "")}
            <span className="ml-1 text-lg font-sans font-normal text-slate-400">
              CHF
            </span>
          </div>
          {card.type === "indexation" && card.montantActuel && (
            <div className="mx-2 mt-2 flex justify-center gap-3 border-t border-slate-200 pt-2 text-xs text-slate-500 sm:mx-4 sm:gap-4">
              <span>Actuel: {formatChf(card.montantActuel)}</span>
              <span className="text-slate-300">→</span>
              {card.montantCible ? (
                <span className="font-bold text-emerald-600">
                  Cible: {formatChf(card.montantCible)}
                </span>
              ) : null}
            </div>
          )}
        </div>

        <div className="mb-auto">
          <p className="text-sm leading-relaxed text-slate-600">
            {card.contenu}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {card.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium uppercase text-slate-500"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-100 bg-slate-50 px-5 py-2 text-center sm:px-6">
        <p className="text-[10px] text-slate-400">Source IA : {card.source}</p>
      </div>
    </div>
  );
}

