export const ADMIN_COOKIE = "nextravel_admin";

function positiveInt(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.floor(parsed);
}

/** Session length and stay/logout grace, from `.env.local`. */
export function adminSessionTiming() {
  const minutes = positiveInt(process.env.ADMIN_SESSION_MINUTES, 10);
  const graceSeconds = positiveInt(process.env.ADMIN_SESSION_GRACE_SECONDS, 60);
  return {
    sessionMs: minutes * 60 * 1000,
    graceMs: graceSeconds * 1000,
  };
}
