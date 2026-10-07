import { createHmac, timingSafeEqual } from "crypto";
import { mkdir, readFile, rename, unlink, writeFile } from "fs/promises";
import path from "path";
import { projectRoot } from "@/lib/uploads";

const MAX_PDF_BYTES = 8 * 1024 * 1024;

function pdfDir() {
  return path.join(projectRoot(), "data", "invoice-pdfs");
}

function pdfPath(invoiceId: number) {
  return path.join(pdfDir(), `${invoiceId}.pdf`);
}

function signature(invoiceId: number) {
  const secret = process.env.AUTH_SECRET ?? "";
  if (!secret) throw new Error("PDF links need AUTH_SECRET in .env.local.");
  // Hex only: chat apps stop auto-linking a URL at trailing `-` or `_`, which base64url can produce.
  return createHmac("sha256", secret).update(`invoice-pdf:${invoiceId}`).digest("hex").slice(0, 32);
}

/** Public, unguessable link token for an invoice PDF, e.g. `12-9f3a…`. Stable for the life of the invoice. */
export function invoicePdfToken(invoiceId: number) {
  return `${invoiceId}-${signature(invoiceId)}`;
}

export function invoiceIdFromPdfToken(token: string) {
  const match = /^(\d{1,10})-([0-9a-f]{32})$/.exec(token);
  if (!match) return null;
  const invoiceId = Number(match[1]);
  let expected: string;
  try {
    expected = signature(invoiceId);
  } catch {
    return null;
  }
  const given = Buffer.from(match[2]);
  const wanted = Buffer.from(expected);
  return given.length === wanted.length && timingSafeEqual(given, wanted) ? invoiceId : null;
}

export async function saveInvoicePdf(invoiceId: number, file: File) {
  if (file.size === 0 || file.size > MAX_PDF_BYTES) throw new Error("The invoice PDF is empty or too large.");
  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.subarray(0, 5).toString("latin1") !== "%PDF-") throw new Error("That file is not a PDF.");

  await mkdir(pdfDir(), { recursive: true });
  // Write then rename so a customer opening the link mid-upload never gets a half-written file.
  const target = pdfPath(invoiceId);
  const temp = `${target}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(temp, bytes);
  await rename(temp, target);
}

export async function readInvoicePdf(invoiceId: number) {
  try {
    return await readFile(pdfPath(invoiceId));
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return null;
    throw error;
  }
}

export async function deleteInvoicePdf(invoiceId: number) {
  try {
    await unlink(pdfPath(invoiceId));
  } catch (error) {
    if (!(error && typeof error === "object" && "code" in error && error.code === "ENOENT")) throw error;
  }
}
