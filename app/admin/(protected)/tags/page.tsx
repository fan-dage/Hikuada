import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase";

type HomeTag = {
  id: number;
  label: string;
  sort_order: number;
  is_active: boolean;
};

async function createHomeTag(formData: FormData) {
  "use server";
  const label = formData.get("label")?.toString().trim() || "";
  const sortOrderRaw = formData.get("sort_order")?.toString().trim() || "100";
  const sortOrder = Number(sortOrderRaw);
  if (!label || Number.isNaN(sortOrder)) return;

  const supabase = getSupabaseServerClient();
  await supabase.from("hikuada_home_tags").insert({
    label,
    sort_order: sortOrder,
    is_active: true,
  });
  revalidatePath("/admin/tags");
  revalidatePath("/");
}

async function updateHomeTag(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));
  const label = formData.get("label")?.toString().trim() || "";
  const sortOrderRaw = formData.get("sort_order")?.toString().trim() || "100";
  const sortOrder = Number(sortOrderRaw);
  if (!id || !label || Number.isNaN(sortOrder)) return;

  const supabase = getSupabaseServerClient();
  await supabase.from("hikuada_home_tags").update({ label, sort_order: sortOrder }).eq("id", id);
  revalidatePath("/admin/tags");
  revalidatePath("/");
}

async function deleteHomeTag(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));
  if (!id) return;
  const supabase = getSupabaseServerClient();
  await supabase.from("hikuada_home_tags").delete().eq("id", id);
  revalidatePath("/admin/tags");
  revalidatePath("/");
}

async function toggleHomeTag(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));
  const next = formData.get("next")?.toString() === "true";
  if (!id) return;
  const supabase = getSupabaseServerClient();
  await supabase.from("hikuada_home_tags").update({ is_active: next }).eq("id", id);
  revalidatePath("/admin/tags");
  revalidatePath("/");
}

export default async function AdminTagsPage() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("hikuada_home_tags")
    .select("id, label, sort_order, is_active")
    .order("sort_order", { ascending: true });

  const tags = (data || []) as HomeTag[];

  return (
    <div>
      <header className="mb-4">
        <h2 className="text-sm font-medium text-slate-900">标签管理</h2>
        <p className="mt-1 text-sm text-slate-600">
          控制首页横幅下方三条信任标签文案（勾选图标区块）。需在 Supabase 执行{" "}
          <code className="rounded bg-slate-100 px-1 text-xs">supabase/hikuada_home_tags_schema.sql</code>。
        </p>
      </header>

      <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-slate-900">新增标签</h3>
        <form action={createHomeTag} className="mt-4 grid gap-3 md:grid-cols-[1fr_120px_auto]">
          <input
            name="label"
            required
            placeholder="英文展示文案（如 Direct Factory Price）"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
          />
          <input
            type="number"
            name="sort_order"
            defaultValue={100}
            placeholder="排序（越小越靠前）"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
          />
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            保存标签
          </button>
        </form>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {error ? (
          <p className="p-6 text-sm text-red-600">
            加载失败：{error.message}（若表不存在，请先执行建表 SQL）
          </p>
        ) : tags.length === 0 ? (
          <p className="p-6 text-sm text-slate-600">暂无标签，请先执行 SQL 初始化或手动新增。</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="border-b border-slate-200 px-4 py-3 font-medium">文案与排序</th>
                  <th className="border-b border-slate-200 px-4 py-3 font-medium whitespace-nowrap">状态</th>
                  <th className="border-b border-slate-200 px-4 py-3 font-medium whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody>
                {tags.map((tag) => (
                  <tr key={tag.id} className="align-top text-slate-800">
                    <td className="border-b border-slate-100 px-4 py-4">
                      <form action={updateHomeTag} className="flex flex-wrap items-end gap-2">
                        <input type="hidden" name="id" value={tag.id} />
                        <input
                          name="label"
                          required
                          defaultValue={tag.label}
                          placeholder="标签文案"
                          className="min-w-[12rem] flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
                        />
                        <label className="flex items-center gap-1 text-xs text-slate-500">
                          <span className="shrink-0">排序</span>
                          <input
                            type="number"
                            name="sort_order"
                            defaultValue={tag.sort_order}
                            className="w-20 rounded-lg border border-slate-300 px-2 py-2 text-sm tabular-nums outline-none ring-slate-400 focus:ring-2"
                          />
                        </label>
                        <button
                          type="submit"
                          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          保存修改
                        </button>
                      </form>
                    </td>
                    <td className="border-b border-slate-100 px-4 py-4 whitespace-nowrap">
                      {tag.is_active ? "启用" : "停用"}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <form action={toggleHomeTag}>
                          <input type="hidden" name="id" value={tag.id} />
                          <input type="hidden" name="next" value={tag.is_active ? "false" : "true"} />
                          <button
                            type="submit"
                            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            {tag.is_active ? "停用" : "启用"}
                          </button>
                        </form>
                        <form action={deleteHomeTag}>
                          <input type="hidden" name="id" value={tag.id} />
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
    </div>
  );
}
