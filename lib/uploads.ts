import { mkdir, writeFile } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 8 * 1024 * 1024;

function safeFilename(name: string) {
  const base = name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/-+/g, "-");
  return base.replace(/^-|-$/g, "").slice(0, 80) || "image";
}

export async function saveUploadedImage(file: File) {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Please upload a JPG, PNG, WEBP or GIF image.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Image must be smaller than 8MB.");
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `${Date.now()}-${safeFilename(file.name)}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);
  return `/uploads/${filename}`;
}
