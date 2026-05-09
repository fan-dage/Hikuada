export type DetailSpecRow = { label: string; value: string };

export type DetailSpecSection = { heading: string; rows: DetailSpecRow[] };

/**
 * Parse `detail_specs` text (e.g. 【中文】 / label：value / label: value) into table sections.
 * Returns null if nothing could be parsed (caller may fall back to plain pre).
 */
export function parseDetailSpecsToSections(raw: string): DetailSpecSection[] | null {
  const text = raw.trim();
  if (!text) return null;

  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const sections: DetailSpecSection[] = [];
  let current: DetailSpecSection | null = null;

  function pushCurrent() {
    if (current && current.rows.length > 0) {
      sections.push(current);
    }
  }

  for (const line of lines) {
    if (/^【.+】$/.test(line)) {
      pushCurrent();
      current = { heading: line, rows: [] };
      continue;
    }

    let sep = line.indexOf("：");
    if (sep === -1) sep = line.indexOf(":");
    if (sep <= 0 || sep >= line.length - 1) {
      if (current) {
        current.rows.push({ label: line, value: "—" });
      } else {
        current = { heading: "", rows: [{ label: line, value: "—" }] };
      }
      continue;
    }

    const label = line.slice(0, sep).trim();
    const value = line.slice(sep + 1).trim();
    if (!label) continue;
    if (!current) current = { heading: "", rows: [] };
    current.rows.push({ label, value: value || "—" });
  }
  pushCurrent();

  if (sections.length === 0) return null;
  return sections;
}
