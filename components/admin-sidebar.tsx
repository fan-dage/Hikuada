"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin/home", label: "后台首页", exact: true },
  { href: "/admin", label: "询盘管理", exact: true },
  { href: "/admin/products", label: "产品管理", exact: true },
  { href: "/admin/categories", label: "分类管理", exact: true },
  { href: "/admin/tags", label: "标签管理", exact: true },
  { href: "/admin/banner", label: "横幅管理", exact: true },
  { href: "/admin/customers", label: "客户管理", exact: true },
];

function isActive(pathname: string, href: string, exact: boolean) {
  if (exact) {
    return pathname === href;
  }
  return pathname.startsWith(href);
}

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 rounded-2xl border border-slate-200 bg-white p-4">
      <p className="px-3 py-2 text-sm font-semibold text-slate-500">导航栏</p>
      <nav className="mt-2 space-y-1">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                active
                  ? "block rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white"
                  : "block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              }
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
