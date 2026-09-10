import { existsSync } from "fs";
import { mkdir, readdir, stat, unlink, writeFile } from "fs/promises";
import path from "path";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 8 * 1024 * 1024;
const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export function projectRoot() {
  if (process.env.NEXTRAVEL_ROOT) return process.env.NEXTRAVEL_ROOT;

  let dir = process.cwd();
  for (let i = 0; i < 8; i++) {
    if (existsSync(path.join(dir, "package.json")) && existsSync(path.join(dir, "next.config.ts"))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  return process.cwd();
}

export function uploadDirs() {
  const root = projectRoot();
  return [path.join(root, "data", "uploads"), path.join(root, "public", "uploads")];
}

export function safeUploadName(name: string) {
  const ext = path.extname(name).toLowerCase().replace(/[^a-z0-9.]/g, "") || ".jpg";
  const base = path
    .basename(name, path.extname(name))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${base || "image"}${ext}`;
}

export function resolveUploadedFile(filename: string) {
  const safe = path.basename(filename);
  if (!safe || safe.includes("..")) return null;

  for (const dir of uploadDirs()) {
    const full = path.join(dir, safe);
    if (existsSync(full)) return full;
  }

  return null;
}

export function uploadMime(filename: string) {
  return MIME[path.extname(filename).toLowerCase()] || "application/octet-stream";
}

export async function saveUploadedImage(file: File) {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Please upload a JPG, PNG, WEBP or GIF image.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Image must be smaller than 8MB.");
  }

  const filename = `${Date.now()}-${safeUploadName(file.name)}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  for (const dir of uploadDirs()) {
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), buffer);
  }

  return `/uploads/${filename}`;
}

/** Only CMS files under `/uploads/…`. Built-in `/images/` assets are never managed. */
export function uploadFilenameFromSrc(src: string): string | null {
  const raw = src.trim();
  if (!raw || raw.startsWith("data:")) return null;

  let pathname = raw;
  try {
    if (/^https?:\/\//i.test(raw)) pathname = new URL(raw).pathname;
  } catch {
    return null;
  }

  const match = pathname.match(/\/uploads\/([^/?#]+)$/i);
  if (!match) return null;

  let filename = match[1];
  try {
    filename = decodeURIComponent(filename);
  } catch {
    return null;
  }

  const safe = path.basename(filename);
  if (!safe || safe.includes("..") || safe.startsWith(".")) return null;
  return safe;
}

export async function deleteUploadedFile(src: string): Promise<boolean> {
  const filename = uploadFilenameFromSrc(src);
  if (!filename) return false;

  let deleted = false;
  for (const dir of uploadDirs()) {
    try {
      await unlink(path.join(dir, filename));
      deleted = true;
    } catch (error) {
      const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
      if (code !== "ENOENT") throw error;
    }
  }

  return deleted;
}

export async function listUploadedFiles(): Promise<
  { filename: string; mtimeMs: number; bytes: number }[]
> {
  const byName = new Map<string, { filename: string; mtimeMs: number; bytes: number }>();

  for (const dir of uploadDirs()) {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch (error) {
      const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
      if (code === "ENOENT") continue;
      throw error;
    }

    for (const entry of entries) {
      if (!entry.isFile() || entry.name.startsWith(".")) continue;
      const info = await stat(path.join(dir, entry.name));
      const existing = byName.get(entry.name);
      if (!existing || info.mtimeMs > existing.mtimeMs) {
        byName.set(entry.name, {
          filename: entry.name,
          mtimeMs: info.mtimeMs,
          bytes: info.size,
        });
      }
    }
  }

  return [...byName.values()];
}
