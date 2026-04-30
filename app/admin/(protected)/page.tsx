import { getSupabaseServerClient } from "@/lib/supabase";
import { AdminLeadsTable } from "@/components/admin-leads-table";

type Lead = {
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

export default async function AdminPage() {
  const supabase = getSupabaseServerClient();
  const tableName = process.env.SUPABASE_INQUIRIES_TABLE || "hikuada_leads";
  const { data, error } = await supabase
    .from(tableName)
    .select("id, created_at, customer_name, whatsapp_zalo, contact_type, email, country, product_model, message")
    .order("created_at", { ascending: false })
    .limit(100);

  const leads = (data || []) as Lead[];

  return (
    <div>
      <header className="mb-4">
        <h2 className="text-sm font-medium text-slate-900">询盘管理</h2>
        <p className="mt-1 text-sm text-slate-600">最近 100 条询盘，数据源：{tableName}</p>
      </header>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {error ? (
          <p className="p-6 text-sm text-red-600">Failed to load leads: {error.message}</p>
        ) : leads.length === 0 ? (
          <p className="p-6 text-sm text-slate-600">No leads yet.</p>
        ) : (
          <AdminLeadsTable leads={leads} />
        )}
      </section>
    </div>
  );
}
