import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { BANNER_UPLOAD_PREFIX } from "@/lib/banner-constants";

export { BANNER_UPLOAD_PREFIX } from "@/lib/banner-constants";

export async function saveBannerImage(file: File): Promise<string> {
  const uploadDir = path.join(process.cwd(), "public", "uploads", "banner");
  await mkdir(uploadDir, { recursive: true });
  const safeExt = file.name.includes(".") ? file.name.split(".").pop()?.toLowerCase() || "jpg" : "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;
  const filePath = path.join(uploadDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);
  return `${BANNER_UPLOAD_PREFIX}${filename}`;
}

export async function removeBannerUpload(imageUrl: string | null | undefined) {
  if (!imageUrl?.startsWith(BANNER_UPLOAD_PREFIX)) return;
  const filePath = path.join(process.cwd(), "public", imageUrl.replace(/^\//, ""));
  try {
    await unlink(filePath);
  } catch {
    /* ignore missing */
  }
}
