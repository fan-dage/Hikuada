"use client";

import { createPortal } from "react-dom";
import { useEffect, useMemo, useState } from "react";
import { extractModelFromInquiryPrefillLine } from "@/lib/inquiry-list";

export type AdminLead = {
  id?: string | number;
  customer_name?: string;
  whatsapp_zalo?: string;
  contact_type?: string;
  email?: string;
  country?: string;
  product_model?: string;
  message?: string;
  created_at?: string;
};

function resolveProductImageUrl(model: string, map: Record<string, string>): string | undefined {
  if (map[model]) return map[model];
  const normalized = model.replace(/\s+/g, " ").trim();
  if (map[normalized]) return map[normalized];
  const lower = model.toLowerCase();
  for (const [key, url] of Object.entries(map)) {
    if (key.toLowerCase() === lower) return url;
  }
  return undefined;
}

function InquiryMessageLines({
  message,
  modelToImageUrl,
  onOpenImage,
}: {
  message: string;
  modelToImageUrl: Record<string, string>;
  onOpenImage: (src: string, label: string) => void;
}) {
  const lines = message.split(/\r?\n/);
  return (
    <div className="space-y-1 text-sm leading-relaxed">
      {lines.map((line, index) => {
        const model = extractModelFromInquiryPrefillLine(line);
        const imageUrl = model ? resolveProductImageUrl(model, modelToImageUrl) : undefined;
        if (model && imageUrl) {
          return (
            <button
              key={`${index}-${model}`}
              type="button"
              onClick={() => onOpenImage(imageUrl, model)}
              className="w-full rounded-md px-1 py-1 text-left text-slate-800 underline decoration-slate-400 decoration-dotted underline-offset-2 transition hover:bg-slate-100 hover:decoration-slate-700"
              title={`查看「${model}」产品图`}
            >
              {line || "\u00A0"}
            </button>
          );
        }
        return (
          <p key={index} className="whitespace-pre-wrap break-words text-slate-700">
            {line || "\u00A0"}
          </p>
        );
      })}
    </div>
  );
}

export function AdminLeadsTable({
  leads,
  modelToImageUrl,
}: {
  leads: AdminLead[];
  modelToImageUrl: Record<string, string>;
}) {
  const [selectedLead, setSelectedLead] = useState<AdminLead | null>(null);
  const [imagePreview, setImagePreview] = useState<{ src: string; alt: string } | null>(null);

  const formattedTime = useMemo(() => {
    if (!selectedLead?.created_at) return "-";
    return new Date(selectedLead.created_at).toLocaleString();
  }, [selectedLead]);

  useEffect(() => {
    if (!selectedLead) setImagePreview(null);
  }, [selectedLead]);

  useEffect(() => {
    if (!imagePreview) return;
    function onKey(event: WindowEventMap["keydown"]) {
      if (event.key === "Escape") setImagePreview(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [imagePreview]);

  useEffect(() => {
    if (!imagePreview) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [imagePreview]);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="border-b border-slate-200 px-4 py-3 font-medium">创建时间</th>
              <th className="border-b border-slate-200 px-4 py-3 font-medium">姓名</th>
              <th className="border-b border-slate-200 px-4 py-3 font-medium">联系方式</th>
              <th className="border-b border-slate-200 px-4 py-3 font-medium">联系渠道</th>
              <th className="border-b border-slate-200 px-4 py-3 font-medium">国家</th>
              <th className="border-b border-slate-200 px-4 py-3 font-medium">型号</th>
              <th className="border-b border-slate-200 px-4 py-3 font-medium">询盘内容</th>
              <th className="border-b border-slate-200 px-4 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, index) => (
              <tr key={lead.id ?? `${lead.whatsapp_zalo}-${index}`} className="align-top text-slate-800">
                <td className="border-b border-slate-100 px-4 py-4">
                  {lead.created_at ? new Date(lead.created_at).toLocaleString() : "-"}
                </td>
                <td className="border-b border-slate-100 px-4 py-4">{lead.customer_name || "-"}</td>
                <td className="border-b border-slate-100 px-4 py-4">{lead.whatsapp_zalo || "-"}</td>
                <td className="border-b border-slate-100 px-4 py-4">{lead.contact_type || "-"}</td>
                <td className="border-b border-slate-100 px-4 py-4">{lead.country || "-"}</td>
                <td className="border-b border-slate-100 px-4 py-4">{lead.product_model || "-"}</td>
                <td className="max-w-md whitespace-pre-wrap border-b border-slate-100 px-4 py-4">{lead.message || "-"}</td>
                <td className="border-b border-slate-100 px-4 py-4">
                  <button
                    type="button"
                    onClick={() => setSelectedLead(lead)}
                    className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    详情
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedLead ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">询盘详情</h3>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
              >
                关闭
              </button>
            </div>
            <div className="grid gap-3 text-sm text-slate-700 md:grid-cols-2">
              <p>
                <span className="font-semibold">创建时间：</span>
                {formattedTime}
              </p>
              <p>
                <span className="font-semibold">姓名：</span>
                {selectedLead.customer_name || "-"}
              </p>
              <p>
                <span className="font-semibold">联系方式：</span>
                {selectedLead.whatsapp_zalo || "-"}
              </p>
              <p>
                <span className="font-semibold">联系渠道：</span>
                {selectedLead.contact_type || "-"}
              </p>
              <p>
                <span className="font-semibold">邮箱：</span>
                {selectedLead.email || "-"}
              </p>
              <p>
                <span className="font-semibold">国家：</span>
                {selectedLead.country || "-"}
              </p>
              <p className="md:col-span-2">
                <span className="font-semibold">型号：</span>
                {selectedLead.product_model || "-"}
              </p>
            </div>
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              <p className="mb-2 font-semibold text-slate-900">询盘内容</p>
              <p className="mb-2 text-xs text-slate-500">
                出自询价清单的行可点击查看对应产品图（与型号匹配）。
              </p>
              {selectedLead.message ? (
                <InquiryMessageLines
                  message={selectedLead.message}
                  modelToImageUrl={modelToImageUrl}
                  onOpenImage={(src, label) => setImagePreview({ src, alt: `型号 ${label}` })}
                />
              ) : (
                <p>-</p>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {imagePreview && typeof document !== "undefined"
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label="产品图片预览"
              className="fixed inset-0 z-[120] flex cursor-zoom-out items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
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
