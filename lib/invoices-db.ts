import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { getPool } from "@/lib/db";
import {
  chargesTotal,
  formatInvoiceNo,
  invoiceNoBase,
  nextInvoiceSequence,
  paymentStatus,
  sanitizeCharges,
  sanitizeIncludes,
  sanitizePaymentDetails,
  sanitizeStayPlan,
  toAmount,
  type InvoiceData,
  type InvoicePayment,
  type PaymentStatus,
} from "@/lib/invoice";
import { parseJsonColumn } from "@/lib/json-column";
import { ensureSchema } from "@/lib/packages-db";

export type InvoiceInput = InvoiceData & {
  customerId: number | null;
  tourPackageId: number | null;
};

export type InvoiceRecord = InvoiceInput & {
  id: number;
  totalAmount: number;
  paymentsReceived: number;
  createdAt: string;
  updatedAt: string;
};

export type InvoiceSummary = {
  id: number;
  invoiceNo: string;
  invoiceDate: string;
  customerId: number | null;
  clientName: string;
  clientMobile: string;
  packageName: string;
  totalAmount: number;
  advanceReceived: number;
  /** Advance + recorded payments. */
  amountReceived: number;
  outstanding: number;
  status: PaymentStatus;
};

interface InvoiceRow extends RowDataPacket {
  id: number;
  invoice_no: string;
  invoice_date: string;
  customer_id: number | null;
  tour_package_id: number | null;
  client_name: string;
  client_mobile: string;
  client_email: string;
  client_city: string;
  package_name: string;
  duration: string;
  destinations: string;
  travellers: string;
  rooms: string;
  hotel: string;
  stay_plan: unknown;
  includes: unknown;
  charges: unknown;
  total_amount: string | number;
  advance_received: string | number;
  payments_received: string | number | null;
  payment_details: unknown;
  created_at: string;
  updated_at: string;
}

function toRecord(row: InvoiceRow): InvoiceRecord {
  return {
    id: row.id,
    invoiceNo: row.invoice_no,
    invoiceDate: String(row.invoice_date ?? "").slice(0, 10),
    customerId: row.customer_id ?? null,
    tourPackageId: row.tour_package_id ?? null,
    clientName: row.client_name,
    clientMobile: row.client_mobile ?? "",
    clientEmail: row.client_email ?? "",
    clientCity: row.client_city ?? "",
    packageName: row.package_name,
    duration: row.duration ?? "",
    destinations: row.destinations ?? "",
    travellers: row.travellers ?? "",
    rooms: row.rooms ?? "",
    hotel: row.hotel ?? "",
    stayPlan: sanitizeStayPlan(parseJsonColumn(row.stay_plan)),
    includes: sanitizeIncludes(parseJsonColumn(row.includes)),
    charges: sanitizeCharges(parseJsonColumn(row.charges)),
    totalAmount: toAmount(row.total_amount),
    advanceReceived: toAmount(row.advance_received),
    paymentsReceived: toAmount(row.payments_received),
    paymentDetails: sanitizePaymentDetails(parseJsonColumn(row.payment_details)),
    createdAt: String(row.created_at ?? ""),
    updatedAt: String(row.updated_at ?? ""),
  };
}

function toSummary(row: InvoiceRow): InvoiceSummary {
  const totalAmount = toAmount(row.total_amount);
  const advanceReceived = toAmount(row.advance_received);
  const amountReceived = toAmount(advanceReceived + toAmount(row.payments_received));
  return {
    id: row.id,
    invoiceNo: row.invoice_no,
    invoiceDate: String(row.invoice_date ?? "").slice(0, 10),
    customerId: row.customer_id ?? null,
    clientName: row.client_name,
    clientMobile: row.client_mobile ?? "",
    packageName: row.package_name,
    totalAmount,
    advanceReceived,
    amountReceived,
    outstanding: Math.max(0, toAmount(totalAmount - amountReceived)),
    status: paymentStatus(totalAmount, amountReceived),
  };
}

const paymentsReceivedColumn = `(SELECT COALESCE(SUM(p.amount), 0) FROM invoice_payments p
  WHERE p.invoice_id = invoices.id) AS payments_received`;

