import type { RowDataPacket } from "mysql2/promise";
import { getPool } from "@/lib/db";
import {
  DEFAULT_INVOICE_PREFIX,
  defaultPaymentDetails,
  isValidInvoicePrefix,
  sanitizePaymentDetails,
  type PaymentDetails,
} from "@/lib/invoice";
import { parseJsonColumn } from "@/lib/json-column";
import { ensureSchema } from "@/lib/packages-db";

export type InvoiceSettings = {
  prefix: string;
  paymentDetails: PaymentDetails;
};

const PREFIX_KEY = "invoice_prefix";
const PAYMENT_KEY = "invoice_payment_details";

export async function getInvoiceSettings(): Promise<InvoiceSettings> {
  await ensureSchema();
  const pool = getPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT setting_key, setting_value FROM site_settings WHERE setting_key IN (?, ?)",
    [PREFIX_KEY, PAYMENT_KEY],
  );
  const map = new Map(rows.map((row) => [String(row.setting_key), String(row.setting_value)]));

  const storedPrefix = (map.get(PREFIX_KEY) ?? "").trim();
  const prefix = isValidInvoicePrefix(storedPrefix) ? storedPrefix : DEFAULT_INVOICE_PREFIX;

  let paymentDetails: PaymentDetails;
  if (map.has(PAYMENT_KEY)) {
    paymentDetails = sanitizePaymentDetails(parseJsonColumn(map.get(PAYMENT_KEY)));
  } else {
    // Until Settings is saved once, carry over details typed on earlier invoices.
    const [latest] = await pool.query<RowDataPacket[]>(
      "SELECT payment_details FROM invoices ORDER BY id DESC LIMIT 1",
    );
    paymentDetails = latest[0]
      ? sanitizePaymentDetails(parseJsonColumn(latest[0].payment_details))
      : defaultPaymentDetails();
  }

  return { prefix, paymentDetails };
}

export async function saveInvoiceSettings(settings: InvoiceSettings) {
  await ensureSchema();
  const connection = await getPool().getConnection();
  try {
    await connection.beginTransaction();
    for (const [key, value] of [
      [PREFIX_KEY, settings.prefix],
      [PAYMENT_KEY, JSON.stringify(settings.paymentDetails)],
    ]) {
      await connection.query(
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
