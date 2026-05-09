import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getPageList } from "@/lib/pagination-page-list";
import { getSupabaseServerClient } from "@/lib/supabase";
import { AdminProductsTable } from "@/components/admin-products-table";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const ADMIN_PRODUCTS_PER_PAGE = 50;
const ADMIN_SEARCH_MAX_LEN = 100;

function hrefAdminProductsList(page: number, q: string) {
  const params = new URLSearchParams();
  const trimmed = q.trim();
  if (trimmed) params.set("q", trimmed);
  if (page > 1) params.set("page", String(page));
  const s = params.toString();
  return s ? `/admin/products?${s}` : "/admin/products";
}

/** Strip characters that break PostgREST `.or()` comma-separated filters */
function sanitizeAdminSearchInput(raw: string) {
  return raw.replace(/,/g, " ").trim().slice(0, ADMIN_SEARCH_MAX_LEN);
}

function ilikeOrPattern(q: string) {
  const escaped = q.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
  return `%${escaped}%`;
}

type Product = {
  id: number;
  model: string | null;
  display_name: string | null;
  category: string | null;
  sort_order: number | null;
  size: string | null;
  packing_spec: string | null;
  detail_specs: string | null;
  stock_status: string | null;
  stock_quantity: number | null;
  image_url: string | null;
  /** cover = crop to fill card; contain = show full image with letterboxing */
  image_object_fit: string | null;
  created_at: string | null;
};

type CategoryOption = {
  slug: string;
  name: string;
};

const STORAGE_BUCKET = process.env.SUPABASE_PRODUCTS_BUCKET || "products";

async function saveProductImageToLocal(file: File) {
  const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
  await mkdir(uploadDir, { recursive: true });
  const safeExt = file.name.includes(".") ? file.name.split(".").pop()?.toLowerCase() || "jpg" : "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;
  const filePath = path.join(uploadDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);
  return `/uploads/products/${filename}`;
}

function parseStorageObjectPath(publicUrl: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return null;
  const expectedPrefix = `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/`;
  if (!publicUrl.startsWith(expectedPrefix)) return null;
  return decodeURIComponent(publicUrl.slice(expectedPrefix.length));
}

async function saveProductImage(
  supabase: ReturnType<typeof getSupabaseServerClient>,
  file: File,
) {
  const safeExt = file.name.includes(".") ? file.name.split(".").pop()?.toLowerCase() || "jpg" : "jpg";
  const objectPath = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;

  // Prefer Supabase Storage in production/serverless environments.
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadErr } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(objectPath, buffer, { contentType: file.type || undefined, upsert: false });
  if (!uploadErr) {
    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(objectPath);
    if (data.publicUrl) return data.publicUrl;
  }

  // Fallback for local development when Storage bucket is unavailable.
  return saveProductImageToLocal(file);
}

