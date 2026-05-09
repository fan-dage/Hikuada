/** e.g. [1, "ellipsis", 8, 9, 10, "ellipsis", 24] */
export function getPageList(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 1) return [];
  if (total <= 9) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const delta = 1;
  const pages = new Set<number>();
  pages.add(1);
  pages.add(total);
  for (let i = current - delta; i <= current + delta; i++) {
    if (i >= 1 && i <= total) pages.add(i);
  }
  const sorted = [...pages].sort((a, b) => a - b);
  const out: (number | "ellipsis")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      out.push("ellipsis");
    }
    out.push(sorted[i]);
  }
  return out;
}
