import { mkdir, readdir, readFile, stat, writeFile } from "fs/promises";
import path from "path";
import { deleteOrphanUploads } from "@/lib/media-cleanup";
import { projectRoot, uploadDirs } from "@/lib/uploads";

function imageDirs() {
  return [path.join(projectRoot(), "public", "images"), ...uploadDirs()];
}

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 72;
const WEBP_QUALITY = 75;
const PNG_QUALITY = 55;
const MIN_SAVE_RATIO = 0.98;

function statePath() {
  return path.join(projectRoot(), "data", "image-optimise-done.json");
}

export type OptimizableImage = {
  absolutePath: string;
  publicPath: string;
  bytes: number;
  mtimeMs: number;
};

export type OptimizeImagesResult = {
  scanned: number;
  optimized: number;
  skipped: number;
  failed: number;
  bytesBefore: number;
  bytesAfter: number;
  orphansDeleted: number;
  errors: string[];
};

type DoneMap = Record<string, { bytes: number; mtimeMs: number }>;

function toPublicPath(absolutePath: string) {
  const root = projectRoot();
  for (const dir of uploadDirs()) {
    if (absolutePath === dir || absolutePath.startsWith(`${dir}${path.sep}`)) {
      return `/uploads/${path.basename(absolutePath)}`;
    }
  }
  const relative = path.relative(path.join(root, "public"), absolutePath);
  return `/${relative.split(path.sep).join("/")}`;
}

function isUploadPath(absolutePath: string) {
  return uploadDirs().some((dir) => absolutePath === dir || absolutePath.startsWith(`${dir}${path.sep}`));
}

async function listImageFiles(dir: string): Promise<string[]> {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    const files: string[] = [];
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...(await listImageFiles(full)));
        continue;
      }
      if (!entry.isFile()) continue;
      const ext = path.extname(entry.name).toLowerCase();
      if (IMAGE_EXTENSIONS.has(ext)) files.push(full);
    }
    return files;
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
    if (code === "ENOENT") return [];
    throw error;
  }
}

async function readDoneMap(): Promise<DoneMap> {
  try {
    const raw = await readFile(statePath(), "utf8");
    const parsed = JSON.parse(raw) as DoneMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

async function writeDoneMap(map: DoneMap) {
  await mkdir(path.dirname(statePath()), { recursive: true });
  await writeFile(statePath(), `${JSON.stringify(map, null, 2)}\n`, "utf8");
}

function isMarkedDone(item: OptimizableImage, done: DoneMap) {
  const entry = done[item.publicPath];
  if (!entry) return false;
  return entry.bytes === item.bytes && entry.mtimeMs === item.mtimeMs;
}

export async function listOptimizableImages(): Promise<OptimizableImage[]> {
  const files = (await Promise.all(imageDirs().map(listImageFiles))).flat();
  const items: OptimizableImage[] = [];
  const seen = new Set<string>();

  for (const absolutePath of files) {
    const publicPath = toPublicPath(absolutePath);
    if (seen.has(publicPath)) continue;
    seen.add(publicPath);
    const info = await stat(absolutePath);
    items.push({
      absolutePath,
      publicPath,
      bytes: info.size,
      mtimeMs: Math.floor(info.mtimeMs),
    });
  }

  return items.sort((a, b) => b.bytes - a.bytes || a.publicPath.localeCompare(b.publicPath));
}

/** Images that still need an optimise pass (not yet marked done for current file contents). */
export async function listPendingImages(): Promise<OptimizableImage[]> {
  const [all, done] = await Promise.all([listOptimizableImages(), readDoneMap()]);
  return all.filter((item) => !isMarkedDone(item, done));
}

export async function optimizeImageBuffer(buffer: Buffer, filename: string): Promise<Buffer> {
  const ext = path.extname(filename).toLowerCase();
  if (!IMAGE_EXTENSIONS.has(ext)) return buffer;

  const sharp = (await import("sharp")).default;

  const pipeline = sharp(buffer, { failOn: "none" }).rotate().resize(MAX_DIMENSION, MAX_DIMENSION, {
    fit: "inside",
    withoutEnlargement: true,
  });

  let optimized: Buffer;
  if (ext === ".png") {
    optimized = await pipeline
      .png({ compressionLevel: 9, quality: PNG_QUALITY, effort: 10 })
      .toBuffer();
  } else if (ext === ".webp") {
    optimized = await pipeline.webp({ quality: WEBP_QUALITY }).toBuffer();
  } else {
    optimized = await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
  }

  if (optimized.length >= buffer.length * MIN_SAVE_RATIO) return buffer;
  return optimized;
}

async function writeOptimizedCopies(absolutePath: string, buffer: Buffer) {
  await writeFile(absolutePath, buffer);
  if (!isUploadPath(absolutePath)) return;

  const filename = path.basename(absolutePath);
  for (const dir of uploadDirs()) {
    const copy = path.join(dir, filename);
    if (copy === absolutePath) continue;
    await mkdir(dir, { recursive: true });
    await writeFile(copy, buffer);
  }
}

async function optimizeFile(absolutePath: string): Promise<{
  changed: boolean;
  before: number;
  after: number;
}> {
  const beforeBuffer = await readFile(absolutePath);
  const before = beforeBuffer.length;
  const afterBuffer = await optimizeImageBuffer(beforeBuffer, absolutePath);
  const after = afterBuffer.length;

  if (after >= before * MIN_SAVE_RATIO) {
    return { changed: false, before, after: before };
  }

  await writeOptimizedCopies(absolutePath, afterBuffer);
  return { changed: true, before, after };
}

/** Optimise only pending images, then drop unused `/uploads` files. */
export async function optimizePendingImages(): Promise<OptimizeImagesResult> {
  const result: OptimizeImagesResult = {
    scanned: 0,
    optimized: 0,
    skipped: 0,
    failed: 0,
    bytesBefore: 0,
    bytesAfter: 0,
    orphansDeleted: 0,
    errors: [],
  };

  try {
    const orphans = await deleteOrphanUploads();
    result.orphansDeleted = orphans.deleted;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unused-file cleanup failed";
    if (result.errors.length < 5) result.errors.push(message);
  }

  const pending = await listPendingImages();
  const done = await readDoneMap();
  result.scanned = pending.length;

  for (const image of pending) {
    result.bytesBefore += image.bytes;
    try {
      const outcome = await optimizeFile(image.absolutePath);
      result.bytesAfter += outcome.after;
      if (outcome.changed) result.optimized += 1;
      else result.skipped += 1;

      const info = await stat(image.absolutePath);
      done[image.publicPath] = {
        bytes: info.size,
        mtimeMs: Math.floor(info.mtimeMs),
      };
    } catch (error) {
      result.failed += 1;
      result.bytesAfter += image.bytes;
      const message = error instanceof Error ? error.message : "Unknown error";
      if (result.errors.length < 5) {
        result.errors.push(`${image.publicPath}: ${message}`);
      }
    }
  }

  // Drop done-map keys for files that no longer exist on disk.
  const remaining = new Set((await listOptimizableImages()).map((item) => item.publicPath));
  for (const key of Object.keys(done)) {
    if (key.startsWith("/uploads/") && !remaining.has(key)) delete done[key];
  }

  await writeDoneMap(done);
  return result;
}