async function removeUploadedImage(
  supabase: ReturnType<typeof getSupabaseServerClient>,
  imageUrl: string | null | undefined,
) {
  if (!imageUrl) {
    return;
  }

  const objectPath = parseStorageObjectPath(imageUrl);
  if (objectPath) {
    await supabase.storage.from(STORAGE_BUCKET).remove([objectPath]);
    return;
  }

  if (imageUrl.startsWith("/uploads/products/")) {
    const filePath = path.join(process.cwd(), "public", imageUrl.replace(/^\//, ""));
    try {
      await unlink(filePath);
    } catch {
      // Ignore missing files.
    }
  }
}

function omitProductPayloadKeys<T extends Record<string, unknown>>(row: T, keys: (keyof T)[]) {
  const next = { ...row };
  for (const k of keys) delete next[k];
  return next;
}

const BULK_MAX_ROWS = 500;
const BULK_MAX_BYTES = 512 * 1024;

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if ((c === "," || c === "\t") && !inQuotes) {
      out.push(cur);
      cur = "";
    } else {
      cur += c;
    }
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

type BulkRowFields = {
  model: string;
  category: string;
  size_width: string;
  size_height: string;
  packing_length: string;
  packing_pcs: string;
  sort_order: string;
  stock_status: string;
  stock_quantity: string;
  image_object_fit: string;
  image_url: string;
};

const HEADER_TO_FIELD: Record<string, keyof BulkRowFields> = {
  model: "model",
  型号: "model",
  category: "category",
  分类: "category",
  size_width_mm: "size_width",
  size_width: "size_width",
  宽度_mm: "size_width",
  宽度mm: "size_width",
  size_height_mm: "size_height",
  size_height: "size_height",
  高度_mm: "size_height",
  高度mm: "size_height",
  packing_length_m: "packing_length",
  packing_length: "packing_length",
  包装长度_m: "packing_length",
  packing_pcs: "packing_pcs",
  每箱pcs: "packing_pcs",
  sort_order: "sort_order",
  排序: "sort_order",
  stock_status: "stock_status",
  库存状态: "stock_status",
  stock_quantity: "stock_quantity",
  库存数量: "stock_quantity",
  image_object_fit: "image_object_fit",
  图片适应: "image_object_fit",
  image_url: "image_url",
  图片url: "image_url",
};

function normalizeHeaderCell(raw: string): string {
  const t = raw.trim();
  if (/^[a-zA-Z0-9_]+$/.test(t)) return t.toLowerCase();
  return t;
}

type BulkColumnIndex = Partial<Record<keyof BulkRowFields, number>> & {
  model: number;
  size_width: number;
  size_height: number;
};

function buildHeaderIndex(headerCells: string[]): BulkColumnIndex | null {
  const idx: Partial<Record<keyof BulkRowFields, number>> = {};
  headerCells.forEach((cell, i) => {
    const key = normalizeHeaderCell(cell);
    const field = HEADER_TO_FIELD[key];
    if (field && idx[field] === undefined) {
      idx[field] = i;
    }
  });
  if (idx.model === undefined || idx.size_width === undefined || idx.size_height === undefined) {
    return null;
  }
  return idx as BulkColumnIndex;
}

function cellAt(cells: string[], index: number | undefined): string {
  if (index === undefined || index < 0 || index >= cells.length) return "";
  return cells[index]?.trim() ?? "";
}

function bulkImportErrorMessage(code: string): string {
  const map: Record<string, string> = {
    empty: "请选择 CSV 文件后再上传。",
    too_large: "文件过大（超过 512KB），请拆分后重试。",
    no_rows: "CSV 中没有有效数据行。",
    bad_header: "表头不正确：需包含列「型号」「宽度_mm」「高度_mm」（请下载模板对照）。",
    too_many_rows: `单次最多导入 ${BULK_MAX_ROWS} 行，请拆分文件。`,
    supabase: "服务器未配置 Supabase，无法导入。",
    read: "读取文件失败。",
    all_skipped: "没有成功导入任何一行，请检查型号、宽度/高度是否为有效数字。",
  };
  return map[code] || "批量导入失败。";
}

const PRODUCT_OPTIONAL_COLS = ["sort_order", "image_object_fit", "display_name", "detail_specs"] as const;

function productPayloadOmitAttempts(): (typeof PRODUCT_OPTIONAL_COLS[number])[][] {
  const keys = [...PRODUCT_OPTIONAL_COLS];
  const n = keys.length;
  const out: (typeof PRODUCT_OPTIONAL_COLS[number])[][] = [];
  for (let mask = 0; mask < 1 << n; mask++) {
    const omit: (typeof PRODUCT_OPTIONAL_COLS[number])[] = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) omit.push(keys[i]);
    }
    out.push(omit);
  }
  return out;
}

async function insertProductRow(
  supabase: ReturnType<typeof getSupabaseServerClient>,
  row: {
    model: string;
    category: string;
    size: string;
    packing_spec: string;
    stock_status: string;
    stock_quantity: number | null;
    image_url: string | null;
    sort_order?: number;
    image_object_fit?: string;
    display_name?: string | null;
    detail_specs?: string | null;
  },
) {
  const base = { ...row } as Record<string, unknown>;
  let lastError = null as { message: string; code?: string } | null;
  for (const omitKeys of productPayloadOmitAttempts()) {
    const payload =
      omitKeys.length === 0 ? base : omitProductPayloadKeys(base, omitKeys as (keyof typeof base)[]);
    const { error } = await supabase.from("hikuada_products").insert(payload);
    if (!error) return { error: null };
    lastError = error;
  }
  return { error: lastError };
}

