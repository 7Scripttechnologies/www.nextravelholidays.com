import type { RowDataPacket } from "mysql2/promise";
import { getPool } from "@/lib/db";
import { ensureSchema } from "@/lib/packages-db";

const EMAIL_KEY = "admin_email";
const PASSWORD_KEY = "admin_password";

function envEmail() {
  return (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
}

function envPassword() {
  return process.env.ADMIN_PASSWORD ?? "";
}

async function getMeta(key: string): Promise<string | null> {
  try {
    await ensureSchema();
    const pool = getPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT meta_value FROM app_meta WHERE meta_key = ? LIMIT 1",
      [key],
    );
    const value = rows[0]?.meta_value;
    return typeof value === "string" && value.length > 0 ? value : null;
  } catch {
    return null;
  }
}

async function setMeta(key: string, value: string) {
  await ensureSchema();
  const pool = getPool();
  await pool.query(
    `INSERT INTO app_meta (meta_key, meta_value) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE meta_value = VALUES(meta_value)`,
    [key, value],
  );
}

/** Prefer DB credentials (editable in admin); fall back to .env */
export async function getAdminCredentials(): Promise<{ email: string; password: string } | null> {
  const dbEmail = (await getMeta(EMAIL_KEY))?.trim().toLowerCase() ?? "";
  const dbPassword = (await getMeta(PASSWORD_KEY)) ?? "";

  if (dbEmail && dbPassword) {
    return { email: dbEmail, password: dbPassword };
  }

  const email = envEmail();
  const password = envPassword();
  if (!email || !password) return null;
  return { email, password };
}

export async function updateAdminCredentials(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !password) {
    throw new Error("Email and password are required.");
  }
  if (!normalizedEmail.includes("@")) {
    throw new Error("Enter a valid email address.");
  }
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  await setMeta(EMAIL_KEY, normalizedEmail);
  await setMeta(PASSWORD_KEY, password);
}
