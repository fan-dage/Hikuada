import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase";
import { AddToInquiryListButton } from "@/components/add-to-inquiry-list-button";
import { ProductCardSpecs } from "@/components/product-card-specs";
import { ProductImagePreview } from "@/components/product-image-preview";
import { productCardImageObjectFit } from "@/lib/product-card-image-fit";
import { SiteHeader } from "@/components/site-header";

const PRODUCTS_PER_PAGE = 16;

type Product = {
  id: number;
  model: string | null;
  sort_order: number | null;
  size: string | null;
  packing_spec: string | null;
  stock_status: string | null;
  image_url: string | null;
  image_object_fit: string | null;
};

function getStockBadgeClass(status: string | null) {
  const normalized = (status || "").trim().toLowerCase();
  if (normalized === "low stock") {
    return "bg-amber-500 text-white";
  }
  if (normalized === "out stock" || normalized === "out of stock") {
    return "bg-slate-500 text-white";
  }
  return "bg-emerald-600 text-white";
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: { page?: string; category?: string } | Promise<{ page?: string; category?: string }>;
}) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const rawPage = Number(resolvedSearchParams?.page || "1");
  const currentPage = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
  const category = resolvedSearchParams?.category;
  const from = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const to = from + PRODUCTS_PER_PAGE - 1;
  const validCategory =
    category === "ps_moldings" || category === "frame_machinery_consumables" || category === "finished_products_others"
      ? category
      : null;
  let categoryTitle = "More Product Series";
  let categorySubtitle = "Browse complete in-stock models from Hikuada factory.";
  if (validCategory === "ps_moldings") {
    categoryTitle = "Picture Frame Moldings";
    categorySubtitle = "Browse complete in-stock moldings from Hikuada factory.";
  } else if (validCategory === "frame_machinery_consumables") {
    categoryTitle = "Frame Machinery & Consumables";
    categorySubtitle = "Browse machinery and consumables for frame manufacturing workflows.";
  } else if (validCategory === "finished_products_others") {
    categoryTitle = "Finished Products & Other Products";
    categorySubtitle = "Finished product lines and other wholesale-ready product options.";
  }

  const supabase = getSupabaseServerClient();
  let query = supabase
    .from("hikuada_products")
    .select("id, model, sort_order, size, packing_spec, stock_status, image_url, image_object_fit", {
      count: "exact",
    })
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (validCategory === "ps_moldings") {
    query = query.or("category.eq.ps_moldings,category.is.null");
  } else if (validCategory === "frame_machinery_consumables") {
    query = query.eq("category", "frame_machinery_consumables");
  } else if (validCategory === "finished_products_others") {
    query = query.eq("category", "finished_products_others");
  }

  const { data, count } = await query.range(from, to);

  const products = (data || []) as Product[];
  const totalCount = count || 0;
  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage * PRODUCTS_PER_PAGE < totalCount;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{categoryTitle}</h1>
            <p className="mt-2 text-slate-600">{categorySubtitle}</p>
          </div>
          <Link
            href="/#products"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Back to Home
          </Link>
        </header>
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <Link
            href="/products?category=ps_moldings"
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
              validCategory === "ps_moldings"
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            Picture Frame Moldings
          </Link>
          <Link
            href="/products?category=frame_machinery_consumables"
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
              validCategory === "frame_machinery_consumables"
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            Frame Machinery & Consumables
          </Link>
          <Link
            href="/products?category=finished_products_others"
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
              validCategory === "finished_products_others"
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            Finished & Other Products
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">
            暂无产品数据，请到后台「产品管理」新增产品。
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <article
                key={product.id}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_-30px_rgba(15,23,42,0.45)]"
              >
                <span
                  className={`absolute right-4 top-4 z-10 rounded-full px-3 py-1 text-xs font-semibold ${getStockBadgeClass(
                    product.stock_status,
                  )}`}
                >
                  {product.stock_status || "In Stock"}
                </span>
                <div className="h-44 border-b border-slate-200 bg-slate-100 p-4">
                  <ProductImagePreview
                    src={product.image_url}
                    alt={`${product.model || "Product"} image`}
                    objectFit={productCardImageObjectFit(product.image_object_fit)}
                  />
                </div>
                <div className="space-y-2 p-5">
                  <h3 className="text-xl font-bold text-slate-900">{product.model || "-"}</h3>
                  <ProductCardSpecs size={product.size} packingSpec={product.packing_spec} />
                  <AddToInquiryListButton product={product} />
                </div>
              </article>
            ))}
          </div>
        )}

        {(hasPrevPage || hasNextPage) && (
          <div className="mt-8 flex justify-center gap-3">
            {hasPrevPage && (
              <Link
                href={
                  currentPage - 1 <= 1
                    ? validCategory
                      ? `/products?category=${validCategory}`
                      : "/products"
                    : validCategory
                      ? `/products?page=${currentPage - 1}&category=${validCategory}`
                      : `/products?page=${currentPage - 1}`
                }
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Previous
              </Link>
            )}
            {hasNextPage && (
              <Link
                href={
                  validCategory
                    ? `/products?page=${currentPage + 1}&category=${validCategory}`
                    : `/products?page=${currentPage + 1}`
                }
                className="rounded-lg border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
