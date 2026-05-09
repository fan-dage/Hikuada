import { CheckCircle, Cpu, Zap } from "lucide-react";

const ICONS = [Cpu, Zap, CheckCircle] as const;

export function ProductDetailMachineryFeatures({
  title,
  lines,
}: {
  title: string;
  lines: readonly [string, string, string];
}) {
  return (
    <section
      aria-labelledby="machinery-features-heading"
      className="rounded-xl border border-slate-200/90 bg-white/80 px-4 py-4 shadow-sm sm:px-5 sm:py-5"
    >
      <h2
        id="machinery-features-heading"
        className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500"
      >
        {title}
      </h2>
      <ul className="mt-3.5 space-y-3">
        {lines.map((text, i) => {
          const Icon = ICONS[i];
          return (
            <li key={i} className="flex gap-3 text-sm leading-snug text-slate-700">
              <Icon
                className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
                strokeWidth={1.75}
                aria-hidden
              />
              <span>{text}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
