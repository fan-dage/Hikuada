"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState, type FocusEvent, type KeyboardEvent } from "react";

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
};

export function AdminProductsTable({
  products,
  deleteAction,
  clearImageAction,
  updateAction,
  updateSortOrderAction,
  existingImageOptions,
  categoryOptions,
}: {
  products: Product[];
  deleteAction: (formData: FormData) => void;
  clearImageAction: (formData: FormData) => void;
  updateAction: (formData: FormData) => void;
  updateSortOrderAction: (formData: FormData) => void;
  existingImageOptions: Array<[string, string]>;
  categoryOptions: Array<[string, string]>;
}) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imagePreview, setImagePreview] = useState<{ src: string; alt: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const categoryLabelMap = useMemo(() => new Map(categoryOptions), [categoryOptions]);

  const allSelected = useMemo(
    () => products.length > 0 && selectedIds.length === products.length,
    [products.length, selectedIds.length],
  );
  const sortedProducts = useMemo(
    () =>
      [...products].sort((a, b) => {
        const aSort = a.sort_order ?? Number.MAX_SAFE_INTEGER;
        const bSort = b.sort_order ?? Number.MAX_SAFE_INTEGER;
        if (aSort !== bSort) return aSort - bSort;
        return b.id - a.id;
      }),
    [products],
  );

  function toggleSelectAll(checked: boolean) {
    if (checked) {
      setSelectedIds(products.map((product) => product.id));
      return;
    }
    setSelectedIds([]);
  }

  function toggleRow(id: number, checked: boolean) {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
      return;
    }
    setSelectedIds((prev) => prev.filter((value) => value !== id));
  }

  function handleDeleteClick() {
    if (selectedIds.length === 0) {
      return;
    }
    const confirmed = window.confirm(`确认删除已选中的 ${selectedIds.length} 个产品吗？`);
    if (confirmed) {
      formRef.current?.requestSubmit();
    }
  }

  function parseSize(size: string | null) {
    if (!size) return { width: "", height: "" };
    const match = size.match(/([\d.]+)\s*x\s*([\d.]+)/i);
    if (!match) return { width: "", height: "" };
    return { width: match[1], height: match[2] };
  }

  function parsePacking(packingSpec: string | null) {
    if (!packingSpec) return { length: "", pcs: "" };
    const match = packingSpec.match(/([\d.]+)m\s*x\s*(\d+)\s*pcs/i);
    if (!match) return { length: "", pcs: "" };
    return { length: match[1], pcs: match[2] };
  }

  function handleSortOrderKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.blur();
    }
  }

  function handleSortOrderBlur(event: FocusEvent<HTMLInputElement>) {
    event.currentTarget.form?.requestSubmit();
  }

  useEffect(() => {
    if (!imagePreview) return;
    function onKey(event: WindowEventMap["keydown"]) {
      if (event.key === "Escape") setImagePreview(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [imagePreview]);

  return (
    <>
      <div className="flex justify-end border-b border-slate-200 px-4 py-3">
        <form ref={formRef} action={deleteAction}>
          <input type="hidden" name="ids" value={selectedIds.join(",")} />
          <button
            type="button"
            onClick={handleDeleteClick}
            disabled={selectedIds.length === 0}
            className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
          >
            删除
          </button>
        </form>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full min-w-[56rem] table-fixed border-collapse text-left text-sm">
          <colgroup>
            <col className="w-11" />
            <col className="w-[7.25rem]" />
            <col className="w-[19%]" />
            <col className="w-16" />
            <col className="w-[4.5rem]" />
            <col className="w-[7rem]" />
            <col className="w-[26%]" />
            <col className="w-[6.25rem]" />
            <col className="w-14" />
            <col className="w-[7rem]" />
          </colgroup>
          <thead className="bg-slate-50 text-xs font-semibold text-slate-600">
            <tr>
              <th className="border-b border-slate-200 px-2 py-2.5">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(event) => toggleSelectAll(event.target.checked)}
                  aria-label="全选产品"
                />
              </th>
              <th className="border-b border-slate-200 px-2 py-2.5 whitespace-nowrap">型号</th>
              <th className="border-b border-slate-200 px-2 py-2.5 whitespace-nowrap">分类</th>
              <th className="border-b border-slate-200 px-2 py-2.5 whitespace-nowrap">排序</th>
              <th className="border-b border-slate-200 px-2 py-2.5 whitespace-nowrap">图片</th>
              <th className="border-b border-slate-200 px-2 py-2.5 whitespace-nowrap">尺寸</th>
              <th className="border-b border-slate-200 px-2 py-2.5 whitespace-nowrap">包装规格</th>
              <th className="border-b border-slate-200 px-2 py-2.5 whitespace-nowrap">库存状态</th>
              <th className="border-b border-slate-200 px-2 py-2.5 whitespace-nowrap">库存数</th>
              <th className="border-b border-slate-200 px-2 py-2.5 whitespace-nowrap">操作</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((product) => {
              const checked = selectedIds.includes(product.id);
              const categoryLabel =
                categoryLabelMap.get(product.category || "") || product.category || "-";
              return (
                <tr key={product.id} className="align-middle text-slate-800">
                  <td className="border-b border-slate-100 px-2 py-2.5">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) => toggleRow(product.id, event.target.checked)}
                      aria-label={`选择产品 ${product.model || product.id}`}
                    />
                  </td>
                  <td className="border-b border-slate-100 px-2 py-2.5 font-medium">
                    <span className="block truncate" title={product.model || undefined}>
                      {product.model || "-"}
                    </span>
                  </td>
                  <td className="border-b border-slate-100 px-2 py-2.5 min-w-0">
                    <span className="block truncate text-xs leading-snug" title={categoryLabel}>
                      {categoryLabel}
                    </span>
                  </td>
                  <td className="border-b border-slate-100 px-1 py-2.5">
                    <form
                      action={async (formData) => {
                        await updateSortOrderAction(formData);
                        router.refresh();
                      }}
                    >
                      <input type="hidden" name="id" value={product.id} />
                      <input
                        name="sort_order"
                        type="number"
                        min="0"
                        defaultValue={product.sort_order ?? 100}
                        onKeyDown={handleSortOrderKeyDown}
                        onBlur={handleSortOrderBlur}
                        onFocus={(event) => event.currentTarget.select()}
                        title="点击可编辑，按回车保存"
                        className="w-full min-w-0 rounded-md border border-transparent bg-transparent px-1 py-1 text-center text-sm tabular-nums text-slate-800 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-300"
                      />
                    </form>
                  </td>
                  <td className="border-b border-slate-100 px-2 py-2.5">
                    {product.image_url ? (
                      <button
                        type="button"
                        onClick={() =>
                          setImagePreview({
                            src: product.image_url as string,
                            alt: `${product.model || "product"} 大图`,
                          })
                        }
                        className="group mx-auto flex rounded-md border border-slate-200 bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                        aria-label={`放大查看 ${product.model || "产品"} 图片`}
                      >
                        <Image
                          src={product.image_url}
                          alt=""
                          width={56}
                          height={56}
                          className="h-14 w-14 rounded-sm object-cover transition group-hover:opacity-90"
                          aria-hidden
                        />
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">未上传</span>
                    )}
                  </td>
                  <td className="border-b border-slate-100 px-2 py-2.5 whitespace-nowrap text-xs tabular-nums">
                    {product.size || "-"}
                  </td>
                  <td className="border-b border-slate-100 px-2 py-2.5 min-w-0">
                    <span
                      className="block truncate text-xs leading-snug tabular-nums"
                      title={product.packing_spec || undefined}
                    >
                      {product.packing_spec || "-"}
                    </span>
                  </td>
                  <td className="border-b border-slate-100 px-2 py-2.5 whitespace-nowrap text-xs">
                    {product.stock_status || "-"}
                  </td>
                  <td className="border-b border-slate-100 px-2 py-2.5 text-center text-xs tabular-nums whitespace-nowrap">
                    {product.stock_quantity ?? "-"}
                  </td>
                  <td className="border-b border-slate-100 px-2 py-2.5">
                    <div className="flex flex-col gap-1.5">
                      {product.image_url ? (
                        <form action={clearImageAction}>
                          <input type="hidden" name="id" value={product.id} />
                          <button
                            type="submit"
                            className="w-full shrink-0 rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-medium leading-tight text-amber-800 transition hover:bg-amber-100"
                          >
                            移除图片
                          </button>
                        </form>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => setEditingProduct(product)}
                        className="w-full shrink-0 rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] font-medium leading-tight text-slate-700 transition hover:bg-slate-50"
                      >
                        编辑
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {editingProduct ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">编辑产品</h3>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
              >
                ×
              </button>
            </div>
            <form
              action={updateAction}
              className="grid gap-3 md:grid-cols-2"
              onSubmit={() => setEditingProduct(null)}
            >
              <input type="hidden" name="id" value={editingProduct.id} />
              <div>
                <p className="mb-1 text-xs font-medium text-slate-600">型号</p>
                <input
                  name="model"
                  required
                  defaultValue={editingProduct.model || ""}
                  placeholder="型号"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
                />
              </div>
              <div>
                <p className="mb-1 text-xs font-medium text-slate-600">分类</p>
                <select
                  name="category"
                  defaultValue={editingProduct.category || "ps_moldings"}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
                >
                  {categoryOptions.map(([slug, name]) => (
                    <option key={slug} value={slug}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2 md:grid-cols-2 md:col-span-2">
                <div>
                  <p className="mb-1 text-xs font-medium text-slate-600">宽度 (mm)</p>
                  <input
                    name="size_width"
                    required
                    type="number"
                    min="0.1"
                    step="0.1"
                    defaultValue={parseSize(editingProduct.size).width}
                    placeholder="宽度(mm)"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
                  />
                </div>
                <div>
                  <p className="mb-1 text-xs font-medium text-slate-600">高度 (mm)</p>
                  <input
                    name="size_height"
                    required
                    type="number"
                    min="0.1"
                    step="0.1"
                    defaultValue={parseSize(editingProduct.size).height}
                    placeholder="高度(mm)"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
                  />
                </div>
              </div>
              <div>
                <p className="mb-1 text-xs font-medium text-slate-600">包装长度 (m，可选)</p>
                <input
                  name="packing_length"
                  type="number"
                  min="0.1"
                  step="0.01"
                  defaultValue={parsePacking(editingProduct.packing_spec).length}
                  placeholder="与 pcs 同时填写则生成包装说明"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
                />
              </div>
              <div>
                <p className="mb-1 text-xs font-medium text-slate-600">每箱 pcs（可选）</p>
                <input
                  name="packing_pcs"
                  type="number"
                  min="1"
                  step="1"
                  defaultValue={parsePacking(editingProduct.packing_spec).pcs}
                  placeholder="与长度同时填写则生成包装说明"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
                />
              </div>
              <div>
                <p className="mb-1 text-xs font-medium text-slate-600">库存状态</p>
                <select
                  name="stock_status"
                  defaultValue={editingProduct.stock_status || "In Stock"}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
              <div>
                <p className="mb-1 text-xs font-medium text-slate-600">排序序号</p>
                <input
                  name="sort_order"
                  type="number"
                  min="0"
                  defaultValue={editingProduct.sort_order ?? 100}
                  placeholder="数字越大越靠后"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
                />
              </div>
              <div>
                <p className="mb-1 text-xs font-medium text-slate-600">库存数量（可选）</p>
                <input
                  name="stock_quantity"
                  type="number"
                  min="0"
                  defaultValue={editingProduct.stock_quantity ?? ""}
                  placeholder="库存数量（可选）"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
                />
              </div>
              <div>
                <p className="mb-1 text-xs font-medium text-slate-600">上传新图片（可选）</p>
                <input
                  type="file"
                  name="image_file"
                  accept="image/*"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
                />
              </div>
              <div>
                <p className="mb-1 text-xs font-medium text-slate-600">复用已有图片（可选）</p>
                <select
                  name="existing_image_url"
                  defaultValue=""
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
                >
                  <option value="">复用已有图片（可选）</option>
                  {existingImageOptions.map(([url, label]) => (
                    <option key={url} value={url}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 md:col-span-2">
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                >
                  保存
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {imagePreview && typeof document !== "undefined"
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label="图片预览"
              className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
              onClick={() => setImagePreview(null)}
            >
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-xl leading-none text-slate-800 shadow-md hover:bg-white"
                aria-label="关闭预览"
              >
                ×
              </button>
              <div
                className="relative max-h-[90vh] max-w-[min(92vw,1200px)] cursor-default"
                onClick={(event) => event.stopPropagation()}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- lightbox; arbitrary admin URLs */}
                <img
                  src={imagePreview.src}
                  alt={imagePreview.alt}
                  className="max-h-[85vh] w-auto max-w-full rounded-lg object-contain shadow-2xl ring-1 ring-white/10"
                />
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