async function updateProductRow(
  supabase: ReturnType<typeof getSupabaseServerClient>,
  id: number,
  row: {
    model: string;
    category: string;
    size: string;
    packing_spec: string;
    stock_status: string;
    stock_quantity: number | null;
    image_url: string | null;
    sort_order?: number;
    image_object_fit?: string;
    display_name?: string | null;
    detail_specs?: string | null;
  },
) {
  const base = { ...row } as Record<string, unknown>;
  let lastError = null as { message: string; code?: string } | null;
  for (const omitKeys of productPayloadOmitAttempts()) {
    const payload =
      omitKeys.length === 0 ? base : omitProductPayloadKeys(base, omitKeys as (keyof typeof base)[]);
    const { error } = await supabase.from("hikuada_products").update(payload).eq("id", id);
    if (!error) return { error: null };
    lastError = error;
  }
  return { error: lastError };
}

async function createProduct(formData: FormData) {
  "use server";

  const model = formData.get("model")?.toString().trim();
  const category = formData.get("category")?.toString().trim() || "ps_moldings";
  const sizeWidthRaw = formData.get("size_width")?.toString().trim();
  const sizeHeightRaw = formData.get("size_height")?.toString().trim();
  const packingLengthRaw = formData.get("packing_length")?.toString().trim();
  const packingPcsRaw = formData.get("packing_pcs")?.toString().trim();
  const stockStatus = formData.get("stock_status")?.toString().trim() || "In Stock";
  const sortOrderRaw = formData.get("sort_order")?.toString().trim() || "100";
  const stockQuantityRaw = formData.get("stock_quantity")?.toString().trim();
  const imageFile = formData.get("image_file");
  const existingImageUrl = formData.get("existing_image_url")?.toString().trim() || "";
  const sizeWidth = sizeWidthRaw ? Number(sizeWidthRaw) : NaN;
  const sizeHeight = sizeHeightRaw ? Number(sizeHeightRaw) : NaN;
  const size = Number.isNaN(sizeWidth) || Number.isNaN(sizeHeight) ? "" : `${sizeWidth} x ${sizeHeight} mm`;
  let packingSpec = "";
  if (packingLengthRaw || packingPcsRaw) {
    const packingLength = packingLengthRaw ? Number(packingLengthRaw) : NaN;
    const packingPcs = packingPcsRaw ? Number(packingPcsRaw) : NaN;
    if (
      !Number.isNaN(packingLength) &&
      !Number.isNaN(packingPcs) &&
      packingLength > 0 &&
      packingPcs > 0
    ) {
      packingSpec = `${packingLength}m x ${packingPcs} pcs / carton`;
    }
  }
  const parsedStockQuantity = stockQuantityRaw ? Number(stockQuantityRaw) : null;
  const stockQuantity =
    parsedStockQuantity !== null && Number.isNaN(parsedStockQuantity) ? null : parsedStockQuantity;
  const parsedSortOrder = Number(sortOrderRaw);
  const sortOrder = Number.isNaN(parsedSortOrder) || parsedSortOrder < 0 ? 100 : parsedSortOrder;
  const image_object_fit_raw = formData.get("image_object_fit")?.toString().trim().toLowerCase();
  const image_object_fit = image_object_fit_raw === "contain" ? "contain" : "cover";
  const display_name = formData.get("display_name")?.toString().trim() || null;
  const detail_specs_raw = formData.get("detail_specs")?.toString() ?? "";
  const detail_specs = detail_specs_raw.trim().length > 0 ? detail_specs_raw.trim() : null;

  if (!model || !sizeWidthRaw || !sizeHeightRaw || !size) {
    return;
  }
  if (Number.isNaN(sizeWidth) || Number.isNaN(sizeHeight) || sizeWidth <= 0 || sizeHeight <= 0) {
    return;
  }

  try {
    let supabase;
    try {
      supabase = getSupabaseServerClient();
    } catch {
      throw new Error("缺少 Supabase 配置（NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY），请检查环境变量。");
    }

    let imageUrl: string | null = existingImageUrl || null;
    if (imageFile instanceof File && imageFile.size > 0) {
      try {
        imageUrl = await saveProductImage(supabase, imageFile);
      } catch (err) {
        const detail = err instanceof Error ? err.message : String(err);
        console.error("saveProductImage failed, continue without image:", detail);
        imageUrl = existingImageUrl || null;
      }
    }

    const { error } = await insertProductRow(supabase, {
      model,
      category,
      size,
      packing_spec: packingSpec,
      sort_order: sortOrder,
      stock_status: stockStatus,
      stock_quantity: stockQuantity,
      image_url: imageUrl,
      image_object_fit,
      display_name,
      detail_specs,
    });

    if (error) {
      throw new Error(`数据库保存失败：${error.message}`);
    }

    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/products");
  } catch (err) {
    const message = err instanceof Error ? err.message : "保存失败";
    throw new Error(message);
  }
}

