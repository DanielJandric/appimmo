"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useCallback, useState } from "react";
import { Check, Clock, X } from "lucide-react";
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
              className="relative w-full rounded-[36px] px-8 py-8 lg:px-12"
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

      <aside className="rounded-[24px] border border-[#dfe2eb] bg-white p-6 shadow-[0_15px_60px_rgba(15,23,42,0.1)]">
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
  return (
    <div className={cn("flex h-full flex-col gap-4", muted && "opacity-70")}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[#677f91]">
            {card.type === "indexation" && "Indexation IPC"}
            {card.type === "facture" && "Facture"}
            {card.type === "vacance" && "Vacance"}
            {card.type === "maintenance" && "Maintenance"}
          </p>
          <p className="mt-1 text-lg font-semibold text-[#0f1f32]">
            {card.titre}
          </p>
          <p className="text-sm text-[#5b6474]">{card.localisation}</p>
        </div>
        {card.urgence === "haute" && (
          <span className="rounded-full border border-[#b86f52]/30 bg-[#fdece5] px-3 py-1 text-xs font-semibold uppercase text-[#7f351e]">
            Urgent
          </span>
        )}
      </div>

      <p className="text-base text-[#1b2738]">{card.contenu}</p>
      {card.locataire && (
        <p className="text-sm text-[#5b6474]">Locataire : {card.locataire}</p>
      )}

      {(card.montantActuel || card.montantCible) && (
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-[#e4e7f0] bg-[#f9fafc] p-4">
          {card.montantActuel && (
            <div>
              <p className="metric-label">Situation actuelle</p>
              <p className="font-mono text-lg text-[#0f1f32]">
                {formatChf(card.montantActuel)}
              </p>
            </div>
          )}
          {card.montantCible && (
            <div>
              <p className="metric-label">Potentiel IA</p>
              <p className="font-mono text-lg text-[#1c2f4a]">
                {formatChf(card.montantCible)}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {card.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-[#dfe2eb] bg-[#f6f8fb] px-3 py-1 text-xs uppercase tracking-wide text-[#677f91]"
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="text-xs text-[#677f91]">{card.source}</p>
    </div>
  );
}

