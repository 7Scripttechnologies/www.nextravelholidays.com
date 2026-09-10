import type { RowDataPacket } from "mysql2/promise";
import { getPool } from "@/lib/db";
import { ensureSchema } from "@/lib/packages-db";
import {
  deleteUploadedFile,
  listUploadedFiles,
  uploadFilenameFromSrc,
} from "@/lib/uploads";

/** Skip brand-new uploads still sitting in an unsaved admin form. */
const ORPHAN_MIN_AGE_MS = 30 * 60 * 1000;

const REFERENCED_IMAGE_QUERIES = [
  "SELECT image AS src FROM packages",
  "SELECT image_url AS src FROM package_gallery",
  "SELECT image AS src FROM package_highlights",
  "SELECT image_url AS src FROM gallery_items",
  "SELECT avatar_url AS src FROM reviews",
  "SELECT image_url AS src FROM site_images",
];

export function pathsFromPackage(pkg: {
  image?: string;
  gallery?: string[];
  highlights?: { image?: string }[];
}): string[] {
  return [
    pkg.image,
    ...(pkg.gallery ?? []),
    ...(pkg.highlights ?? []).map((item) => item.image),
  ].filter((src): src is string => Boolean(src));
}

export async function listReferencedUploadFilenames(): Promise<Set<string>> {
  await ensureSchema();
  const pool = getPool();
  const names = new Set<string>();

  for (const sql of REFERENCED_IMAGE_QUERIES) {
    const [rows] = await pool.query<RowDataPacket[]>(sql);
    for (const row of rows) {
      const filename = uploadFilenameFromSrc(String(row.src ?? ""));
      if (filename) names.add(filename);
    }
  }

  return names;
}

/** After a save/delete, drop `/uploads` files that nothing in the database still points to. */
export async function deleteUploadsIfUnreferenced(
  srcs: Array<string | null | undefined>,
): Promise<number> {
  const candidates = new Set<string>();
  for (const src of srcs) {
    if (!src) continue;
    const filename = uploadFilenameFromSrc(src);
    if (filename) candidates.add(filename);
  }
  if (candidates.size === 0) return 0;

  const referenced = await listReferencedUploadFilenames();
  let deleted = 0;
  for (const filename of candidates) {
    if (referenced.has(filename)) continue;
    if (await deleteUploadedFile(`/uploads/${filename}`)) deleted += 1;
  }
  return deleted;
}

export async function deleteOrphanUploads(minAgeMs = ORPHAN_MIN_AGE_MS): Promise<{
  deleted: number;
  skippedRecent: number;
}> {
  const [files, referenced] = await Promise.all([
    listUploadedFiles(),
    listReferencedUploadFilenames(),
  ]);
  const cutoff = Date.now() - minAgeMs;
  let deleted = 0;
  let skippedRecent = 0;

  for (const file of files) {
    if (referenced.has(file.filename)) continue;
    if (file.mtimeMs > cutoff) {
      skippedRecent += 1;
      continue;
    }
    if (await deleteUploadedFile(`/uploads/${file.filename}`)) deleted += 1;
  }

  return { deleted, skippedRecent };
}

export async function countOrphanUploads(minAgeMs = ORPHAN_MIN_AGE_MS): Promise<number> {
  const [files, referenced] = await Promise.all([
    listUploadedFiles(),
    listReferencedUploadFilenames(),
  ]);
  const cutoff = Date.now() - minAgeMs;
  return files.filter((file) => !referenced.has(file.filename) && file.mtimeMs <= cutoff).length;
}
