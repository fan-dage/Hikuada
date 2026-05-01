export const INQUIRY_LIST_STORAGE_KEY = "hikuada_inquiry_list_v1";
export const INQUIRY_PREFILL_SESSION_KEY = "hikuada_inquiry_message_prefill";
export const INQUIRY_PREFILL_EVENT = "hikuada-inquiry-prefill";

export type InquiryListItem = {
  id: number;
  model: string;
  size: string | null;
  packing_spec: string | null;
  image_url: string | null;
  stock_status: string | null;
  quantity: number;
};

export type ProductSnapshotInput = {
  id: number;
  model: string | null;
  size: string | null;
  packing_spec: string | null;
  image_url: string | null;
  stock_status: string | null;
};

export function snapshotToLine(input: ProductSnapshotInput): Omit<InquiryListItem, "quantity"> {
  return {
    id: input.id,
    model: input.model?.trim() || "—",
    size: input.size,
    packing_spec: input.packing_spec,
    image_url: input.image_url,
    stock_status: input.stock_status,
  };
}

export function loadInquiryListFromStorage(): InquiryListItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(INQUIRY_LIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (row): row is InquiryListItem =>
          typeof row === "object" &&
          row !== null &&
          typeof (row as InquiryListItem).id === "number" &&
          typeof (row as InquiryListItem).quantity === "number",
      )
      .map((row) => ({
        ...row,
        quantity: Math.max(1, Math.floor(Number(row.quantity)) || 1),
      }));
  } catch {
    return [];
  }
}

export function buildInquiryListPrefillMessage(items: InquiryListItem[]): string {
  if (items.length === 0) return "";
  const lines = items.map(
    (item, i) =>
      `${i + 1}. Model ${item.model} × ${item.quantity} — Size: ${item.size ?? "-"} — Packing: ${item.packing_spec ?? "-"}`,
  );
  return `I would like a quote for the following:\n\n${lines.join("\n")}\n\n`;
}

/** Parses a line produced by {@link buildInquiryListPrefillMessage}, e.g. "1. Model 4017-3 × 1 — Size: ...". */
export function extractModelFromInquiryPrefillLine(line: string): string | null {
  const match = line.match(/^\s*\d+\.\s*Model\s+(.+?)\s*[×x]\s*\d+/i);
  const raw = match?.[1]?.trim();
  return raw || null;
}
