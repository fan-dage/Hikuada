import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import type { SupabaseClient } from "@supabase/supabase-js";
import { BANNER_UPLOAD_PREFIX } from "@/lib/banner-constants";

export { BANNER_UPLOAD_PREFIX } from "@/lib/banner-constants";

/** Same bucket as products by default; override with SUPABASE_BANNER_BUCKET if you use a dedicated bucket. */
const STORAGE_BUCKET =
  process.env.SUPABASE_BANNER_BUCKET?.trim() ||
  process.env.SUPABASE_PRODUCTS_BUCKET?.trim() ||
  "products";

function parseBannerStorageObjectPath(publicUrl: string): string | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return null;
  const expectedPrefix = `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/`;
  if (!publicUrl.startsWith(expectedPrefix)) return null;
  return decodeURIComponent(publicUrl.slice(expectedPrefix.length));
}

async function saveBannerImageToLocal(file: File): Promise<string> {
  const uploadDir = path.join(process.cwd(), "public", "uploads", "banner");
  await mkdir(uploadDir, { recursive: true });
  const safeExt = file.name.includes(".") ? file.name.split(".").pop()?.toLowerCase() || "jpg" : "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;
  const filePath = path.join(uploadDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);
  return `${BANNER_UPLOAD_PREFIX}${filename}`;
}

/**
 * Uploads banner image to Supabase Storage when available (required on Vercel / read-only FS).
 * Falls back to `public/uploads/banner` for local dev when Storage fails.
 */
export async function saveBannerImage(supabase: SupabaseClient, file: File): Promise<string> {
  const safeExt = file.name.includes(".") ? file.name.split(".").pop()?.toLowerCase() || "jpg" : "jpg";
  const objectPath = `site-banner/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadErr } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(objectPath, buffer, { contentType: file.type || undefined, upsert: false });

  if (!uploadErr) {
    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(objectPath);
    if (data.publicUrl) return data.publicUrl;
  }

  try {
    return await saveBannerImageToLocal(file);
  } catch (err) {
    const storageHint = uploadErr?.message ? ` Storage: ${uploadErr.message}.` : "";
    const localDetail = err instanceof Error ? err.message : String(err);
    throw new Error(
      `横幅图片上传失败（线上环境需要可用的 Supabase Storage）。${storageHint} 本地写入：${localDetail}`,
    );
  }
}

export async function removeBannerUpload(supabase: SupabaseClient, imageUrl: string | null | undefined) {
  if (!imageUrl) return;

  const objectPath = parseBannerStorageObjectPath(imageUrl);
  if (objectPath) {
    await supabase.storage.from(STORAGE_BUCKET).remove([objectPath]);
    return;
  }

  if (!imageUrl.startsWith(BANNER_UPLOAD_PREFIX)) return;
  const filePath = path.join(process.cwd(), "public", imageUrl.replace(/^\//, ""));
  try {
    await unlink(filePath);
  } catch {
    /* ignore missing */
  }
}
