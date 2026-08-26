import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE } from "@/lib/auth-constants";

export { ADMIN_COOKIE };

function authSecret() {
  return process.env.AUTH_SECRET ?? "";
}

function adminEmail() {
  return (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
}

function adminPassword() {
  return process.env.ADMIN_PASSWORD ?? "";
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function createAdminToken() {
  const secret = authSecret();
  const payload = JSON.stringify({
    role: "admin",
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });
  const signature = createHmac("sha256", secret).update(payload).digest("hex");
  return Buffer.from(`${payload}.${signature}`).toString("base64url");
}

export function verifyAdminToken(token: string) {
  try {
    const secret = authSecret();
    if (!secret) return false;

    const raw = Buffer.from(token, "base64url").toString("utf8");
    const separator = raw.lastIndexOf(".");
    if (separator === -1) return false;

    const payload = raw.slice(0, separator);
    const signature = raw.slice(separator + 1);
    const expected = createHmac("sha256", secret).update(payload).digest("hex");
    if (!safeEqual(signature, expected)) return false;

    const data = JSON.parse(payload) as { role?: string; exp?: number };
    return data.role === "admin" && typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

export function validateAdminCredentials(email: string, password: string) {
  const expectedEmail = adminEmail();
  const expectedPassword = adminPassword();
  if (!expectedEmail || !expectedPassword || !authSecret()) {
    return { ok: false as const, error: "Admin login is not configured. Add ADMIN_EMAIL, ADMIN_PASSWORD and AUTH_SECRET to .env.local." };
  }

  const emailOk = safeEqual(email.trim().toLowerCase(), expectedEmail);
  const passwordOk = safeEqual(password, expectedPassword);
  if (!emailOk || !passwordOk) {
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
