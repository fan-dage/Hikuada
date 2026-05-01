import { revalidatePath } from "next/cache";
import Image from "next/image";
import { getSupabaseServerClient } from "@/lib/supabase";
import { BANNER_UPLOAD_PREFIX, removeBannerUpload, saveBannerImage } from "@/lib/banner-upload";

const DEFAULT_ALT = "Industrial frame manufacturing workshop";

type BannerSlideRow = {
  id: number;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_active: boolean;
};

async function createBannerSlide(formData: FormData) {
  "use server";
  const altTextRaw = formData.get("alt_text")?.toString().trim() || "";
  const altText = altTextRaw || DEFAULT_ALT;
  const sortOrderRaw = formData.get("sort_order")?.toString().trim() || "100";
  const sortOrder = Number(sortOrderRaw);
  const imageFile = formData.get("image_file");

  if (!(imageFile instanceof File) || imageFile.size === 0) {
    throw new Error("新增横幅必须上传图片。");
  }
  if (Number.isNaN(sortOrder)) {
    throw new Error("排序必须为数字。");
  }

  let supabase;
  try {
    supabase = getSupabaseServerClient();
  } catch {
    throw new Error("缺少 Supabase 配置。");
  }

  const imageUrl = await saveBannerImage(imageFile);
  const { error } = await supabase.from("hikuada_banner_slides").insert({
    image_url: imageUrl,
    alt_text: altText,
    sort_order: sortOrder,
    is_active: true,
  });

  if (error) throw new Error(`新增失败：${error.message}`);
  revalidatePath("/admin/banner");
  revalidatePath("/");
}

async function updateBannerSlide(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));
  const altTextRaw = formData.get("alt_text")?.toString().trim() || "";
  const altText = altTextRaw || DEFAULT_ALT;
  const sortOrderRaw = formData.get("sort_order")?.toString().trim() || "100";
  const sortOrder = Number(sortOrderRaw);
  const imageFile = formData.get("image_file");

  if (!id || Number.isNaN(sortOrder)) {
    throw new Error("无效参数。");
  }

  let supabase;
  try {
    supabase = getSupabaseServerClient();
  } catch {
    throw new Error("缺少 Supabase 配置。");
  }

  const { data: row } = await supabase
    .from("hikuada_banner_slides")
    .select("image_url")
    .eq("id", id)
    .maybeSingle();

  let imageUrl = (row?.image_url as string | undefined)?.trim() || "";
  if (!imageUrl) throw new Error("记录不存在。");

  if (imageFile instanceof File && imageFile.size > 0) {
    const uploaded = await saveBannerImage(imageFile);
    const previous = imageUrl;
    imageUrl = uploaded;
    await removeBannerUpload(previous.startsWith(BANNER_UPLOAD_PREFIX) ? previous : null);
  }

  const { error } = await supabase
    .from("hikuada_banner_slides")
    .update({
      image_url: imageUrl,
      alt_text: altText,
      sort_order: sortOrder,
    })
    .eq("id", id);

  if (error) throw new Error(`保存失败：${error.message}`);
  revalidatePath("/admin/banner");
  revalidatePath("/");
}

async function deleteBannerSlide(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));
  if (!id) return;

  let supabase;
  try {
    supabase = getSupabaseServerClient();
  } catch {
    throw new Error("缺少 Supabase 配置。");
  }

  const { data: row } = await supabase
    .from("hikuada_banner_slides")
    .select("image_url")
    .eq("id", id)
    .maybeSingle();

  const url = (row?.image_url as string | undefined)?.trim() || "";
  await removeBannerUpload(url.startsWith(BANNER_UPLOAD_PREFIX) ? url : null);

  const { error } = await supabase.from("hikuada_banner_slides").delete().eq("id", id);
  if (error) throw new Error(`删除失败：${error.message}`);

  revalidatePath("/admin/banner");
  revalidatePath("/");
}

async function toggleBannerSlide(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));
  const next = formData.get("next")?.toString() === "true";
  if (!id) return;

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("hikuada_banner_slides").update({ is_active: next }).eq("id", id);
  if (error) throw new Error(`更新失败：${error.message}`);
  revalidatePath("/admin/banner");
  revalidatePath("/");
}

async function seedDefaultSlides() {
  "use server";
  const supabase = getSupabaseServerClient();
  const { count, error: countError } = await supabase
    .from("hikuada_banner_slides")
    .select("*", { count: "exact", head: true });

  if (countError) {
    throw new Error(`检查数据失败：${countError.message}`);
  }

  if ((count ?? 0) > 0) {
    throw new Error("已有幻灯片，无需初始化。");
  }

  const { error } = await supabase.from("hikuada_banner_slides").insert({
    image_url: "/banner-frame-gallery.png",
    alt_text: DEFAULT_ALT,
    sort_order: 10,
    is_active: true,
  });
  if (error) throw new Error(`初始化失败：${error.message}`);
  revalidatePath("/admin/banner");
  revalidatePath("/");
}

