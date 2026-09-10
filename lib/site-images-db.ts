import type { RowDataPacket } from "mysql2/promise";
import {
  defaultSiteImages,
  siteImageSlots,
  type SiteImagesMap,
  type SiteImageValue,
} from "@/data/site-images";
import { getPool } from "@/lib/db";
import { ensureSchema } from "@/lib/packages-db";

interface SiteImageRow extends RowDataPacket {
  image_key: string;
  image_url: string;
  caption: string | null;
}

export async function listSiteImagesFromDb(): Promise<SiteImagesMap> {
  await ensureSchema();
  const map = defaultSiteImages();
  const [rows] = await getPool().query<SiteImageRow[]>("SELECT image_key, image_url, caption FROM site_images");

  for (const row of rows) {
    if (!(row.image_key in map)) continue;
    map[row.image_key] = {
      src: row.image_url || map[row.image_key].src,
      caption: row.caption ?? map[row.image_key].caption,
    };
  }

  return map;
}

export async function upsertSiteImages(values: Record<string, SiteImageValue>) {
  await ensureSchema();
  const connection = await getPool().getConnection();

  try {
    await connection.beginTransaction();
    for (const slot of siteImageSlots) {
      const next = values[slot.key];
      if (!next?.src?.trim()) continue;

      await connection.query(
        `INSERT INTO site_images (image_key, image_url, caption)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE image_url = VALUES(image_url), caption = VALUES(caption)`,
        [slot.key, next.src.trim(), next.caption?.trim() || null],
      );
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
