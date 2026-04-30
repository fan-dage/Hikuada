import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "hikuada_admin_session";

function getAdminUsername() {
  const value = process.env.ADMIN_USERNAME;
  if (!value) {
    throw new Error("Missing ADMIN_USERNAME");
  }
  return value;
}

function getAdminPassword() {
  const value = process.env.ADMIN_PASSWORD;
  if (!value) {
    throw new Error("Missing ADMIN_PASSWORD");
  }
  return value;
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || getAdminPassword();
}

function getExpectedSessionToken() {
  return createHmac("sha256", getSessionSecret()).update("hikuada-admin").digest("hex");
}

export function verifyAdminPassword(input: string) {
  const expected = Buffer.from(getAdminPassword());
  const actual = Buffer.from(input);
  if (expected.length !== actual.length) {
    return false;
  }
  return timingSafeEqual(expected, actual);
}

export function verifyAdminUsername(input: string) {
  const expected = Buffer.from(getAdminUsername());
  const actual = Buffer.from(input);
  if (expected.length !== actual.length) {
    return false;
  }
  return timingSafeEqual(expected, actual);
}

export function createAdminSessionToken() {
  return getExpectedSessionToken();
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return token === getExpectedSessionToken();
}

export const adminCookieName = ADMIN_COOKIE_NAME;