export default async function AdminBannerPage() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("hikuada_banner_slides")
    .select("id, image_url, alt_text, sort_order, is_active")
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  const slides = (data || []) as BannerSlideRow[];

  return (
    <div>
      <header className="mb-4">
        <h2 className="text-sm font-medium text-slate-900">横幅（Banner）管理</h2>
        <p className="mt-1 text-sm text-slate-600">
          支持多张图片；首页<strong className="font-medium text-slate-800">启用且多于一张</strong>
          时自动轮播。请执行{" "}
          <code className="rounded bg-slate-100 px-1 text-xs">supabase/hikuada_site_banner_schema.sql</code>
          （含从旧单图表迁移）。
        </p>
      </header>

      {error ? (
        <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
          无法读取横幅幻灯片：{error.message}（若表不存在，请先执行建表 SQL）
        </section>
      ) : (
        <>
          <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-slate-900">新增幻灯片</h3>
            <form action={createBannerSlide} className="mt-4 grid gap-3 md:grid-cols-2">
              <input
                name="alt_text"
                placeholder={`图片说明（alt），默认：${DEFAULT_ALT}`}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2 md:col-span-2"
              />
              <input
                type="number"
                name="sort_order"
                defaultValue={100}
                placeholder="排序（越小越靠前）"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
              />
              <input
                type="file"
                name="image_file"
                accept="image/*"
                required
                className="text-sm text-slate-600 file:mr-3 file:rounded-md file:border file:border-slate-300 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-medium md:col-span-2"
              />
              <button
                type="submit"
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 md:col-span-2 md:w-fit"
              >
                添加幻灯片
              </button>
            </form>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {slides.length === 0 ? (
              <div className="space-y-4 p-6">
                <p className="text-sm text-slate-600">暂无幻灯片。可点击下方插入默认的一张内置图。</p>
                <form action={seedDefaultSlides}>
                  <button
                    type="submit"
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
                  >
                    插入默认横幅图
                  </button>
                </form>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-700">
                    <tr>
                      <th className="border-b border-slate-200 px-4 py-3 font-medium">预览</th>
                      <th className="border-b border-slate-200 px-4 py-3 font-medium">编辑</th>
                      <th className="border-b border-slate-200 px-4 py-3 font-medium whitespace-nowrap">排序</th>
                      <th className="border-b border-slate-200 px-4 py-3 font-medium whitespace-nowrap">状态</th>
                      <th className="border-b border-slate-200 px-4 py-3 font-medium whitespace-nowrap">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slides.map((slide) => (
                      <tr key={slide.id} className="align-top text-slate-800">
                        <td className="border-b border-slate-100 px-4 py-4">
                          <div className="relative h-24 w-40 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                            <Image
                              src={slide.image_url}
                              alt={slide.alt_text || ""}
                              fill
                              className="object-cover"
                              sizes="160px"
                              unoptimized={slide.image_url.startsWith(BANNER_UPLOAD_PREFIX)}
                            />
                          </div>
                        </td>
                        <td className="border-b border-slate-100 px-4 py-4">
                          <form action={updateBannerSlide} className="flex max-w-md flex-col gap-2">
                            <input type="hidden" name="id" value={slide.id} />
                            <input
                              name="alt_text"
                              defaultValue={slide.alt_text || DEFAULT_ALT}
                              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
                            />
                            <input
                              type="number"
                              name="sort_order"
                              defaultValue={slide.sort_order}
                              className="w-28 rounded-lg border border-slate-300 px-3 py-2 text-sm tabular-nums outline-none ring-slate-400 focus:ring-2"
                            />
                            <input
                              type="file"
                              name="image_file"
                              accept="image/*"
                              className="text-xs text-slate-600 file:mr-2 file:rounded file:border file:border-slate-300 file:bg-white file:px-2 file:py-1"
                            />
                            <button
                              type="submit"
                              className="w-fit rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
                            >
                              保存本行
                            </button>
                          </form>
                        </td>
                        <td className="border-b border-slate-100 px-4 py-4 tabular-nums text-slate-500">
                          {slide.sort_order}
                        </td>
                        <td className="border-b border-slate-100 px-4 py-4 whitespace-nowrap">
                          {slide.is_active ? "启用" : "停用"}
                        </td>
                        <td className="border-b border-slate-100 px-4 py-4">
                          <div className="flex flex-col gap-2">
                            <form action={toggleBannerSlide}>
                              <input type="hidden" name="id" value={slide.id} />
                              <input type="hidden" name="next" value={slide.is_active ? "false" : "true"} />
                              <button
                                type="submit"
                                className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
                              >
                                {slide.is_active ? "停用" : "启用"}
                              </button>
                            </form>
                            <form action={deleteBannerSlide}>
                              <input type="hidden" name="id" value={slide.id} />
                              <button
                                type="submit"
                                className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
                              >
                                删除
                              </button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
