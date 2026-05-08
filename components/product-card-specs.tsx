type ProductCardSpecsProps = {
  size: string | null;
  packingSpec: string | null;
  sizeLabel?: string;
  packingLabel?: string;
};

/** Packing often wraps; reserve two lines so card bottoms stay aligned. Size stays natural height (no forced blank band). */
const sizeLineClass = "text-sm leading-5 text-slate-700 break-words";
const packingLineClass =
  "min-h-10 text-sm leading-5 text-slate-700 line-clamp-2 break-words";

export function ProductCardSpecs({
  size,
  packingSpec,
  sizeLabel = "Size:",
  packingLabel = "Packing:",
}: ProductCardSpecsProps) {
  const sizeText = size?.trim() || "-";
  const packingText = packingSpec?.trim() || "-";
  return (
    <>
      <p className={sizeLineClass} title={sizeText}>
        <span className="font-semibold">{sizeLabel}</span> {sizeText}
      </p>
      <p className={packingLineClass} title={packingText}>
        <span className="font-semibold">{packingLabel}</span> {packingText}
      </p>
    </>
  );
}