const summaryColumns = `id, invoice_no, invoice_date, customer_id, client_name, client_mobile,
  package_name, total_amount, advance_received, ${paymentsReceivedColumn}`;

export async function listInvoices(search?: string): Promise<InvoiceSummary[]> {
  await ensureSchema();
  const term = search?.trim();
  if (term) {
    const like = `%${term}%`;
    const [rows] = await getPool().query<InvoiceRow[]>(
      `SELECT ${summaryColumns} FROM invoices
       WHERE invoice_no LIKE ? OR client_name LIKE ? OR client_mobile LIKE ? OR package_name LIKE ?
       ORDER BY invoice_date DESC, id DESC`,
      [like, like, like, like],
    );
    return rows.map(toSummary);
  }

  const [rows] = await getPool().query<InvoiceRow[]>(
    `SELECT ${summaryColumns} FROM invoices ORDER BY invoice_date DESC, id DESC`,
  );
  return rows.map(toSummary);
}

export async function listInvoicesByCustomer(customerId: number): Promise<InvoiceSummary[]> {
  await ensureSchema();
  const [rows] = await getPool().query<InvoiceRow[]>(
    `SELECT ${summaryColumns} FROM invoices WHERE customer_id = ? ORDER BY invoice_date DESC, id DESC`,
    [customerId],
  );
  return rows.map(toSummary);
}

export async function getInvoiceById(id: number): Promise<InvoiceRecord | null> {
  await ensureSchema();
  const [rows] = await getPool().query<InvoiceRow[]>(
    `SELECT invoices.*, ${paymentsReceivedColumn} FROM invoices WHERE id = ? LIMIT 1`,
    [id],
  );
  const row = rows[0];
  return row ? toRecord(row) : null;
}

interface PaymentRow extends RowDataPacket {
  id: number;
  amount: string | number;
  paid_on: string;
  method: string;
  note: string;
  created_at: string;
}

export async function listInvoicePayments(invoiceId: number): Promise<InvoicePayment[]> {
  await ensureSchema();
  const [rows] = await getPool().query<PaymentRow[]>(
    `SELECT id, amount, DATE_FORMAT(paid_on, '%Y-%m-%d') AS paid_on, method, note, created_at
     FROM invoice_payments WHERE invoice_id = ? ORDER BY paid_on ASC, id ASC`,
    [invoiceId],
  );
  return rows.map((row) => ({
    id: row.id,
    amount: toAmount(row.amount),
    paidOn: String(row.paid_on ?? "").slice(0, 10),
    method: row.method ?? "",
    note: row.note ?? "",
    createdAt: String(row.created_at ?? ""),
  }));
}

export type InvoicePaymentInput = { amount: number; paidOn: string; method: string; note: string };

