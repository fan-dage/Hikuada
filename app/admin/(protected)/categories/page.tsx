import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase";

type Category = {
  id: number;
  slug: string;
  name: string;
  sort_order: number;
  is_active: boolean;
};

function normalizeSlug(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

async function createCategory(formData: FormData) {
  "use server";
  const name = formData.get("name")?.toString().trim() || "";
  const slugRaw = formData.get("slug")?.toString().trim() || "";
  const sortOrderRaw = formData.get("sort_order")?.toString().trim() || "100";
  const sortOrder = Number(sortOrderRaw);

  if (!name) return;
  if (Number.isNaN(sortOrder)) return;
  const slug = normalizeSlug(slugRaw || name);
  if (!slug) return;

  const supabase = getSupabaseServerClient();
  await supabase.from("hikuada_categories").insert({
    name,
    slug,
    sort_order: sortOrder,
    is_active: true,
  });
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
}

async function deleteCategory(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));
  if (!id) return;
  const supabase = getSupabaseServerClient();
  await supabase.from("hikuada_categories").delete().eq("id", id);
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
}

async function toggleCategory(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));
  const next = formData.get("next")?.toString() === "true";
  if (!id) return;
  const supabase = getSupabaseServerClient();
  await supabase.from("hikuada_categories").update({ is_active: next }).eq("id", id);
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
}

export default async function AdminCategoriesPage() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("hikuada_categories")
    .select("id, slug, name, sort_order, is_active")
    .order("sort_order", { ascending: true });

  const categories = (data || []) as Category[];

  return (
    <div>
      <header className="mb-4">
        <h2 className="text-sm font-medium text-slate-900">分类管理</h2>
      </header>

      <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-slate-900">新增分类</h3>
        <form action={createCategory} className="mt-4 grid gap-3 md:grid-cols-4">
          <input
            name="name"
            required
            placeholder="分类名称（如 PS Moldings）"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
          />
          <input
            name="slug"
            placeholder="分类标识（可选，如 ps_moldings）"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
          />
          <input
            type="number"
            name="sort_order"
            defaultValue={100}
            placeholder="排序"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
          />
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            保存分类
          </button>
        </form>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {error ? (
          <p className="p-6 text-sm text-red-600">加载分类失败：{error.message}</p>
        ) : categories.length === 0 ? (
          <p className="p-6 text-sm text-slate-600">暂无分类，请先新增。</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="border-b border-slate-200 px-4 py-3 font-medium">名称</th>
                  <th className="border-b border-slate-200 px-4 py-3 font-medium">标识</th>
                  <th className="border-b border-slate-200 px-4 py-3 font-medium">排序</th>
                  <th className="border-b border-slate-200 px-4 py-3 font-medium">状态</th>
                  <th className="border-b border-slate-200 px-4 py-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="text-slate-800">
                    <td className="border-b border-slate-100 px-4 py-4">{category.name}</td>
                    <td className="border-b border-slate-100 px-4 py-4">{category.slug}</td>
                    <td className="border-b border-slate-100 px-4 py-4">{category.sort_order}</td>
                    <td className="border-b border-slate-100 px-4 py-4">
                      {category.is_active ? "启用" : "停用"}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-4">
                      <div className="flex gap-2">
                        <form action={toggleCategory}>
                          <input type="hidden" name="id" value={category.id} />
                          <input type="hidden" name="next" value={category.is_active ? "false" : "true"} />
                          <button
                            type="submit"
                            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            {category.is_active ? "停用" : "启用"}
                          </button>
                        </form>
                        <form action={deleteCategory}>
                          <input type="hidden" name="id" value={category.id} />
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
