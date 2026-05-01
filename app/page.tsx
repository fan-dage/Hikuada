import { AddToInquiryListButton } from "@/components/add-to-inquiry-list-button";
import { InquiryForm } from "@/components/inquiry-form";
import { HomeBannerCarousel } from "@/components/home-banner-carousel";
import { getSupabaseServerClient } from "@/lib/supabase";
import { ProductCardSpecs } from "@/components/product-card-specs";
import { ProductImagePreview } from "@/components/product-image-preview";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import Image from "next/image";

const PRODUCTS_PER_PAGE = 8;

const DEFAULT_HOME_TAGS = [
  "Direct Factory Price",
  "Fast Shipping to Vietnam",
  "Strict Quality Control",
];

const DEFAULT_BANNER_SRC = "/banner-frame-gallery.png";
const DEFAULT_BANNER_ALT = "Industrial frame manufacturing workshop";

type Product = {
  id: number;
  model: string | null;
  category: string | null;
  sort_order: number | null;
  size: string | null;
  packing_spec: string | null;
  stock_status: string | null;
  image_url: string | null;
};

export default async function Home({
  searchParams,
}: {
  searchParams?: { page?: string } | Promise<{ page?: string }>;
}) {
  await Promise.resolve(searchParams);
  const supabase = getSupabaseServerClient();

  const { data: homeTagRows, error: homeTagsError } = await supabase
    .from("hikuada_home_tags")
    .select("label, sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  let trustItems = DEFAULT_HOME_TAGS;
  if (!homeTagsError && homeTagRows?.length) {
    const parsed = homeTagRows
      .map((row) => row.label?.trim())
      .filter((v): v is string => Boolean(v));
    if (parsed.length > 0) trustItems = parsed;
  }

  const { data: bannerSlideRows, error: bannerSlidesErr } = await supabase
    .from("hikuada_banner_slides")
    .select("image_url, alt_text")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  let bannerSlides: { src: string; alt: string }[] = [];
  if (!bannerSlidesErr && bannerSlideRows?.length) {
    bannerSlides = bannerSlideRows
      .map((row) => ({
        src: String(row.image_url ?? "").trim(),
        alt: String(row.alt_text ?? "").trim() || DEFAULT_BANNER_ALT,
      }))
      .filter((s) => s.src.length > 0);
  }
  if (bannerSlides.length === 0) {
    bannerSlides = [{ src: DEFAULT_BANNER_SRC, alt: DEFAULT_BANNER_ALT }];
  }

  const { data, count } = await supabase
    .from("hikuada_products")
    .select("id, model, category, sort_order, size, packing_spec, stock_status, image_url", { count: "exact" })
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false })
    .or("category.eq.ps_moldings,category.is.null")
    .range(0, PRODUCTS_PER_PAGE - 1);
  const products = (data || []) as Product[];
  const totalCount = count || 0;

  const { data: machineryData } = await supabase
    .from("hikuada_products")
    .select("id, model, category, sort_order, size, packing_spec, stock_status, image_url")
    .eq("category", "frame_machinery_consumables")
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(8);
  const machineryProducts = (machineryData || []) as Product[];

  const { data: finishedData } = await supabase
    .from("hikuada_products")
    .select("id, model, category, sort_order, size, packing_spec, stock_status, image_url")
    .eq("category", "finished_products_others")
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(8);
  const finishedProducts = (finishedData || []) as Product[];

  const hasMoreProducts = totalCount > PRODUCTS_PER_PAGE;

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

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <section className="relative z-0 w-full overflow-hidden border-y border-slate-200">
        <HomeBannerCarousel slides={bannerSlides} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950/45 via-slate-900/15 to-transparent" />
        <div className="pointer-events-none absolute inset-0">
          <div className="mx-auto flex h-full max-w-6xl items-center px-6">
            <div className="max-w-3xl space-y-6 pt-2 text-white">
              <p className="inline-block rounded-full border border-white/40 bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-white">
                PS MOLDINGS | FACTORY DIRECT
              </p>
              <h1 className="text-4xl font-extrabold leading-[1.05] text-white md:text-6xl">
                Premium PS Moldings Factory Direct
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-white/90 md:text-lg">
                Specialized in Southeast Asia markets with Form E support and door-to-door double-clearance logistics.
              </p>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="rounded-full border border-white/40 bg-white/10 px-4 py-2 text-white">OEM/ODM Service</span>
                <span className="rounded-full border border-white/40 bg-white/10 px-4 py-2 text-white">Stable Output Capacity</span>
                <span className="rounded-full border border-white/40 bg-white/10 px-4 py-2 text-white">Export Standard Packing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white/80">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-6 py-5 sm:grid-cols-2 lg:grid-cols-3">
          {trustItems.map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs text-white">
                ✓
              </span>
              <p className="text-sm font-medium text-slate-700">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="products" className="mx-auto max-w-6xl px-6 pb-20 pt-12 md:pt-14">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">In-Stock Product Series</h2>
          <p className="mt-2 text-slate-600">Catalog-ready models with stable supply for wholesale channels.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {products.length > 0 ? (
            products.map((product) => (
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
                  <ProductImagePreview src={product.image_url} alt={`${product.model || "Product"} image`} />
                </div>
                <div className="space-y-2 p-5">
                  <h3 className="text-xl font-bold text-slate-900">{product.model || "-"}</h3>
                  <ProductCardSpecs size={product.size} packingSpec={product.packing_spec} />
                  <AddToInquiryListButton product={product} />
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500 md:col-span-2 xl:col-span-4">
              暂无产品数据，请到后台「产品管理」新增产品。
            </div>
          )}
        </div>
        {hasMoreProducts && (
          <div className="mt-8 flex justify-center gap-3">
            <Link
              href="/products"
              className="rounded-lg border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              View All Products
            </Link>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Frame Making Machinery & Consumables</h2>
          <p className="mt-2 text-slate-600">More machinery and consumables for frame manufacturing workflows.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {machineryProducts.length > 0 ? (
            machineryProducts.map((product) => (
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
                  <ProductImagePreview src={product.image_url} alt={`${product.model || "Product"} image`} />
                </div>
                <div className="space-y-2 p-5">
                  <h3 className="text-xl font-bold text-slate-900">{product.model || "-"}</h3>
                  <ProductCardSpecs size={product.size} packingSpec={product.packing_spec} />
                  <AddToInquiryListButton product={product} />
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500 md:col-span-2 xl:col-span-4">
              No machinery products yet. Add products in Admin with category Frame Making Machinery & Consumables.
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Finished Products & Other Products</h2>
          <p className="mt-2 text-slate-600">Finished product lines and other wholesale-ready product options.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {finishedProducts.length > 0 ? (
            finishedProducts.map((product) => (
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
                  <ProductImagePreview src={product.image_url} alt={`${product.model || "Product"} image`} />
                </div>
                <div className="space-y-2 p-5">
                  <h3 className="text-xl font-bold text-slate-900">{product.model || "-"}</h3>
                  <ProductCardSpecs size={product.size} packingSpec={product.packing_spec} />
                  <AddToInquiryListButton product={product} />
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500 md:col-span-2 xl:col-span-4">
              No finished products yet. Add products in Admin with category Finished Products & Other Products.
            </div>
          )}
        </div>
        <div className="mt-8 flex justify-center">
          <Link
            href="/products?category=finished_products_others"
            className="rounded-lg border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            View All — Finished & Other Products
          </Link>
        </div>
      </section>

      <section id="inquiry-form" className="mx-auto max-w-6xl scroll-mt-28 px-6 pb-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-2">
          <InquiryForm />
        </div>
      </section>

      <footer id="contact" className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-12 md:flex-row md:items-center">
          <p className="text-base text-slate-700">Contact Leo for Bulk Wholesale Pricing.</p>
          <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
            <a
              href="https://zalo.me/8618630000333"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-sky-700 bg-sky-700 px-8 py-4 text-base font-semibold text-white transition hover:bg-sky-800"
            >
              Chat on Zalo
            </a>
            <a
              href="https://wa.me/8619933036333"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-amber-500 bg-amber-500 px-8 py-4 text-base font-semibold text-slate-950 transition hover:bg-amber-400"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
