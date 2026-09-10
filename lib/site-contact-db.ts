import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { getPool } from "@/lib/db";
import { ensureSchema } from "@/lib/packages-db";
import {
  defaultSiteContact,
  normalizePhone,
  socialLinkFields,
  type SiteContact,
  type SocialLinkKey,
} from "@/lib/site-contact";

interface SettingRow extends RowDataPacket {
  setting_key: string;
  setting_value: string;
}

const SOCIAL_KEYS = socialLinkFields.map((field) => field.key);

export async function getSiteContactFromDb(): Promise<SiteContact> {
  await ensureSchema();
  const defaults = defaultSiteContact();
  const [rows] = await getPool().query<SettingRow[]>(
    "SELECT setting_key, setting_value FROM site_settings",
  );

  const map = new Map(rows.map((row) => [row.setting_key, row.setting_value]));
  const phone = normalizePhone(map.get("phone") || defaults.phoneDisplay);

  const socials = Object.fromEntries(
    SOCIAL_KEYS.map((key) => [key, (map.get(key) ?? defaults[key]).trim()]),
  ) as Pick<SiteContact, SocialLinkKey>;

  return {
    ...defaults,
    ...phone,
    serviceArea: (map.get("service_area") || defaults.serviceArea).trim() || defaults.serviceArea,
    ...socials,
  };
}

export async function upsertSiteContact(input: {
  phoneDisplay: string;
  serviceArea: string;
  facebook: string;
  instagram: string;
  x: string;
  youtube: string;
  googleBusiness: string;
}) {
  await ensureSchema();
  const phone = normalizePhone(input.phoneDisplay);
  const values: Array<[string, string]> = [
    ["phone", phone.phoneDisplay],
    ["service_area", input.serviceArea.trim()],
    ["facebook", input.facebook.trim()],
    ["instagram", input.instagram.trim()],
    ["x", input.x.trim()],
    ["youtube", input.youtube.trim()],
    ["googleBusiness", input.googleBusiness.trim()],
  ];

  const connection = await getPool().getConnection();
  try {
    await connection.beginTransaction();
    for (const [key, value] of values) {
      await connection.query<ResultSetHeader>(
        `INSERT INTO site_settings (setting_key, setting_value)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
        [key, value],
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
