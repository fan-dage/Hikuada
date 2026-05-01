type ProductCardSpecsProps = {
  size: string | null;
  packingSpec: string | null;
};

/** Packing often wraps; reserve two lines so card bottoms stay aligned. Size stays natural height (no forced blank band). */
const sizeLineClass = "text-sm leading-5 text-slate-700 break-words";
const packingLineClass =
  "min-h-10 text-sm leading-5 text-slate-700 line-clamp-2 break-words";

export function ProductCardSpecs({ size, packingSpec }: ProductCardSpecsProps) {
  const sizeText = size?.trim() || "-";
  const packingText = packingSpec?.trim() || "-";
  return (
    <>
      <p className={sizeLineClass} title={sizeText}>
        <span className="font-semibold">Size:</span> {sizeText}
      </p>
      <p className={packingLineClass} title={packingText}>
        <span className="font-semibold">Packing:</span> {packingText}
      </p>
    </>
  );
}
