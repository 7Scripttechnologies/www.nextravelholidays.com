import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { reviews as sampleReviews, type Review } from "@/data/reviews";
import { getPool } from "@/lib/db";
import { ensureSchema } from "@/lib/packages-db";

export type ReviewRecord = {
  id: number;
  name: string;
  type: string;
  title: string | null;
  quote: string;
  rating: number;
  avatar: string;
  active: boolean;
  sortOrder: number;
};

export type ReviewInput = {
  name: string;
  type: string;
  title: string | null;
  quote: string;
  rating: number;
  avatar: string;
  active: boolean;
  sortOrder: number;
};

interface ReviewRow extends RowDataPacket {
  id: number;
  name: string;
  traveler_type: string;
  title: string | null;
  quote: string;
  rating: number;
  avatar_url: string;
  active: number;
  sort_order: number;
}

function toRecord(row: ReviewRow): ReviewRecord {
  return {
    id: row.id,
    name: row.name,
    type: row.traveler_type,
    title: row.title,
    quote: row.quote,
    rating: Number(row.rating),
    avatar: row.avatar_url,
    active: row.active == null ? true : Number(row.active) === 1,
    sortOrder: row.sort_order,
  };
}

export function toPublicReview(record: ReviewRecord): Review {
  return {
    id: String(record.id),
    name: record.name,
    type: record.type,
    title: record.title || undefined,
    quote: record.quote,
    rating: record.rating,
    avatar: record.avatar,
  };
}

export async function insertReview(input: ReviewInput) {
  await ensureSchema();
  const [result] = await getPool().query<ResultSetHeader>(
    `INSERT INTO reviews (name, traveler_type, title, quote, rating, avatar_url, active, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.name,
      input.type,
      input.title,
      input.quote,
      input.rating,
      input.avatar,
      input.active ? 1 : 0,
      input.sortOrder,
    ],
  );
  return result.insertId;
}

export async function updateReview(id: number, input: ReviewInput) {
  await ensureSchema();
  const [result] = await getPool().query<ResultSetHeader>(
    `UPDATE reviews SET
      name = ?, traveler_type = ?, title = ?, quote = ?, rating = ?,
      avatar_url = ?, active = ?, sort_order = ?
     WHERE id = ?`,
    [
      input.name,
      input.type,
      input.title,
      input.quote,
      input.rating,
      input.avatar,
      input.active ? 1 : 0,
      input.sortOrder,
      id,
    ],
  );
  if (result.affectedRows === 0) throw new Error("Review not found");
}

export async function deleteReview(id: number) {
  await ensureSchema();
  const [result] = await getPool().query<ResultSetHeader>("DELETE FROM reviews WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

export async function setReviewActive(id: number, active: boolean) {
  await ensureSchema();
  const [result] = await getPool().query<ResultSetHeader>(
    "UPDATE reviews SET active = ? WHERE id = ?",
    [active ? 1 : 0, id],
  );
  return result.affectedRows > 0;
}

export async function listReviews(options?: { includeInactive?: boolean }): Promise<ReviewRecord[]> {
  await ensureSchema();
  const [rows] = await getPool().query<ReviewRow[]>(
    options?.includeInactive
      ? "SELECT * FROM reviews ORDER BY sort_order ASC, id ASC"
      : "SELECT * FROM reviews WHERE active = 1 ORDER BY sort_order ASC, id ASC",
  );
  return rows.map(toRecord);
}

export async function getReviewById(id: number): Promise<ReviewRecord | null> {
  await ensureSchema();
  const [rows] = await getPool().query<ReviewRow[]>("SELECT * FROM reviews WHERE id = ? LIMIT 1", [
    id,
  ]);
  const row = rows[0];
  return row ? toRecord(row) : null;
}

export async function seedReviewsIfEmpty() {
  await ensureSchema();
  const pool = getPool();
  const [countRows] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) AS total FROM reviews");
  const count = Number(countRows[0]?.total ?? 0);
  if (count > 0) return { seeded: false, count };

  const [metaRows] = await pool.query<RowDataPacket[]>(
    "SELECT meta_value FROM app_meta WHERE meta_key = 'reviews_seeded' LIMIT 1",
  );
  if (metaRows[0]?.meta_value === "1") return { seeded: false, count: 0 };

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    for (const [index, item] of sampleReviews.entries()) {
      await connection.query(
        `INSERT INTO reviews (name, traveler_type, title, quote, rating, avatar_url, active, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, 1, ?)`,
        [item.name, item.type, item.title ?? null, item.quote, item.rating, item.avatar, index],
      );
    }
    await connection.query(
      "INSERT INTO app_meta (meta_key, meta_value) VALUES ('reviews_seeded', '1') ON DUPLICATE KEY UPDATE meta_value = '1'",
    );
    await connection.commit();
    return { seeded: true, count: sampleReviews.length };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function importSampleReviews() {
  await ensureSchema();
  const connection = await getPool().getConnection();
  let imported = 0;

  try {
    await connection.beginTransaction();
    for (const [index, item] of sampleReviews.entries()) {
      const [existing] = await connection.query<RowDataPacket[]>(
        "SELECT id FROM reviews WHERE name = ? AND quote = ? LIMIT 1",
        [item.name, item.quote],
      );
      if (existing.length > 0) continue;

      await connection.query(
        `INSERT INTO reviews (name, traveler_type, title, quote, rating, avatar_url, active, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, 1, ?)`,
        [item.name, item.type, item.title ?? null, item.quote, item.rating, item.avatar, index],
      );
      imported += 1;
    }
    await connection.query(
      "INSERT INTO app_meta (meta_key, meta_value) VALUES ('reviews_seeded', '1') ON DUPLICATE KEY UPDATE meta_value = '1'",
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
