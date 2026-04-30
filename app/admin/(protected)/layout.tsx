import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { adminCookieName, isAdminAuthenticated } from "@/lib/admin-auth";
import { AdminSidebar } from "@/components/admin-sidebar";

async function logout() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.set(adminCookieName, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  redirect("/admin/login");
}

export default async function AdminProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-2xl border border-slate-200 bg-white px-6 py-5">
          <h1 className="text-2xl font-bold text-slate-900">Hikuada后台管理系统</h1>
          <p className="mt-1 text-sm text-slate-600">努力搞钱！！！</p>
        </header>
      </div>

      <div className="mx-auto flex max-w-7xl gap-6">
        <AdminSidebar />

        <div className="min-w-0 flex-1">
          <div className="mb-4 flex justify-end gap-2">
            <Link
              href="/"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              站点首页
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Log out
              </button>
            </form>
          </div>
          {children}
        </div>
      </div>
    </main>
  );
}