/** Locks the invoice row so two payments saved together can't exceed the outstanding amount. */
export async function insertInvoicePayment(invoiceId: number, input: InvoicePaymentInput) {
  await ensureSchema();
  const connection = await getPool().getConnection();
  try {
    await connection.beginTransaction();
    const [invoiceRows] = await connection.query<RowDataPacket[]>(
      "SELECT total_amount, advance_received FROM invoices WHERE id = ? FOR UPDATE",
      [invoiceId],
    );
    const invoice = invoiceRows[0];
    if (!invoice) throw new Error("Invoice not found. It may have been deleted.");

    const [sumRows] = await connection.query<RowDataPacket[]>(
      "SELECT COALESCE(SUM(amount), 0) AS paid FROM invoice_payments WHERE invoice_id = ?",
      [invoiceId],
    );
    const received = toAmount(toAmount(invoice.advance_received) + toAmount(sumRows[0]?.paid));
    const outstanding = toAmount(toAmount(invoice.total_amount) - received);
    if (outstanding <= 0) throw new Error("This invoice is already fully paid.");
    if (input.amount > outstanding) {
      throw new Error(`Payment is more than the outstanding amount (₹${outstanding.toLocaleString("en-IN")}).`);
    }

    const [result] = await connection.query<ResultSetHeader>(
      "INSERT INTO invoice_payments (invoice_id, amount, paid_on, method, note) VALUES (?, ?, ?, ?, ?)",
      [invoiceId, input.amount, input.paidOn, input.method, input.note],
    );
    await connection.commit();
    return result.insertId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function deleteInvoicePayment(invoiceId: number, paymentId: number) {
  await ensureSchema();
  const [result] = await getPool().query<ResultSetHeader>(
    "DELETE FROM invoice_payments WHERE id = ? AND invoice_id = ?",
    [paymentId, invoiceId],
  );
  return result.affectedRows > 0;
}

/** Next number for the invoice date's month, e.g. `#NH/2026/10/004`. */
export async function getNextInvoiceNo(prefix: string, invoiceDate: string) {
  await ensureSchema();
  const base = invoiceNoBase(prefix, invoiceDate);
  const likePattern = `${base.replace(/[\\%_]/g, (char) => `\\${char}`)}/%`;
  const [rows] = await getPool().query<RowDataPacket[]>(
    "SELECT invoice_no FROM invoices WHERE invoice_no LIKE ?",
    [likePattern],
  );
  const sequence = nextInvoiceSequence(
    rows.map((row) => String(row.invoice_no)),
    base,
  );
  return formatInvoiceNo(prefix, invoiceDate, sequence);
}

function invoiceValues(input: InvoiceInput) {
  return [
    input.invoiceNo,
    input.invoiceDate,
    input.customerId,
    input.tourPackageId,
    input.clientName,
    input.clientMobile,
    input.clientEmail,
    input.clientCity,
    input.packageName,
    input.duration,
    input.destinations,
    input.travellers,
    input.rooms,
    input.hotel,
    JSON.stringify(input.stayPlan),
    JSON.stringify(input.includes),
    JSON.stringify(input.charges),
    chargesTotal(input.charges),
    input.advanceReceived,
    JSON.stringify(input.paymentDetails),
  ];
}

export async function insertInvoice(input: InvoiceInput, { autoEmail = false }: { autoEmail?: boolean } = {}) {
  await ensureSchema();
  const [result] = await getPool().query<ResultSetHeader>(
    `INSERT INTO invoices (
      invoice_no, invoice_date, customer_id, tour_package_id,
      client_name, client_mobile, client_email, client_city,
      package_name, duration, destinations, travellers, rooms, hotel,
      stay_plan, includes, charges, total_amount, advance_received, payment_details, auto_email_pending
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [...invoiceValues(input), autoEmail ? 1 : 0],
  );
  return result.insertId;
}

/**
 * Atomically takes the "email this new invoice" flag set on creation. Only one caller ever gets
 * `true`, so the automatic email goes out once even if several requests race for it.
 */
export async function claimInvoiceAutoEmail(id: number) {
  await ensureSchema();
  const [result] = await getPool().query<ResultSetHeader>(
    "UPDATE invoices SET auto_email_pending = 0, updated_at = updated_at WHERE id = ? AND auto_email_pending = 1",
    [id],
  );
  return result.affectedRows > 0;
}

export async function updateInvoice(id: number, input: InvoiceInput) {
  await ensureSchema();
  const [result] = await getPool().query<ResultSetHeader>(
    `UPDATE invoices SET
      invoice_no = ?, invoice_date = ?, customer_id = ?, tour_package_id = ?,
      client_name = ?, client_mobile = ?, client_email = ?, client_city = ?,
      package_name = ?, duration = ?, destinations = ?, travellers = ?, rooms = ?, hotel = ?,
      stay_plan = ?, includes = ?, charges = ?, total_amount = ?, advance_received = ?, payment_details = ?
     WHERE id = ?`,
    [...invoiceValues(input), id],
  );
  if (result.affectedRows === 0) throw new Error("Invoice not found.");
}

export async function deleteInvoice(id: number) {
  await ensureSchema();
  const [result] = await getPool().query<ResultSetHeader>("DELETE FROM invoices WHERE id = ?", [id]);
  return result.affectedRows > 0;
}
