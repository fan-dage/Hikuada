import { getSupabaseServerClient } from "@/lib/supabase";

type Lead = {
  id?: number;
  created_at?: string;
  customer_name?: string | null;
  whatsapp_zalo?: string | null;
  contact_type?: string | null;
  country?: string | null;
  product_model?: string | null;
  message?: string | null;
};

function getWeekStart(now: Date) {
  const date = new Date(now);
  const day = date.getDay();
  const diff = (day + 6) % 7;
  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

export default async function AdminHomePage() {
  const supabase = getSupabaseServerClient();
  const tableName = process.env.SUPABASE_INQUIRIES_TABLE || "hikuada_leads";
  const { data, error } = await supabase
    .from(tableName)
    .select("id, created_at, customer_name, whatsapp_zalo, contact_type, country, product_model, message")
    .order("created_at", { ascending: false })
    .limit(500);

  const leads = ((data || []) as Lead[]).filter((lead) => lead.created_at);
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const weekStart = getWeekStart(now);

  const totalLeads = leads.length;
  const todayLeads = leads.filter((lead) => new Date(lead.created_at as string) >= todayStart).length;
  const weekLeads = leads.filter((lead) => new Date(lead.created_at as string) >= weekStart).length;
  const countryMap = new Map<string, number>();
  const modelMap = new Map<string, number>();

  for (const lead of leads) {
    if (lead.country) {
      countryMap.set(lead.country, (countryMap.get(lead.country) || 0) + 1);
    }
    if (lead.product_model) {
      modelMap.set(lead.product_model, (modelMap.get(lead.product_model) || 0) + 1);
    }
  }

  const uniqueCountries = countryMap.size;
  const topCountry = [...countryMap.entries()].sort((a, b) => b[1] - a[1])[0];
  const topModel = [...modelMap.entries()].sort((a, b) => b[1] - a[1])[0];
  const recentLeads = leads.slice(0, 6);

  return (
    <div>
      <header className="mb-4">
        <h2 className="text-sm font-medium text-slate-900">后台首页</h2>
        <p className="mt-1 text-sm text-slate-600">询盘经营看板（数据源：{tableName}）</p>
      </header>

      {error ? (
        <section className="rounded-2xl border border-red-200 bg-white p-6 text-sm text-red-600">
          数据加载失败：{error.message}
        </section>
      ) : (
        <div className="space-y-4">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs text-slate-500">总询盘数</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{totalLeads}</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs text-slate-500">今日新增</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{todayLeads}</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs text-slate-500">本周新增</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{weekLeads}</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs text-slate-500">覆盖国家数</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{uniqueCountries}</p>
            </article>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs text-slate-500">热门国家</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {topCountry ? `${topCountry[0]} (${topCountry[1]})` : "-"}
              </p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs text-slate-500">热门型号</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {topModel ? `${topModel[0]} (${topModel[1]})` : "-"}
              </p>
            </article>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-5 py-4">
              <h3 className="text-sm font-medium text-slate-900">最近询盘</h3>
            </div>
            {recentLeads.length === 0 ? (
              <p className="p-5 text-sm text-slate-600">暂无询盘数据。</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-700">
                    <tr>
                      <th className="border-b border-slate-200 px-4 py-3 font-medium">时间</th>
                      <th className="border-b border-slate-200 px-4 py-3 font-medium">客户</th>
                      <th className="border-b border-slate-200 px-4 py-3 font-medium">联系方式</th>
                      <th className="border-b border-slate-200 px-4 py-3 font-medium">渠道</th>
                      <th className="border-b border-slate-200 px-4 py-3 font-medium">国家</th>
                      <th className="border-b border-slate-200 px-4 py-3 font-medium">型号</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLeads.map((lead, index) => (
                      <tr key={lead.id ?? index}>
                        <td className="border-b border-slate-100 px-4 py-3">
                          {lead.created_at ? new Date(lead.created_at).toLocaleString() : "-"}
                        </td>
                        <td className="border-b border-slate-100 px-4 py-3">{lead.customer_name || "-"}</td>
                        <td className="border-b border-slate-100 px-4 py-3">{lead.whatsapp_zalo || "-"}</td>
                        <td className="border-b border-slate-100 px-4 py-3">{lead.contact_type || "-"}</td>
                        <td className="border-b border-slate-100 px-4 py-3">{lead.country || "-"}</td>
                        <td className="border-b border-slate-100 px-4 py-3">{lead.product_model || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
