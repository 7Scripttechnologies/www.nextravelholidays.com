import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { listAdminLoginAccounts } from "@/lib/admin-credentials";
import { ADMIN_COOKIE, adminSessionTiming } from "@/lib/auth-constants";

export { ADMIN_COOKIE, adminSessionTiming };

function authSecret() {
  return process.env.AUTH_SECRET ?? "";
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

function parseAdminToken(token: string): { role?: string; exp?: number } | null {
  try {
    const secret = authSecret();
    if (!secret) return null;

    const raw = Buffer.from(token, "base64url").toString("utf8");
    const separator = raw.lastIndexOf(".");
    if (separator === -1) return null;

    const payload = raw.slice(0, separator);
    const signature = raw.slice(separator + 1);
    const expected = createHmac("sha256", secret).update(payload).digest("hex");
    if (!safeEqual(signature, expected)) return null;

    return JSON.parse(payload) as { role?: string; exp?: number };
  } catch {
    return null;
  }
}

function issueAdminToken() {
  const { sessionMs, graceMs } = adminSessionTiming();
  const exp = Date.now() + sessionMs + graceMs;
  const secret = authSecret();
  const payload = JSON.stringify({
    role: "admin",
    exp,
  });
  const signature = createHmac("sha256", secret).update(payload).digest("hex");
  return {
    token: Buffer.from(`${payload}.${signature}`).toString("base64url"),
    exp,
  };
}

export function verifyAdminToken(token: string) {
  const data = parseAdminToken(token);
  return data?.role === "admin" && typeof data.exp === "number" && data.exp > Date.now();
}

export async function applyAdminSessionCookie() {
  const { token, exp } = issueAdminToken();
  const { sessionMs, graceMs } = adminSessionTiming();
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: Math.ceil((sessionMs + graceMs) / 1000),
    secure: process.env.NODE_ENV === "production",
  });
  return exp;
}

export async function getAdminSessionExpiresAt() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  const data = parseAdminToken(token);
  return typeof data?.exp === "number" ? data.exp : null;
}

export async function validateAdminCredentials(email: string, password: string) {
  if (!authSecret()) {
    return {
      ok: false as const,
      error: "Admin login is not configured. Add AUTH_SECRET to .env.local.",
    };
  }

  const accounts = await listAdminLoginAccounts();
  if (accounts.length === 0) {
    return {
      ok: false as const,
      error:
        "Admin login is not configured. Add ADMIN_EMAIL, ADMIN_PASSWORD and AUTH_SECRET to .env.local.",
    };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const matched = accounts.some(
    (account) =>
      safeEqual(normalizedEmail, account.email) && safeEqual(password, account.password),
  );

  if (!matched) {
    return { ok: false as const, error: "Invalid email or password." };
  }

  return { ok: true as const };
}

export async function isAdmin() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}

export async function requireAdmin() {
  const ok = await isAdmin();
  if (!ok) redirect("/admin/login");
}
