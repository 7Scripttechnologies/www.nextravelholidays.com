import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { getPool } from "@/lib/db";
import { sanitizeIncludes, sanitizeStayPlan, type StayStop } from "@/lib/invoice";
import { parseJsonColumn } from "@/lib/json-column";
import { ensureSchema } from "@/lib/packages-db";

export type TourPackageRecord = {
  id: number;
  name: string;
  duration: string;
  stayPlan: StayStop[];
  includes: string[];
  invoiceCount: number;
  updatedAt: string;
};

export type TourPackageInput = {
  name: string;
  duration: string;
  stayPlan: StayStop[];
  includes: string[];
};

interface TourPackageRow extends RowDataPacket {
  id: number;
  name: string;
  duration: string;
  stay_plan: unknown;
  includes: unknown;
  invoice_count?: number | string | null;
  updated_at: string;
}

function toRecord(row: TourPackageRow): TourPackageRecord {
  return {
    id: row.id,
    name: row.name,
    duration: row.duration,
    stayPlan: sanitizeStayPlan(parseJsonColumn(row.stay_plan)),
    includes: sanitizeIncludes(parseJsonColumn(row.includes)),
    invoiceCount: Number(row.invoice_count ?? 0),
    updatedAt: String(row.updated_at ?? ""),
  };
}

export async function listTourPackages(): Promise<TourPackageRecord[]> {
  await ensureSchema();
  const [rows] = await getPool().query<TourPackageRow[]>(
    `SELECT tp.*, (SELECT COUNT(*) FROM invoices i WHERE i.tour_package_id = tp.id) AS invoice_count
     FROM tour_packages tp
     ORDER BY tp.name ASC, tp.id ASC`,
  );
  return rows.map(toRecord);
}

export async function getTourPackageById(id: number): Promise<TourPackageRecord | null> {
  await ensureSchema();
  const [rows] = await getPool().query<TourPackageRow[]>(
    `SELECT tp.*, (SELECT COUNT(*) FROM invoices i WHERE i.tour_package_id = tp.id) AS invoice_count
     FROM tour_packages tp WHERE tp.id = ? LIMIT 1`,
    [id],
  );
  const row = rows[0];
  return row ? toRecord(row) : null;
}

export async function insertTourPackage(input: TourPackageInput) {
  await ensureSchema();
  const [result] = await getPool().query<ResultSetHeader>(
    "INSERT INTO tour_packages (name, duration, stay_plan, includes) VALUES (?, ?, ?, ?)",
    [input.name, input.duration, JSON.stringify(input.stayPlan), JSON.stringify(input.includes)],
  );
  return result.insertId;
}

export async function updateTourPackage(id: number, input: TourPackageInput) {
  await ensureSchema();
  const [result] = await getPool().query<ResultSetHeader>(
    "UPDATE tour_packages SET name = ?, duration = ?, stay_plan = ?, includes = ? WHERE id = ?",
    [input.name, input.duration, JSON.stringify(input.stayPlan), JSON.stringify(input.includes), id],
  );
  if (result.affectedRows === 0) throw new Error("Package not found.");
}

export async function deleteTourPackage(id: number) {
  await ensureSchema();
  const [result] = await getPool().query<ResultSetHeader>("DELETE FROM tour_packages WHERE id = ?", [
    id,
  ]);
  return result.affectedRows > 0;
}
