import { useCallback, useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { m } from "motion/react";
import { ChevronRight, type LucideIcon } from "lucide-react";
import type { TimeSlot } from "../day";
import { seeded } from "../random";
import { useCard } from "./Card";

// A Poster has two parts (ADR 0005). Its Hero is one designed screen: the face of its Card, and
// the top of the Poster once it opens. Its Detail sits below the Hero and only exists while the
// Poster is open, as Weather-style modules.

type HeroProps = {
  slot: TimeSlot;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

export function Hero({ slot, className = "", style, children }: HeroProps) {
  // Loops run only while the Card has focus or is open.
  const { live } = useCard();

  return (
    <section
      aria-label={slot.topic}
      data-live={live ? "" : undefined}
      className={`poster relative isolate flex h-full flex-col overflow-hidden px-6 pb-[118px] pt-[88px] text-ink sm:px-10 ${className}`}
      style={style}
    >
      {children}
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow lift">{children}</p>;
}

export function Detail({ children }: { children: ReactNode }) {
  return <div className="relative mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 pb-36 sm:px-6">{children}</div>;
}

type ModuleProps = {
  title?: string;
  icon?: LucideIcon;
  index?: number;
  className?: string;
  children: ReactNode;
};

// One module: a small caption with an icon, as Weather labels its tiles, then the content. Modules
// rise in one after another as the Detail appears.
export function Module({ title, icon: Icon, index = 0, className = "", children }: ModuleProps) {
  return (
    <m.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", bounce: 0, duration: 0.6, delay: 0.06 * index }}
      className={`module p-5 sm:p-6 ${className}`}
    >
      {title && (
        <h3 className="mb-4 flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-[0.06em] text-ink/60">
          {Icon && <Icon aria-hidden="true" className="size-3.5" strokeWidth={2.4} />}
          {title}
        </h3>
      )}
      {children}
    </m.section>
  );
}

type RowProps = {
  icon: LucideIcon;
  label: string;
  value?: ReactNode;
  href?: string;
  onClick?: () => void;
};

// A row in an inset grouped list, as in iOS Settings. Rows inside one Module share separators
// that start after the icon.
export function Row({ icon: Icon, label, value, href, onClick }: RowProps) {
  const body = (
    <>
      <span className="grid size-[30px] shrink-0 place-items-center rounded-[9px] bg-ink/16">
        <Icon aria-hidden="true" className="size-4" strokeWidth={2.2} />
      </span>
      <span className="flex min-w-0 flex-1 items-center justify-between gap-4 border-ink/12 py-3.5 [li+li_&]:border-t">
        <span className="shrink-0 text-body font-medium">{label}</span>
        <span className="flex min-w-0 items-center gap-1 text-right text-subhead text-ink/65">
          <span className="truncate">{value}</span>
          {(href || onClick) && <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-ink/40" strokeWidth={2.4} />}
        </span>
      </span>
    </>
  );
  const row = "flex items-center gap-3.5";

  return (
    <li>
      {href ? (
        <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className={`${row} press -mx-2 rounded-2xl px-2 hover:bg-ink/6`}>
          {body}
        </a>
      ) : onClick ? (
        <button type="button" onClick={onClick} className={`${row} press -mx-2 w-[calc(100%+1rem)] rounded-2xl px-2 text-left hover:bg-ink/6`}>
          {body}
        </button>
      ) : (
        <div className={row}>{body}</div>
      )}
    </li>
  );
}

export function Chips({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li key={item} className="rounded-full bg-ink/12 px-3 py-1 text-subhead font-medium">
          {item}
        </li>
      ))}
    </ul>
  );
}

// Still stars for night Skies: one element painted with tiny radial gradients, so a sky full of
// them costs a single layer and no animation.
export function Stars({ seed, count, className = "" }: { seed: number; count: number; className?: string }) {
  const background = useMemo(() => {
    const random = seeded(seed);
    return Array.from({ length: count }, () => {
      const size = random() < 0.15 ? 1.6 : 0.9;
      const alpha = (0.35 + random() * 0.6).toFixed(2);
      return `radial-gradient(circle ${size}px at ${(random() * 100).toFixed(2)}% ${(random() * 100).toFixed(2)}%, rgba(255,255,255,${alpha}), transparent)`;
    }).join(", ");
  }, [seed, count]);

  return <div aria-hidden="true" className={`pointer-events-none absolute ${className}`} style={{ background }} />;
}

// Copies a value and reports it for a moment, the way iOS confirms a copy.
export function useCopy(value: string) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = useCallback(() => {
    navigator.clipboard?.writeText(value).then(() => setCopied(true));
  }, [value]);

  return { copied, copy };
}
