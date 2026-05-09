import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";

/** UTF-8 BOM so Excel opens Chinese column names correctly */
const BOM = "\uFEFF";

const TEMPLATE_HEADERS =
  "型号,分类,宽度_mm,高度_mm,包装长度_m,每箱pcs,排序,库存状态,库存数量,图片适应,图片URL";
const TEMPLATE_SAMPLE_ROW =
  "HKD-801,ps_moldings,100,50,2.4,48,100,In Stock,1000,cover,";

export async function GET() {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = `${BOM}${TEMPLATE_HEADERS}\n${TEMPLATE_SAMPLE_ROW}\n`;
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="hikuada-products-bulk-template.csv"',
      "Cache-Control": "no-store",
    },
  });
}