async function bulkImportProducts(formData: FormData) {
  "use server";
  const file = formData.get("bulk_file");
  if (!(file instanceof File) || file.size === 0) {
    redirect("/admin/products?bulk_err=empty");
  }
  if (file.size > BULK_MAX_BYTES) {
    redirect("/admin/products?bulk_err=too_large");
  }

  let supabase: ReturnType<typeof getSupabaseServerClient>;
  try {
    supabase = getSupabaseServerClient();
  } catch {
    redirect("/admin/products?bulk_err=supabase");
  }

  let text: string;
  try {
    text = await file.text();
  } catch {
    redirect("/admin/products?bulk_err=read");
  }

  const normalized = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = normalized.split("\n");
  const nonEmpty = lines
    .map((l) => l.trimEnd())
    .filter((l) => {
      const t = l.trim();
      return t.length > 0 && !t.startsWith("#");
    });
  if (nonEmpty.length < 2) {
    redirect("/admin/products?bulk_err=no_rows");
  }

  const headerCells = parseCsvLine(nonEmpty[0]);
  const col = buildHeaderIndex(headerCells);
  if (!col) {
    redirect("/admin/products?bulk_err=bad_header");
  }

  const dataLines = nonEmpty.slice(1);
  if (dataLines.length > BULK_MAX_ROWS) {
    redirect("/admin/products?bulk_err=too_many_rows");
  }

  let imported = 0;
  let skipped = 0;

  for (const line of dataLines) {
    if (!line.trim()) continue;
    const cells = parseCsvLine(line);
    const model = cellAt(cells, col.model);
    if (!model) {
      skipped++;
      continue;
    }

    const sizeWidthRaw = cellAt(cells, col.size_width);
    const sizeHeightRaw = cellAt(cells, col.size_height);
    const sizeWidth = Number(sizeWidthRaw);
    const sizeHeight = Number(sizeHeightRaw);
    if (Number.isNaN(sizeWidth) || Number.isNaN(sizeHeight) || sizeWidth <= 0 || sizeHeight <= 0) {
      skipped++;
      continue;
    }
    const size = `${sizeWidth} x ${sizeHeight} mm`;

    const category = cellAt(cells, col.category) || "ps_moldings";

    const packingLengthRaw = cellAt(cells, col.packing_length);
    const packingPcsRaw = cellAt(cells, col.packing_pcs);
    let packingSpec = "";
    if (packingLengthRaw || packingPcsRaw) {
      const packingLength = packingLengthRaw ? Number(packingLengthRaw) : NaN;
      const packingPcs = packingPcsRaw ? Number(packingPcsRaw) : NaN;
      if (
        !Number.isNaN(packingLength) &&
        !Number.isNaN(packingPcs) &&
        packingLength > 0 &&
        packingPcs > 0
      ) {
        packingSpec = `${packingLength}m x ${packingPcs} pcs / carton`;
      }
    }

    const sortOrderRaw = cellAt(cells, col.sort_order) || "100";
    const parsedSortOrder = Number(sortOrderRaw);
    const sortOrder = Number.isNaN(parsedSortOrder) || parsedSortOrder < 0 ? 100 : parsedSortOrder;

    const stockStatus = cellAt(cells, col.stock_status) || "In Stock";
    const stockQtyRaw = cellAt(cells, col.stock_quantity);
    const parsedStockQuantity = stockQtyRaw ? Number(stockQtyRaw) : null;
    const stockQuantity =
      parsedStockQuantity !== null && Number.isNaN(parsedStockQuantity) ? null : parsedStockQuantity;

    const imageFitRaw = cellAt(cells, col.image_object_fit).toLowerCase();
    const image_object_fit = imageFitRaw === "contain" ? "contain" : "cover";

    const imageUrlRaw = cellAt(cells, col.image_url);
    const image_url = imageUrlRaw.length > 0 ? imageUrlRaw : null;

    const { error } = await insertProductRow(supabase, {
      model,
      category,
      size,
      packing_spec: packingSpec,
      sort_order: sortOrder,
      stock_status: stockStatus,
      stock_quantity: stockQuantity,
      image_url,
      image_object_fit,
      display_name: null,
      detail_specs: null,
    });

    if (error) {
      skipped++;
      continue;
    }
    imported++;
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/products");

  if (imported === 0) {
    redirect("/admin/products?bulk_err=all_skipped");
  }
  if (skipped > 0) {
    redirect(`/admin/products?imported=${imported}&bulk_skipped=${skipped}`);
  }
  redirect(`/admin/products?imported=${imported}`);
}

async function deleteProducts(formData: FormData) {
  "use server";
  const idsValue = formData.get("ids")?.toString().trim();
  if (!idsValue) {
    return;
  }
  const ids = idsValue
    .split(",")
    .map((item) => Number(item))
    .filter((value) => Number.isFinite(value) && value > 0);
  if (ids.length === 0) {
    return;
  }

  const supabase = getSupabaseServerClient();
  const { data: existingProducts } = await supabase
    .from("hikuada_products")
    .select("image_url")
    .in("id", ids);
  await supabase.from("hikuada_products").delete().in("id", ids);
  await Promise.all(
    (existingProducts || []).map((item) =>
      removeUploadedImage(supabase, item.image_url as string | null),
    ),
  );
  revalidatePath("/admin");
  revalidatePath("/admin/home");
  revalidatePath("/admin/products");
}

async function clearProductImage(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));
  if (!id) {
    return;
  }

  const supabase = getSupabaseServerClient();
  const { data: product } = await supabase
    .from("hikuada_products")
    .select("image_url")
    .eq("id", id)
    .single();
  await supabase.from("hikuada_products").update({ image_url: null }).eq("id", id);
  await removeUploadedImage(supabase, (product?.image_url as string | null) || null);
  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/admin/home");
}

