import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { getPool } from "@/lib/db";
import { ensureSchema } from "@/lib/packages-db";

export type CustomerRecord = {
  id: number;
  name: string;
  mobile: string;
  email: string;
  city: string;
  invoiceCount: number;
  createdAt: string;
};

export type CustomerInput = {
  name: string;
  mobile: string;
  email: string;
  city: string;
};

interface CustomerRow extends RowDataPacket {
  id: number;
  name: string;
  mobile: string;
  email: string | null;
  city: string | null;
  invoice_count?: number | string | null;
  created_at: string;
}

function toRecord(row: CustomerRow): CustomerRecord {
  return {
    id: row.id,
    name: row.name,
    mobile: row.mobile,
    email: row.email ?? "",
    city: row.city ?? "",
    invoiceCount: Number(row.invoice_count ?? 0),
    createdAt: String(row.created_at ?? ""),
  };
}

const selectWithCount = `SELECT c.*, (SELECT COUNT(*) FROM invoices i WHERE i.customer_id = c.id) AS invoice_count
  FROM customers c`;

export async function listCustomers(search?: string): Promise<CustomerRecord[]> {
  await ensureSchema();
  const term = search?.trim();
  if (term) {
    const like = `%${term}%`;
    const [rows] = await getPool().query<CustomerRow[]>(
      `${selectWithCount}
       WHERE c.name LIKE ? OR c.mobile LIKE ? OR c.email LIKE ? OR c.city LIKE ?
       ORDER BY c.name ASC, c.id ASC`,
      [like, like, like, like],
    );
    return rows.map(toRecord);
  }

  const [rows] = await getPool().query<CustomerRow[]>(`${selectWithCount} ORDER BY c.name ASC, c.id ASC`);
  return rows.map(toRecord);
}

export async function getCustomerById(id: number): Promise<CustomerRecord | null> {
  await ensureSchema();
  const [rows] = await getPool().query<CustomerRow[]>(`${selectWithCount} WHERE c.id = ? LIMIT 1`, [id]);
  const row = rows[0];
  return row ? toRecord(row) : null;
}

export async function insertCustomer(input: CustomerInput) {
  await ensureSchema();
  const [result] = await getPool().query<ResultSetHeader>(
    "INSERT INTO customers (name, mobile, email, city) VALUES (?, ?, ?, ?)",
    [input.name, input.mobile, input.email || null, input.city || null],
  );
  return result.insertId;
}

export async function updateCustomer(id: number, input: CustomerInput) {
  await ensureSchema();
  const [result] = await getPool().query<ResultSetHeader>(
    "UPDATE customers SET name = ?, mobile = ?, email = ?, city = ? WHERE id = ?",
    [input.name, input.mobile, input.email || null, input.city || null, id],
  );
  if (result.affectedRows === 0) throw new Error("Customer not found.");
}

export async function deleteCustomer(id: number) {
  await ensureSchema();
  const [result] = await getPool().query<ResultSetHeader>("DELETE FROM customers WHERE id = ?", [id]);
  return result.affectedRows > 0;
}
