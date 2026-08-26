import type { Pool, PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import {
  featuredDestinations,
  type Destination,
  type DestinationCategory,
  type Highlight,
  type ItineraryDay,
} from "@/data/destinations";
import { getPool } from "@/lib/db";
import { schemaStatements } from "@/lib/schema";

export type PackageRecord = Destination & {
  id: number;
  featured: boolean;
  active: boolean;
  sortOrder: number;
};

export type PackageInput = {
  slug: string;
  name: string;
  image: string;
  rating: number;
  description: string;
  overview: string;
  location: string;
  price: string;
  duration: string;
  category: DestinationCategory;
  itineraryIntro: string;
  gallery: string[];
  highlights: Highlight[];
  itinerary: ItineraryDay[];
  included: string[];
  notIncluded: string[];
  featured: boolean;
  active: boolean;
  sortOrder: number;
};

interface PackageRow extends RowDataPacket {
  id: number;
  slug: string;
  name: string;
  image: string;
  rating: number | string;
  description: string;
  overview: string;
  location: string;
  price: string;
  duration: string;
  category: DestinationCategory;
  itinerary_intro: string | null;
  featured: number;
  active: number;
  sort_order: number;
}

interface GalleryRow extends RowDataPacket {
  package_id: number;
  image_url: string;
}

interface HighlightRow extends RowDataPacket {
  package_id: number;
  title: string;
  image: string;
}

interface ItineraryRow extends RowDataPacket {
  package_id: number;
  day_number: number;
  title: string;
  summary: string;
  activities: unknown;
}

interface ItemRow extends RowDataPacket {
  package_id: number;
  kind: "included" | "not_included";
  label: string;
}

type Queryable = Pool | PoolConnection;

let schemaReady = false;

function parseJson<T>(value: unknown, fallback: T): T {
  if (value == null) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

function toPackage(
  row: PackageRow,
  extras?: {
    gallery?: string[];
    highlights?: Highlight[];
    itinerary?: ItineraryDay[];
    included?: string[];
    notIncluded?: string[];
  },
): PackageRecord {
  const gallery = extras?.gallery?.length ? extras.gallery : [row.image];

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    image: row.image,
    gallery,
    rating: Number(row.rating),
    description: row.description,
    overview: row.overview,
    location: row.location,
    price: row.price,
    duration: row.duration,
    category: row.category,
    highlights: extras?.highlights ?? [],
    itineraryIntro:
      row.itinerary_intro ??
      "Take a look at this example travel flow to understand the pace and experiences included in this trip.",
    itinerary: extras?.itinerary ?? [],
    included: extras?.included ?? [],
    notIncluded: extras?.notIncluded ?? [],
    featured: Number(row.featured) === 1,
    active: row.active == null ? true : Number(row.active) === 1,
    sortOrder: row.sort_order,
  };
}

export async function ensureSchema() {
  if (schemaReady) return;

  const pool = getPool();
  for (const statement of schemaStatements) {
    await pool.query(statement);
  }

  // Existing databases created before `active` existed
  try {
    await pool.query(
      "ALTER TABLE packages ADD COLUMN active TINYINT(1) NOT NULL DEFAULT 1 AFTER featured",
    );
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
    if (code !== "ER_DUP_FIELDNAME") throw error;
  }

  schemaReady = true;
}

export function destinationToInput(destination: Destination): PackageInput {
  return {
    slug: destination.slug,
    name: destination.name,
    image: destination.image,
    rating: destination.rating,
    description: destination.description,
    overview: destination.overview,
    location: destination.location,
    price: destination.price,
    duration: destination.duration,
    category: destination.category,
    itineraryIntro: destination.itineraryIntro,
    gallery: destination.gallery,
    highlights: destination.highlights,
    itinerary: destination.itinerary,
    included: destination.included,
    notIncluded: destination.notIncluded,
    featured: destination.featured !== false,
    active: destination.active !== false,
    sortOrder: destination.sortOrder ?? 0,
  };
}

async function insertRelated(connection: Queryable, packageId: number, input: PackageInput) {
  for (const [index, image] of input.gallery.entries()) {
    await connection.query(
      "INSERT INTO package_gallery (package_id, image_url, sort_order) VALUES (?, ?, ?)",
      [packageId, image, index],
    );
  }

  for (const [index, highlight] of input.highlights.entries()) {
    await connection.query(
      "INSERT INTO package_highlights (package_id, title, image, sort_order) VALUES (?, ?, ?, ?)",
      [packageId, highlight.title, highlight.image, index],
    );
  }

  for (const [index, day] of input.itinerary.entries()) {
    await connection.query(
      "INSERT INTO package_itinerary (package_id, day_number, title, summary, activities, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
      [packageId, day.day, day.title, day.summary, JSON.stringify(day.activities), index],
    );
  }

  for (const [index, label] of input.included.entries()) {
    await connection.query(
      "INSERT INTO package_items (package_id, kind, label, sort_order) VALUES (?, 'included', ?, ?)",
      [packageId, label, index],
    );
  }

  for (const [index, label] of input.notIncluded.entries()) {
    await connection.query(
      "INSERT INTO package_items (package_id, kind, label, sort_order) VALUES (?, 'not_included', ?, ?)",
      [packageId, label, index],
    );
  }
}

async function replaceRelated(connection: Queryable, packageId: number, input: PackageInput) {
  await connection.query("DELETE FROM package_gallery WHERE package_id = ?", [packageId]);
  await connection.query("DELETE FROM package_highlights WHERE package_id = ?", [packageId]);
  await connection.query("DELETE FROM package_itinerary WHERE package_id = ?", [packageId]);
  await connection.query("DELETE FROM package_items WHERE package_id = ?", [packageId]);
  await insertRelated(connection, packageId, input);
}

export async function insertPackage(input: PackageInput, existingConnection?: PoolConnection) {
  await ensureSchema();
  const connection = existingConnection ?? (await getPool().getConnection());
  const ownsConnection = !existingConnection;

  try {
    if (ownsConnection) await connection.beginTransaction();

    const [result] = await connection.query<ResultSetHeader>(
      `INSERT INTO packages (
        slug, name, image, rating, description, overview, location, price, duration,
        category, itinerary_intro, featured, active, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        input.slug,
        input.name,
        input.image,
        input.rating,
        input.description,
        input.overview,
        input.location,
        input.price,
        input.duration,
        input.category,
        input.itineraryIntro,
        input.featured ? 1 : 0,
        input.active ? 1 : 0,
        input.sortOrder,
      ],
    );

    await insertRelated(connection, result.insertId, input);
    if (ownsConnection) await connection.commit();
    return result.insertId;
  } catch (error) {
    if (ownsConnection) await connection.rollback();
    throw error;
  } finally {
    if (ownsConnection) connection.release();
  }
}

export async function seedIfEmpty() {
  await ensureSchema();
  const pool = getPool();
  const [countRows] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) AS total FROM packages");
  if (Number(countRows[0]?.total ?? 0) > 0) return { seeded: false, count: Number(countRows[0]?.total ?? 0) };

  const [metaRows] = await pool.query<RowDataPacket[]>(
    "SELECT meta_value FROM app_meta WHERE meta_key = 'catalog_seeded' LIMIT 1",
  );
  if (metaRows[0]?.meta_value === "1") return { seeded: false, count: 0 };

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    for (const [index, destination] of featuredDestinations.entries()) {
      await insertPackage(
        {
          ...destinationToInput(destination),
          sortOrder: index,
        },
        connection,
      );
    }
    await connection.query(
      "INSERT INTO app_meta (meta_key, meta_value) VALUES ('catalog_seeded', '1') ON DUPLICATE KEY UPDATE meta_value = '1'",
    );
    await connection.commit();
    return { seeded: true, count: featuredDestinations.length };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function importSamplePackages() {
  await ensureSchema();
  const connection = await getPool().getConnection();
  let imported = 0;

  try {
    await connection.beginTransaction();
    for (const [index, destination] of featuredDestinations.entries()) {
      const [existing] = await connection.query<RowDataPacket[]>(
        "SELECT id FROM packages WHERE slug = ? LIMIT 1",
        [destination.slug],
      );
      if (existing.length > 0) continue;

      await insertPackage(
        {
          ...destinationToInput(destination),
          sortOrder: index,
        },
        connection,
      );
      imported += 1;
    }
    await connection.query(
      "INSERT INTO app_meta (meta_key, meta_value) VALUES ('catalog_seeded', '1') ON DUPLICATE KEY UPDATE meta_value = '1'",
    );
    await connection.commit();
    return imported;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function updatePackage(id: number, input: PackageInput) {
  await ensureSchema();
  const connection = await getPool().getConnection();

  try {
    await connection.beginTransaction();
    const [result] = await connection.query<ResultSetHeader>(
      `UPDATE packages SET
        slug = ?, name = ?, image = ?, rating = ?, description = ?, overview = ?,
        location = ?, price = ?, duration = ?, category = ?, itinerary_intro = ?,
        featured = ?, active = ?, sort_order = ?
      WHERE id = ?`,
      [
        input.slug,
        input.name,
        input.image,
        input.rating,
        input.description,
        input.overview,
        input.location,
        input.price,
        input.duration,
        input.category,
        input.itineraryIntro,
        input.featured ? 1 : 0,
        input.active ? 1 : 0,
        input.sortOrder,
        id,
      ],
    );

    if (result.affectedRows === 0) {
      throw new Error("Package not found");
    }

    await replaceRelated(connection, id, input);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function deletePackage(id: number) {
  await ensureSchema();
  const [result] = await getPool().query<ResultSetHeader>("DELETE FROM packages WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

export async function slugExists(slug: string, excludeId?: number) {
  await ensureSchema();
  const sql =
    excludeId != null
      ? "SELECT id FROM packages WHERE slug = ? AND id != ? LIMIT 1"
      : "SELECT id FROM packages WHERE slug = ? LIMIT 1";
  const params = excludeId != null ? [slug, excludeId] : [slug];
  const [rows] = await getPool().query<RowDataPacket[]>(sql, params);
  return rows.length > 0;
}

async function loadRelated(ids: number[]) {
  const gallery = new Map<number, string[]>();
  const highlights = new Map<number, Highlight[]>();
  const itinerary = new Map<number, ItineraryDay[]>();
  const included = new Map<number, string[]>();
  const notIncluded = new Map<number, string[]>();

  if (ids.length === 0) {
    return { gallery, highlights, itinerary, included, notIncluded };
  }

  const pool = getPool();
  const placeholders = ids.map(() => "?").join(", ");

  const [galleryRows] = await pool.query<GalleryRow[]>(
    `SELECT package_id, image_url FROM package_gallery WHERE package_id IN (${placeholders}) ORDER BY sort_order ASC, id ASC`,
    ids,
  );
  const [highlightRows] = await pool.query<HighlightRow[]>(
    `SELECT package_id, title, image FROM package_highlights WHERE package_id IN (${placeholders}) ORDER BY sort_order ASC, id ASC`,
    ids,
  );
  const [itineraryRows] = await pool.query<ItineraryRow[]>(
    `SELECT package_id, day_number, title, summary, activities FROM package_itinerary WHERE package_id IN (${placeholders}) ORDER BY sort_order ASC, id ASC`,
    ids,
  );
  const [itemRows] = await pool.query<ItemRow[]>(
    `SELECT package_id, kind, label FROM package_items WHERE package_id IN (${placeholders}) ORDER BY sort_order ASC, id ASC`,
    ids,
  );

  for (const row of galleryRows) {
    const list = gallery.get(row.package_id) ?? [];
    list.push(row.image_url);
    gallery.set(row.package_id, list);
  }
  for (const row of highlightRows) {
    const list = highlights.get(row.package_id) ?? [];
    list.push({ title: row.title, image: row.image });
    highlights.set(row.package_id, list);
  }
  for (const row of itineraryRows) {
    const list = itinerary.get(row.package_id) ?? [];
    list.push({
      day: row.day_number,
      title: row.title,
      summary: row.summary,
      activities: parseJson<string[]>(row.activities, []),
    });
    itinerary.set(row.package_id, list);
  }
  for (const row of itemRows) {
    const target = row.kind === "included" ? included : notIncluded;
    const list = target.get(row.package_id) ?? [];
    list.push(row.label);
    target.set(row.package_id, list);
  }

  return { gallery, highlights, itinerary, included, notIncluded };
}

function withRelated(rows: PackageRow[], related: Awaited<ReturnType<typeof loadRelated>>) {
  return rows.map((row) =>
    toPackage(row, {
      gallery: related.gallery.get(row.id),
      highlights: related.highlights.get(row.id),
      itinerary: related.itinerary.get(row.id),
      included: related.included.get(row.id),
      notIncluded: related.notIncluded.get(row.id),
    }),
  );
}

export async function setPackageActive(id: number, active: boolean) {
  await ensureSchema();
  const [result] = await getPool().query<ResultSetHeader>(
    "UPDATE packages SET active = ? WHERE id = ?",
    [active ? 1 : 0, id],
  );
  return result.affectedRows > 0;
}

export async function listPackageSummaries(): Promise<PackageRecord[]> {
  await ensureSchema();
  const [rows] = await getPool().query<PackageRow[]>(
    "SELECT * FROM packages ORDER BY sort_order ASC, id ASC",
  );
  return rows.map((row) => toPackage(row));
}

export async function listPackages(options?: { includeInactive?: boolean }): Promise<PackageRecord[]> {
  await ensureSchema();
  const [rows] = await getPool().query<PackageRow[]>(
    options?.includeInactive
      ? "SELECT * FROM packages ORDER BY sort_order ASC, id ASC"
      : "SELECT * FROM packages WHERE active = 1 ORDER BY sort_order ASC, id ASC",
  );
  const related = await loadRelated(rows.map((row) => row.id));
  return withRelated(rows, related);
}

export async function getPackageBySlug(
  slug: string,
  options?: { includeInactive?: boolean },
): Promise<PackageRecord | null> {
  await ensureSchema();
  const [rows] = await getPool().query<PackageRow[]>(
    options?.includeInactive
      ? "SELECT * FROM packages WHERE slug = ? LIMIT 1"
      : "SELECT * FROM packages WHERE slug = ? AND active = 1 LIMIT 1",
    [slug],
  );
  const row = rows[0];
  if (!row) return null;
  const related = await loadRelated([row.id]);
  return withRelated([row], related)[0] ?? null;
}

export async function getPackageById(id: number): Promise<PackageRecord | null> {
  await ensureSchema();
  const [rows] = await getPool().query<PackageRow[]>("SELECT * FROM packages WHERE id = ? LIMIT 1", [id]);
  const row = rows[0];
  if (!row) return null;
  const related = await loadRelated([row.id]);
  return withRelated([row], related)[0] ?? null;
}

export async function pingMysql() {
  await getPool().query("SELECT 1");
}
