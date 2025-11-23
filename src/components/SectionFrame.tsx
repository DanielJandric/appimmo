import { cn } from "@/lib/utils";

export const sectionAccentVariants = {
  navy: {
    border: "border-[#1c2f4a]/80",
    gradient: "from-[#1c2f4a]/50 via-transparent to-transparent",
    orb: "bg-[#1c2f4a]/15",
    badge: "border-[#1c2f4a]/30 bg-[#1c2f4a]/10 text-[#1c2f4a]",
    chip: "text-[#1c2f4a]",
    heading: "text-[#111f30]",
    body: "text-[#4a5568]",
  },
  bronze: {
    border: "border-[#aa8f66]/60",
    gradient: "from-[#aa8f66]/45 via-transparent to-transparent",
    orb: "bg-[#aa8f66]/15",
    badge: "border-[#aa8f66]/40 bg-[#aa8f66]/10 text-[#5c452b]",
    chip: "text-[#aa8f66]",
    heading: "text-[#5c452b]",
    body: "text-[#5b4a3b]",
  },
  slate: {
    border: "border-[#677f91]/60",
    gradient: "from-[#677f91]/40 via-transparent to-transparent",
    orb: "bg-[#677f91]/15",
    badge: "border-[#677f91]/30 bg-[#677f91]/10 text-[#1f2f3b]",
    chip: "text-[#4d6273]",
    heading: "text-[#152433]",
    body: "text-[#4b5b68]",
  },
  terracotta: {
    border: "border-[#b86f52]/60",
    gradient: "from-[#b86f52]/45 via-transparent to-transparent",
    orb: "bg-[#b86f52]/15",
    badge: "border-[#b86f52]/35 bg-[#b86f52]/10 text-[#4b2418]",
    chip: "text-[#8a4c32]",
    heading: "text-[#4b2418]",
    body: "text-[#5a3a30]",
  },
} as const;

export type SectionAccent = keyof typeof sectionAccentVariants;

type SectionFrameProps = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  chip?: string;
  accent?: SectionAccent;
  hoverDescription?: string;
  children: React.ReactNode;
};

export function SectionFrame({
  id,
  eyebrow,
  title,
  description,
  chip,
  accent = "navy",
  hoverDescription,
  children,
}: SectionFrameProps) {
  const palette =
    sectionAccentVariants[accent] ?? sectionAccentVariants.navy;

  return (
    <section
      id={id}
      data-shell-section
      className="scroll-mt-24 space-y-5 sm:space-y-6"
    >
      <div className="space-y-3 sm:space-y-4">
        <p className="metric-label text-xs">{eyebrow}</p>
        <div className="flex flex-wrap items-center gap-3">
          <div className="group relative inline-flex items-center">
            <h2 className={cn("text-2xl font-semibold sm:text-3xl", palette.heading)}>
              {title}
            </h2>
            {hoverDescription ? (
              <div className="pointer-events-none absolute left-0 top-full z-20 mt-2 hidden w-72 rounded-2xl border border-[#dfe2eb] bg-white p-4 text-sm text-[#1b2738] shadow-[0_15px_45px_rgba(15,23,42,0.15)] group-hover:flex">
                {hoverDescription}
              </div>
            ) : null}
          </div>
          {chip ? (
            <span
              className={cn(
                "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide",
                palette.badge
              )}
            >
              {chip}
            </span>
          ) : null}
        </div>
        <p className={cn("max-w-3xl text-sm leading-relaxed", palette.body)}>
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}

