import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase";
import { AdminProductsTable } from "@/components/admin-products-table";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

type Product = {
  id: number;
  model: string | null;
  category: string | null;
  sort_order: number | null;
  size: string | null;
  packing_spec: string | null;
  stock_status: string | null;
  stock_quantity: number | null;
  image_url: string | null;
  created_at: string | null;
};

type CategoryOption = {
  slug: string;
  name: string;
};

async function saveProductImage(file: File) {
  const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
  await mkdir(uploadDir, { recursive: true });
  const safeExt = file.name.includes(".") ? file.name.split(".").pop()?.toLowerCase() || "jpg" : "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;
  const filePath = path.join(uploadDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);
  return `/uploads/products/${filename}`;
}

async function removeLocalImage(imageUrl: string | null | undefined) {
  if (!imageUrl || !imageUrl.startsWith("/uploads/products/")) {
    return;
  }
  const filePath = path.join(process.cwd(), "public", imageUrl.replace(/^\//, ""));
  try {
    await unlink(filePath);
  } catch {
    // Ignore missing files.
  }
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
  },
) {
  const withSort = { ...row };
  let { error } = await supabase.from("hikuada_products").insert(withSort);
  const msg = error?.message?.toLowerCase() ?? "";
  if (
    error &&
    (msg.includes("sort_order") || msg.includes("schema cache") || error.code === "PGRST204")
  ) {
    const { sort_order: _omit, ...withoutSort } = withSort;
    ({ error } = await supabase.from("hikuada_products").insert(withoutSort));
  }
  return { error };
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
  },
) {
  const withSort = { ...row };
  let { error } = await supabase.from("hikuada_products").update(withSort).eq("id", id);
  const msg = error?.message?.toLowerCase() ?? "";
  if (
    error &&
    (msg.includes("sort_order") || msg.includes("schema cache") || error.code === "PGRST204")
  ) {
    const { sort_order: _omit, ...withoutSort } = withSort;
    ({ error } = await supabase.from("hikuada_products").update(withoutSort).eq("id", id));
  }
  return { error };
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
    if (!packingLengthRaw || !packingPcsRaw) {
      return;
    }
    const packingLength = packingLengthRaw ? Number(packingLengthRaw) : NaN;
    const packingPcs = packingPcsRaw ? Number(packingPcsRaw) : NaN;
    if (
      Number.isNaN(packingLength) ||
      Number.isNaN(packingPcs) ||
      packingLength <= 0 ||
      packingPcs <= 0
    ) {
      return;
    }
    packingSpec = `${packingLength}m x ${packingPcs} pcs / carton`;
  }
  const stockQuantity = stockQuantityRaw ? Number(stockQuantityRaw) : null;
  const sortOrder = Number(sortOrderRaw);

  if (!model || !sizeWidthRaw || !sizeHeightRaw || !size) {
    return;
  }
  if (stockQuantityRaw && Number.isNaN(stockQuantity)) {
    return;
  }
  if (Number.isNaN(sizeWidth) || Number.isNaN(sizeHeight) || sizeWidth <= 0 || sizeHeight <= 0) {
    return;
  }
  if (Number.isNaN(sortOrder) || sortOrder < 0) {
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
        imageUrl = await saveProductImage(imageFile);
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
  await Promise.all((existingProducts || []).map((item) => removeLocalImage(item.image_url as string | null)));
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
  await removeLocalImage((product?.image_url as string | null) || null);
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
  const stockQuantity = stockQuantityRaw ? Number(stockQuantityRaw) : null;
  const sortOrder = Number(sortOrderRaw);

  let packingSpec = "";
  if (packingLengthRaw || packingPcsRaw) {
    if (!packingLengthRaw || !packingPcsRaw) {
      return;
    }
    const packingLength = packingLengthRaw ? Number(packingLengthRaw) : NaN;
    const packingPcs = packingPcsRaw ? Number(packingPcsRaw) : NaN;
    if (
      Number.isNaN(packingLength) ||
      Number.isNaN(packingPcs) ||
      packingLength <= 0 ||
      packingPcs <= 0
    ) {
      return;
    }
    packingSpec = `${packingLength}m x ${packingPcs} pcs / carton`;
  }

  if (
    Number.isNaN(sizeWidth) ||
    Number.isNaN(sizeHeight) ||
    sizeWidth <= 0 ||
    sizeHeight <= 0
  ) {
    return;
  }
  if (stockQuantityRaw && Number.isNaN(stockQuantity)) {
    return;
  }
  if (Number.isNaN(sortOrder) || sortOrder < 0) {
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
        nextImageUrl = await saveProductImage(imageFile);
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
    });

    if (updateError) {
      throw new Error(`数据库更新失败：${updateError.message}`);
    }

    if (
      currentProduct?.image_url &&
      currentProduct.image_url !== nextImageUrl &&
      currentProduct.image_url.startsWith("/uploads/products/")
    ) {
      await removeLocalImage(currentProduct.image_url);
    }

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/admin/home");
    revalidatePath("/");
    revalidatePath("/products");
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

export default async function AdminProductsPage() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("hikuada_products")
    .select("id, model, category, sort_order, size, packing_spec, stock_status, stock_quantity, image_url, created_at")
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

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
      products
        .filter((product) => product.image_url)
        .map((product) => [product.image_url as string, product.model || product.image_url || ""])
    ).entries(),
  );

  return (
    <div>
      <header className="mb-4">
        <h2 className="text-sm font-medium text-slate-900">产品管理</h2>
      </header>

      <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-slate-900">新增产品</h3>
        <form action={createProduct} className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            name="model"
            required
            placeholder="型号（如 HKD-801）"
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
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 md:col-span-2 md:w-fit"
          >
            保存产品
          </button>
        </form>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {error ? (
          <p className="p-6 text-sm text-red-600">加载产品失败：{error.message}</p>
        ) : products.length === 0 ? (
          <p className="p-6 text-sm text-slate-600">暂无产品，请先新增。</p>
        ) : (
          <AdminProductsTable
            products={products}
            deleteAction={deleteProducts}
            clearImageAction={clearProductImage}
            updateAction={updateProduct}
            updateSortOrderAction={updateProductSortOrder}
            existingImageOptions={existingImageOptions}
            categoryOptions={categoryOptions.map((category) => [category.slug, category.name])}
          />
        )}
      </section>
    </div>
  );
}
