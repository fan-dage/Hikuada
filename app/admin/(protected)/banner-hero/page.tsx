import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase";
import { type BannerHeroRow, normalizeBannerHero } from "@/lib/banner-hero";

async function saveBannerHero(formData: FormData) {
  "use server";

  const badge_text = formData.get("badge_text")?.toString().trim() || "";
  const headline = formData.get("headline")?.toString().trim() || "";
  const subheading = formData.get("subheading")?.toString().trim() || "";
  const pill_tag_1 = formData.get("pill_tag_1")?.toString().trim() || "";
  const pill_tag_2 = formData.get("pill_tag_2")?.toString().trim() || "";
  const pill_tag_3 = formData.get("pill_tag_3")?.toString().trim() || "";

  if (!badge_text || !headline || !subheading) {
    throw new Error("徽章文案、主标题、副标题为必填。");
  }

  let supabase;
  try {
    supabase = getSupabaseServerClient();
  } catch {
    throw new Error("缺少 Supabase 配置。");
  }

  const { error } = await supabase.from("hikuada_banner_hero").upsert(
    {
      id: 1,
      badge_text,
      headline,
      subheading,
      pill_tag_1,
      pill_tag_2,
      pill_tag_3,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) {
    throw new Error(`保存失败：${error.message}`);
  }

  revalidatePath("/admin/banner-hero");
  revalidatePath("/");
}

export default async function AdminBannerHeroPage() {
  let loadError: string | null = null;
  let row: Partial<BannerHeroRow> | null = null;

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.from("hikuada_banner_hero").select("*").eq("id", 1).maybeSingle();
    if (error) loadError = error.message;
    else row = data as Partial<BannerHeroRow> | null;
  } catch (e) {
    loadError = e instanceof Error ? e.message : "加载失败";
  }

  const hero = normalizeBannerHero(row);

  return (
    <div>
      <header className="mb-4">
        <h2 className="text-sm font-medium text-slate-900">横幅文案管理</h2>
        <p className="mt-1 text-sm text-slate-600">
          编辑首页 Banner 轮播图上的白色大字区域（徽章、主标题、副标题与最多三个标签）。标签留空则不显示该枚。
        </p>
        <p className="mt-2 text-xs text-slate-500">
          首次使用请在 Supabase SQL 编辑器执行{" "}
          <code className="rounded bg-slate-100 px-1">supabase/hikuada_banner_hero_schema.sql</code>
        </p>
      </header>

      {loadError ? (
        <section className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          读取数据库失败（仍可尝试保存）：{loadError}
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <form action={saveBannerHero} className="max-w-2xl space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">徽章（顶部小标签）</label>
            <input
              name="badge_text"
              required
              defaultValue={hero.badge_text}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">主标题（大号）</label>
            <input
              name="headline"
              required
              defaultValue={hero.headline}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">副标题（段落）</label>
            <textarea
              name="subheading"
              required
              rows={3}
              defaultValue={hero.subheading}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
            />
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">标签 1（可选）</label>
              <input
                name="pill_tag_1"
                defaultValue={hero.pill_tag_1}
                placeholder="留空则不显示"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">标签 2（可选）</label>
              <input
                name="pill_tag_2"
                defaultValue={hero.pill_tag_2}
                placeholder="留空则不显示"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">标签 3（可选）</label>
              <input
                name="pill_tag_3"
                defaultValue={hero.pill_tag_3}
                placeholder="留空则不显示"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
              />
            </div>
          </div>
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            保存并更新首页
          </button>
        </form>
      </section>
    </div>
  );
}
