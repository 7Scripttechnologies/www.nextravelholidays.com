import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { galleryItems, type GalleryAspect, type GalleryItem } from "@/data/gallery";
import { getPool } from "@/lib/db";
import { ensureSchema } from "@/lib/packages-db";

export type GalleryRecord = {
  id: number;
  src: string;
  alt: string;
  aspect: GalleryAspect;
  active: boolean;
  sortOrder: number;
};

export type GalleryInput = {
  src: string;
  alt: string;
  aspect: GalleryAspect;
  active: boolean;
  sortOrder: number;
};

interface GalleryItemRow extends RowDataPacket {
  id: number;
  image_url: string;
  alt_text: string;
  aspect: GalleryAspect;
  active: number;
  sort_order: number;
}

function toRecord(row: GalleryItemRow): GalleryRecord {
  return {
    id: row.id,
    src: row.image_url,
    alt: row.alt_text,
    aspect: row.aspect,
    active: row.active == null ? true : Number(row.active) === 1,
    sortOrder: row.sort_order,
  };
}

export function toPublicItem(record: GalleryRecord): GalleryItem {
  return {
    id: String(record.id),
    src: record.src,
    alt: record.alt,
    aspect: record.aspect,
  };
}

export async function insertGalleryItem(input: GalleryInput) {
  await ensureSchema();
  const [result] = await getPool().query<ResultSetHeader>(
    `INSERT INTO gallery_items (image_url, alt_text, aspect, active, sort_order)
     VALUES (?, ?, ?, ?, ?)`,
    [input.src, input.alt, input.aspect, input.active ? 1 : 0, input.sortOrder],
  );
  return result.insertId;
}

export async function updateGalleryItem(id: number, input: GalleryInput) {
  await ensureSchema();
  const [result] = await getPool().query<ResultSetHeader>(
    `UPDATE gallery_items SET
      image_url = ?, alt_text = ?, aspect = ?, active = ?, sort_order = ?
     WHERE id = ?`,
    [input.src, input.alt, input.aspect, input.active ? 1 : 0, input.sortOrder, id],
  );
  if (result.affectedRows === 0) throw new Error("Gallery item not found");
}

export async function deleteGalleryItem(id: number) {
  await ensureSchema();
  const [result] = await getPool().query<ResultSetHeader>("DELETE FROM gallery_items WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

export async function setGalleryItemActive(id: number, active: boolean) {
  await ensureSchema();
  const [result] = await getPool().query<ResultSetHeader>(
    "UPDATE gallery_items SET active = ? WHERE id = ?",
    [active ? 1 : 0, id],
  );
  return result.affectedRows > 0;
}

export async function listGalleryItems(options?: { includeInactive?: boolean }): Promise<GalleryRecord[]> {
  await ensureSchema();
  const [rows] = await getPool().query<GalleryItemRow[]>(
    options?.includeInactive
      ? "SELECT * FROM gallery_items ORDER BY sort_order ASC, id ASC"
      : "SELECT * FROM gallery_items WHERE active = 1 ORDER BY sort_order ASC, id ASC",
  );
  return rows.map(toRecord);
}

export async function getGalleryItemById(id: number): Promise<GalleryRecord | null> {
  await ensureSchema();
  const [rows] = await getPool().query<GalleryItemRow[]>(
    "SELECT * FROM gallery_items WHERE id = ? LIMIT 1",
    [id],
  );
  const row = rows[0];
  return row ? toRecord(row) : null;
}

export async function seedGalleryIfEmpty() {
  await ensureSchema();
  const pool = getPool();
  const [countRows] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) AS total FROM gallery_items");
  const count = Number(countRows[0]?.total ?? 0);
  if (count > 0) return { seeded: false, count };

  const [metaRows] = await pool.query<RowDataPacket[]>(
    "SELECT meta_value FROM app_meta WHERE meta_key = 'gallery_seeded' LIMIT 1",
  );
  if (metaRows[0]?.meta_value === "1") return { seeded: false, count: 0 };

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    for (const [index, item] of galleryItems.entries()) {
      await connection.query(
        `INSERT INTO gallery_items (image_url, alt_text, aspect, active, sort_order)
         VALUES (?, ?, ?, 1, ?)`,
        [item.src, item.alt, item.aspect, index],
      );
    }
    await connection.query(
      "INSERT INTO app_meta (meta_key, meta_value) VALUES ('gallery_seeded', '1') ON DUPLICATE KEY UPDATE meta_value = '1'",
    );
    await connection.commit();
    return { seeded: true, count: galleryItems.length };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function importSampleGalleryItems() {
  await ensureSchema();
  const connection = await getPool().getConnection();
  let imported = 0;

  try {
    await connection.beginTransaction();
    for (const [index, item] of galleryItems.entries()) {
      const [existing] = await connection.query<RowDataPacket[]>(
        "SELECT id FROM gallery_items WHERE image_url = ? AND alt_text = ? LIMIT 1",
        [item.src, item.alt],
      );
      if (existing.length > 0) continue;

      await connection.query(
        `INSERT INTO gallery_items (image_url, alt_text, aspect, active, sort_order)
         VALUES (?, ?, ?, 1, ?)`,
        [item.src, item.alt, item.aspect, index],
      );
      imported += 1;
    }
    await connection.query(
      "INSERT INTO app_meta (meta_key, meta_value) VALUES ('gallery_seeded', '1') ON DUPLICATE KEY UPDATE meta_value = '1'",
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
