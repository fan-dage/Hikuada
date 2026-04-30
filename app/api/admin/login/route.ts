import { NextResponse } from "next/server";
import {
  adminCookieName,
  createAdminSessionToken,
  verifyAdminPassword,
  verifyAdminUsername,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { username?: string; password?: string };
    const username = body.username?.trim() || "";
    const password = body.password?.trim() || "";

    if (!username || !password || !verifyAdminUsername(username) || !verifyAdminPassword(password)) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(adminCookieName, createAdminSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