async function updateProduct(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));
  const model = formData.get("model")?.toString().trim();
  const category = formData.get("category")?.toString().trim() || "ps_moldings";
  const sizeWidthRaw = formData.get("size_width")?.toString().trim();
  const sizeHeightRaw = formData.get("size_height")?.toString().trim();
  const packingLengthRaw = formData.get("packing_length")?.toString().trim();
  const packingPcsRaw = formData.get("packing_pcs")?.toString().trim();
  const stockStatus = formData.get("stock_status")?.toString().trim() || "In Stock";
  const sortOrderRaw = formData.get("sort_order")?.toString().trim() || "100";
  const stockQuantityRaw = formData.get("stock_quantity")?.toString().trim();
  const imageFile = formData.get("image_file");
  const existingImageUrl = formData.get("existing_image_url")?.toString().trim() || "";

  if (!id || !model || !sizeWidthRaw || !sizeHeightRaw) {
    return;
  }

  const sizeWidth = Number(sizeWidthRaw);
  const sizeHeight = Number(sizeHeightRaw);
  const parsedStockQuantity = stockQuantityRaw ? Number(stockQuantityRaw) : null;
  const stockQuantity =
    parsedStockQuantity !== null && Number.isNaN(parsedStockQuantity) ? null : parsedStockQuantity;
  const parsedSortOrder = Number(sortOrderRaw);
  const sortOrder = Number.isNaN(parsedSortOrder) || parsedSortOrder < 0 ? 100 : parsedSortOrder;
  const image_object_fit_raw = formData.get("image_object_fit")?.toString().trim().toLowerCase();
  const image_object_fit = image_object_fit_raw === "contain" ? "contain" : "cover";
  const display_name = formData.get("display_name")?.toString().trim() || null;
  const detail_specs_raw = formData.get("detail_specs")?.toString() ?? "";
  const detail_specs = detail_specs_raw.trim().length > 0 ? detail_specs_raw.trim() : null;

  let packingSpec = "";
  if (packingLengthRaw || packingPcsRaw) {
    const packingLength = packingLengthRaw ? Number(packingLengthRaw) : NaN;
    const packingPcs = packingPcsRaw ? Number(packingPcsRaw) : NaN;
    if (
      !Number.isNaN(packingLength) &&
      !Number.isNaN(packingPcs) &&
      packingLength > 0 &&
      packingPcs > 0
    ) {
      packingSpec = `${packingLength}m x ${packingPcs} pcs / carton`;
    }
  }

  if (
    Number.isNaN(sizeWidth) ||
    Number.isNaN(sizeHeight) ||
    sizeWidth <= 0 ||
    sizeHeight <= 0
  ) {
    return;
  }

  const size = `${sizeWidth} x ${sizeHeight} mm`;

  try {
    let supabase;
    try {
      supabase = getSupabaseServerClient();
    } catch {
      throw new Error("缺少 Supabase 配置（NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY），请检查环境变量。");
    }

    const { data: currentProduct } = await supabase
      .from("hikuada_products")
      .select("image_url")
      .eq("id", id)
      .single();

    let nextImageUrl: string | null = currentProduct?.image_url || null;
    if (existingImageUrl) {
      nextImageUrl = existingImageUrl;
    }
    try {
      if (imageFile instanceof File && imageFile.size > 0) {
        nextImageUrl = await saveProductImage(supabase, imageFile);
      }
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err);
      console.error("saveProductImage failed on update, keep previous image:", detail);
    }

    const { error: updateError } = await updateProductRow(supabase, id, {
      model,
      category,
      size,
      packing_spec: packingSpec,
      sort_order: sortOrder,
      stock_status: stockStatus,
      stock_quantity: stockQuantity,
      image_url: nextImageUrl,
      image_object_fit,
      display_name,
      detail_specs,
    });

    if (updateError) {
      throw new Error(`数据库更新失败：${updateError.message}`);
    }

    if (
      currentProduct?.image_url &&
      currentProduct.image_url !== nextImageUrl &&
      currentProduct.image_url.startsWith("/uploads/products/")
    ) {
      await removeUploadedImage(supabase, currentProduct.image_url);
    }

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/admin/home");
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${id}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : "更新失败";
    throw new Error(message);
  }
}

