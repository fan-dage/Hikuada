import { parseDetailSpecsToSections } from "@/lib/parse-detail-specs-to-sections";

function SpecTableSection({
  sec,
  si,
  parameterColumnLabel,
  valueColumnLabel,
  compact,
}: {
  sec: { heading: string; rows: { label: string; value: string }[] };
  si: number;
  parameterColumnLabel: string;
  valueColumnLabel: string;
  compact?: boolean;
}) {
  const thPad = compact ? "px-2 py-2 sm:px-2.5" : "px-3 py-2.5 sm:px-4";
  const cellPad = compact ? "px-2 py-1.5 sm:px-2.5 sm:py-2" : "px-3 py-2.5 sm:px-4 sm:py-3";
  const text = compact ? "text-xs sm:text-sm" : "text-sm";

  return (
    <div className="min-w-0">
      {sec.heading ? (
        <h3
          className={`mb-2 font-bold tracking-tight text-slate-900 ${compact ? "text-sm sm:text-base" : "text-base"}`}
        >
          {sec.heading}
        </h3>
      ) : null}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className={`w-full min-w-[200px] border-collapse text-left ${text}`}>
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100">
              <th
                scope="col"
                className={`w-[40%] ${thPad} text-[10px] font-semibold uppercase tracking-wide text-slate-600 sm:text-xs`}
              >
                {parameterColumnLabel}
              </th>
              <th
                scope="col"
                className={`${thPad} text-[10px] font-semibold uppercase tracking-wide text-slate-600 sm:text-xs`}
              >
                {valueColumnLabel}
              </th>
            </tr>
          </thead>
          <tbody>
            {sec.rows.map((row, ri) => (
              <tr
                key={`${si}-${ri}`}
                className="border-b border-slate-100 last:border-0 odd:bg-white even:bg-slate-50/70"
              >
                <th scope="row" className={`align-top font-medium text-slate-800 ${cellPad}`}>
                  {row.label}
                </th>
                <td className={`align-top text-slate-700 ${cellPad}`}>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ProductDetailSpecsBlock({
  raw,
  parameterColumnLabel,
  valueColumnLabel,
  /** `threeColumnGrid`: one language table per column (e.g. 中文 | English | Tiếng Việt). */
  variant = "stack",
}: {
  raw: string;
  parameterColumnLabel: string;
  valueColumnLabel: string;
  variant?: "stack" | "threeColumnGrid";
}) {
  const sections = parseDetailSpecsToSections(raw);
  if (!sections || sections.length === 0) {
    return (
      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-800 sm:text-base">
        {raw.trim()}
      </pre>
    );
  }

  if (variant === "threeColumnGrid") {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:items-start">
        {sections.map((sec, si) => (
          <SpecTableSection
            key={`${sec.heading}-${si}`}
            sec={sec}
            si={si}
            parameterColumnLabel={parameterColumnLabel}
            valueColumnLabel={valueColumnLabel}
            compact
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {sections.map((sec, si) => (
        <SpecTableSection
          key={`${sec.heading}-${si}`}
          sec={sec}
          si={si}
          parameterColumnLabel={parameterColumnLabel}
          valueColumnLabel={valueColumnLabel}
        />
      ))}
    </div>
  );
}
