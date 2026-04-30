"use client";

import { useMemo, useState } from "react";

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

export function AdminLeadsTable({ leads }: { leads: AdminLead[] }) {
  const [selectedLead, setSelectedLead] = useState<AdminLead | null>(null);
  const formattedTime = useMemo(() => {
    if (!selectedLead?.created_at) return "-";
    return new Date(selectedLead.created_at).toLocaleString();
  }, [selectedLead]);

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
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
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
              <p><span className="font-semibold">创建时间：</span>{formattedTime}</p>
              <p><span className="font-semibold">姓名：</span>{selectedLead.customer_name || "-"}</p>
              <p><span className="font-semibold">联系方式：</span>{selectedLead.whatsapp_zalo || "-"}</p>
              <p><span className="font-semibold">联系渠道：</span>{selectedLead.contact_type || "-"}</p>
              <p><span className="font-semibold">邮箱：</span>{selectedLead.email || "-"}</p>
              <p><span className="font-semibold">国家：</span>{selectedLead.country || "-"}</p>
              <p><span className="font-semibold">型号：</span>{selectedLead.product_model || "-"}</p>
            </div>
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              <p className="mb-1 font-semibold text-slate-900">询盘内容</p>
              <p className="whitespace-pre-wrap">{selectedLead.message || "-"}</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
