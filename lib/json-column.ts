/** MySQL returns JSON columns as objects; MariaDB (common on cPanel) returns them as strings. */
export function parseJsonColumn(value: unknown): unknown {
  if (value == null) return null;
  if (Buffer.isBuffer(value)) value = value.toString("utf8");
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }
  return value;
}

export function dbErrorCode(error: unknown) {
  return error && typeof error === "object" && "code" in error ? String(error.code) : "";
}

/** Short one-line description for logs, e.g. "connect ETIMEDOUT (ETIMEDOUT)". */
export function dbErrorSummary(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  const code = dbErrorCode(error);
  return code && !message.includes(code) ? `${message} (${code})` : message;
}