async function updateProductSortOrder(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));
  const sortOrderRaw = formData.get("sort_order")?.toString().trim();
  const sortOrder = Number(sortOrderRaw);

  if (!id || !sortOrderRaw || Number.isNaN(sortOrder) || sortOrder < 0) {
    return;
  }

  try {
    let supabase;
    try {
      supabase = getSupabaseServerClient();
    } catch {
      throw new Error("缺少 Supabase 配置，请检查环境变量。");
    }
    const { error } = await supabase.from("hikuada_products").update({ sort_order: sortOrder }).eq("id", id);
    if (error) {
      throw new Error(`排序保存失败：${error.message}`);
    }

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/admin/home");
    revalidatePath("/");
    revalidatePath("/products");
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "排序保存失败");
  }
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams?:
    | { page?: string; q?: string; imported?: string; bulk_skipped?: string; bulk_err?: string }
    | Promise<{
        page?: string;
        q?: string;
        imported?: string;
        bulk_skipped?: string;
        bulk_err?: string;
      }>;
}) {
  const sp = await Promise.resolve(searchParams ?? {});
  const rawQ = sanitizeAdminSearchInput(typeof sp.q === "string" ? sp.q : "");
  const rawPage = Number(sp.page || "1");
  const currentPage = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
  const supabase = getSupabaseServerClient();
  const from = (currentPage - 1) * ADMIN_PRODUCTS_PER_PAGE;
  const to = from + ADMIN_PRODUCTS_PER_PAGE - 1;

  let listQuery = supabase
    .from("hikuada_products")
    .select(
      "id, model, display_name, category, sort_order, size, packing_spec, detail_specs, stock_status, stock_quantity, image_url, image_object_fit, created_at",
      { count: "exact" },
    )
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (rawQ.length > 0) {
    const pat = ilikeOrPattern(rawQ);
    listQuery = listQuery.or(
      `model.ilike.${pat},display_name.ilike.${pat},detail_specs.ilike.${pat},size.ilike.${pat},packing_spec.ilike.${pat},category.ilike.${pat}`,
    );
  }

  const [listRes, imagePickRes] = await Promise.all([
    listQuery.range(from, to),
    supabase
      .from("hikuada_products")
      .select("image_url, model")
      .not("image_url", "is", null)
      .order("sort_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(3000),
  ]);

  const { data, error, count } = listRes;
  const totalCount = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / ADMIN_PRODUCTS_PER_PAGE));
  if (totalCount > 0 && currentPage > totalPages) {
    redirect(hrefAdminProductsList(totalPages, rawQ));
  }

  const products = (data || []) as Product[];

  const { data: categoriesData } = await supabase
    .from("hikuada_categories")
    .select("slug, name")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  const categories = (categoriesData || []) as CategoryOption[];
  const categoryOptions =
    categories.length > 0
      ? categories
      : [
          { slug: "ps_moldings", name: "PS Moldings" },
          { slug: "frame_machinery_consumables", name: "Frame Making Machinery & Consumables" },
          { slug: "finished_products_others", name: "Finished Products & Other Products" },
        ];
  const existingImageOptions = Array.from(
    new Map(
      (imagePickRes.data || [])
        .filter((row: { image_url: string | null }) => row.image_url)
        .map((row: { image_url: string; model: string | null }) => [
          row.image_url,
          row.model || row.image_url || "",
        ]),
    ).entries(),
  );

  return (
    <div>
      <header className="mb-4">
        <h2 className="text-sm font-medium text-slate-900">产品管理</h2>
      </header>

      {sp.imported ? (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          成功导入 <span className="font-semibold">{sp.imported}</span> 条产品
          {sp.bulk_skipped
            ? `；已跳过 ${sp.bulk_skipped} 行（型号为空、尺寸无效或与数据库约束冲突）。`
            : "。"}
        </div>
      ) : null}
      {sp.bulk_err ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {bulkImportErrorMessage(sp.bulk_err)}
        </div>
      ) : null}

      <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-slate-900">新增产品</h3>
        <form id="admin-create-product" action={createProduct} className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            name="model"
            required
            placeholder="型号（如 HKD-801）"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
          />
          <input
            name="display_name"
            placeholder="前台详情标题（可选，如机械英文名）"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
          />
          <select
            name="category"
            defaultValue="ps_moldings"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
          >
            {categoryOptions.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
          <div className="grid gap-2 md:grid-cols-2">
            <input
              name="size_width"
              required
              type="number"
              min="0.1"
              step="0.1"
              placeholder="宽度(mm)"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
            />
            <input
              name="size_height"
              required
              type="number"
              min="0.1"
              step="0.1"
              placeholder="高度(mm)"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
            />
          </div>
          <input
            name="packing_length"
            type="number"
            min="0.1"
            step="0.01"
            placeholder="包装长度 m（可选，需与 pcs 同时填写）"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
          />
          <input
            name="packing_pcs"
            type="number"
            min="1"
            step="1"
            placeholder="每箱 pcs（可选，需与长度同时填写）"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
          />
          <input
            type="number"
            min="0"
            name="sort_order"
            defaultValue={100}
            placeholder="排序序号（数字越大越靠后）"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
          />
          <select
            name="stock_status"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
            defaultValue="In Stock"
          >
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
          <input
            type="number"
            min="0"
            name="stock_quantity"
            placeholder="库存数量（可选）"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
          />
          <select
            name="image_object_fit"
            defaultValue="cover"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
            title="前台卡片缩略图如何放入固定高度区域"
          >
            <option value="cover">卡片图片：铺满裁剪（默认）</option>
            <option value="contain">卡片图片：完整显示（留白）</option>
          </select>
          <textarea
            name="detail_specs"
            rows={6}
            placeholder="详情页完整参数（可选，多行；有内容时前台详情页主区块显示此项，适合机械长说明）"
            className="md:col-span-2 min-h-[120px] rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
          />
          <input
            type="file"
            name="image_file"
            accept="image/*"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
          />
          <select
            name="existing_image_url"
            defaultValue=""
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
          >
            <option value="">使用已有图片（可选）</option>
            {existingImageOptions.map(([url, label]) => (
              <option key={url} value={url}>
                {label}
              </option>
            ))}
          </select>
        </form>
        <div className="mt-4 flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-end sm:justify-between">
          <button
            type="submit"
            form="admin-create-product"
            className="w-fit rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            保存产品
          </button>
          <div className="flex flex-col gap-3 sm:items-end">
            <a
              href="/api/admin/products/bulk-template"
              className="inline-flex w-fit items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
            >
              下载批量模板
            </a>
            <form action={bulkImportProducts} className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                type="file"
                name="bulk_file"
                accept=".csv,text/csv"
                className="max-w-full text-sm file:mr-2 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-slate-800"
              />
              <button
                type="submit"
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
              >
                批量上传产品
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {error ? (
          <p className="p-6 text-sm text-red-600">加载产品失败：{error.message}</p>
        ) : (
          <>
            <div className="border-b border-slate-200 px-4 py-3">
              <form method="get" action="/admin/products" className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <input
                  type="search"
                  name="q"
                  defaultValue={rawQ}
                  placeholder="搜索型号、尺寸、包装规格、分类…"
                  autoComplete="off"
                  className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
                />
                <div className="flex shrink-0 flex-wrap gap-2">
                  <button
                    type="submit"
                    className="rounded-lg border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                  >
                    搜索
                  </button>
                  {rawQ ? (
                    <Link
                      href="/admin/products"
                      className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      清空
                    </Link>
                  ) : null}
                </div>
              </form>
            </div>
            {totalCount === 0 && !rawQ ? (
              <p className="p-6 text-sm text-slate-600">暂无产品，请先新增。</p>
            ) : totalCount === 0 && rawQ ? (
              <p className="p-6 text-sm text-slate-600">
                未找到与「<span className="font-medium text-slate-800">{rawQ}</span>」匹配的产品。
              </p>
            ) : (
              <>
                <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-2 text-xs text-slate-600">
                  共 <span className="font-semibold tabular-nums">{totalCount}</span> 条
                  {rawQ ? (
                    <>
                      （关键词「<span className="font-medium text-slate-800">{rawQ}</span>」）
                    </>
                  ) : null}
                  ；当前第 <span className="font-semibold tabular-nums">{currentPage}</span> / {totalPages} 页（每页{" "}
                  {ADMIN_PRODUCTS_PER_PAGE} 条）
                </div>
                <AdminProductsTable
                  products={products}
                  deleteAction={deleteProducts}
                  clearImageAction={clearProductImage}
                  updateAction={updateProduct}
                  updateSortOrderAction={updateProductSortOrder}
                  existingImageOptions={existingImageOptions}
                  categoryOptions={categoryOptions.map((category) => [category.slug, category.name])}
                />
                {totalPages > 1 ? (
                  <nav
                    className="flex flex-wrap items-center justify-center gap-2 border-t border-slate-100 px-4 py-4"
                    aria-label="产品列表分页"
                  >
                    {currentPage > 1 ? (
                      <Link
                        href={hrefAdminProductsList(currentPage - 1, rawQ)}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        上一页
                      </Link>
                    ) : (
                      <span className="cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-400">
                        上一页
                      </span>
                    )}
                    <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                      {getPageList(currentPage, totalPages).map((item, idx) =>
                        item === "ellipsis" ? (
                          <span
                            key={`ellipsis-${idx}`}
                            className="px-1 text-sm font-medium text-slate-400"
                            aria-hidden
                          >
                            …
                          </span>
                        ) : item === currentPage ? (
                          <span
                            key={item}
                            className="inline-flex min-w-10 items-center justify-center rounded-lg border border-slate-900 bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
                            aria-current="page"
                          >
                            {item}
                          </span>
                        ) : (
                          <Link
                            key={item}
                            href={hrefAdminProductsList(item, rawQ)}
                            className="inline-flex min-w-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                          >
                            {item}
                          </Link>
                        ),
                      )}
                    </div>
                    {currentPage < totalPages ? (
                      <Link
                        href={hrefAdminProductsList(currentPage + 1, rawQ)}
                        className="rounded-lg border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                      >
                        下一页
                      </Link>
                    ) : (
                      <span className="cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-400">
                        下一页
                      </span>
                    )}
                  </nav>
                ) : null}
              </>
            )}
          </>
        )}
      </section>
    </div>
  );
}
