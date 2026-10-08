"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ActionState } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { parseCustomerForm } from "@/lib/customer-form";
import { deleteCustomer, insertCustomer, updateCustomer } from "@/lib/customers-db";
import {
  chargesTotal,
  DEFAULT_INVOICE_PREFIX,
  formatINR,
  isIsoDate,
  isValidInvoicePrefix,
  paymentDetailFields,
  sanitizePaymentDetails,
  invoicePdfFileName,
  toAmount,
  type InvoiceData,
} from "@/lib/invoice";
import { invoiceEmailHtml, invoiceEmailSubject, invoiceEmailText } from "@/lib/invoice-email";
import { parseInvoiceForm } from "@/lib/invoice-form";
import { isValidEmail, sendMail } from "@/lib/mailer";
import { deleteInvoicePdf, invoicePdfToken, saveInvoicePdf } from "@/lib/invoice-pdf-store";
import { getInvoiceSettings, saveInvoiceSettings } from "@/lib/invoice-settings-db";
import {
  claimInvoiceAutoEmail,
  deleteInvoice,
  deleteInvoicePayment,
  getInvoiceById,
  getNextInvoiceNo,
  insertInvoice,
  insertInvoicePayment,
  listInvoicePayments,
  updateInvoice,
} from "@/lib/invoices-db";
import { dbErrorCode } from "@/lib/json-column";
import { parseTourPackageForm } from "@/lib/tour-package-form";
import { deleteTourPackage, insertTourPackage, updateTourPackage } from "@/lib/tour-packages-db";

function billingError(error: unknown) {
  const code = dbErrorCode(error);
  if (code === "ER_DUP_ENTRY") return "Could not assign a unique invoice number. Please save again.";
  if (code === "ER_NO_REFERENCED_ROW_2" || code === "ER_NO_REFERENCED_ROW") {
    return "The selected customer or package no longer exists. Reselect it and try again.";
  }
  if (error instanceof Error && error.message) return error.message;
  return "Something went wrong. Check that MySQL is running.";
}

function revalidateBilling() {
  revalidatePath("/admin/invoices");
  revalidatePath("/admin/customers");
  revalidatePath("/admin/tour-packages");
}

function validId(id: number) {
  if (!Number.isInteger(id) || id < 1) throw new Error("Invalid record id.");
}

// ── Tour packages ────────────────────────────────────────────────────────────

export async function createTourPackageAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = parseTourPackageForm(formData);
  if (!parsed.ok) return { error: parsed.error };

  try {
    await insertTourPackage(parsed.data);
  } catch (error) {
    return { error: billingError(error) };
  }

  revalidateBilling();
  redirect("/admin/tour-packages");
}

export async function updateTourPackageAction(
  id: number,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  validId(id);
  const parsed = parseTourPackageForm(formData);
  if (!parsed.ok) return { error: parsed.error };

  try {
    await updateTourPackage(id, parsed.data);
  } catch (error) {
    return { error: billingError(error) };
  }

  revalidateBilling();
  redirect("/admin/tour-packages");
}

export async function deleteTourPackageAction(id: number) {
  await requireAdmin();
  validId(id);
  try {
    await deleteTourPackage(id);
  } catch (error) {
    throw new Error(billingError(error));
  }
  revalidateBilling();
}

// ── Customers ────────────────────────────────────────────────────────────────

export async function createCustomerAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = parseCustomerForm(formData);
  if (!parsed.ok) return { error: parsed.error };

  try {
    await insertCustomer(parsed.data);
  } catch (error) {
    return { error: billingError(error) };
  }

  revalidateBilling();
  redirect("/admin/customers");
}

export async function updateCustomerAction(
  id: number,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  validId(id);
  const parsed = parseCustomerForm(formData);
  if (!parsed.ok) return { error: parsed.error };

  try {
    await updateCustomer(id, parsed.data);
  } catch (error) {
    return { error: billingError(error) };
  }

  revalidateBilling();
  redirect(`/admin/customers/${id}`);
}

export async function deleteCustomerAction(id: number) {
  await requireAdmin();
  validId(id);
  try {
    await deleteCustomer(id);
  } catch (error) {
    throw new Error(billingError(error));
  }
  revalidateBilling();
}

// ── Invoices ─────────────────────────────────────────────────────────────────

export async function createInvoiceAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = parseInvoiceForm(formData);
  if (!parsed.ok) return { error: parsed.error };

  const data = { ...parsed.data };
  const autoEmail = isValidEmail(data.clientEmail);
  let invoiceId = 0;

  try {
    const settings = await getInvoiceSettings();
    if (parsed.saveCustomer && data.customerId == null) {
      data.customerId = await insertCustomer({
        name: data.clientName,
        mobile: data.clientMobile,
        email: data.clientEmail,
        city: data.clientCity,
      });
    }

    // Two invoices saved at the same moment could pick the same number; the unique key catches it.
    for (let attempt = 0; ; attempt += 1) {
      const invoiceNo = await getNextInvoiceNo(settings.prefix, data.invoiceDate);
      try {
        invoiceId = await insertInvoice(
          { ...data, invoiceNo, paymentDetails: settings.paymentDetails },
          { autoEmail },
        );
        break;
      } catch (error) {
        if (dbErrorCode(error) !== "ER_DUP_ENTRY" || attempt >= 4) throw error;
      }
    }
  } catch (error) {
    return { error: billingError(error) };
  }

  revalidateBilling();
  // The invoice page builds the PDF in the browser and emails it to the client.
  redirect(`/admin/invoices/${invoiceId}${autoEmail ? "?email=1" : ""}`);
}

export async function updateInvoiceAction(
  id: number,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  validId(id);
  const parsed = parseInvoiceForm(formData);
  if (!parsed.ok) return { error: parsed.error };

  const data = { ...parsed.data };

  try {
    const existing = await getInvoiceById(id);
    if (!existing) return { error: "Invoice not found. It may have been deleted." };
    const newTotal = chargesTotal(data.charges);
    if (existing.paymentsReceived > 0 && data.advanceReceived + existing.paymentsReceived > newTotal) {
      return {
        error: `Advance + recorded payments (₹${formatINR(data.advanceReceived + existing.paymentsReceived)}) is more than the total (₹${formatINR(newTotal)}). Lower the advance or delete a payment first.`,
      };
    }
    const settings = await getInvoiceSettings();
    if (parsed.saveCustomer && data.customerId == null) {
      data.customerId = await insertCustomer({
        name: data.clientName,
        mobile: data.clientMobile,
        email: data.clientEmail,
        city: data.clientCity,
      });
    }
    await updateInvoice(id, {
      ...data,
      invoiceNo: existing.invoiceNo,
      paymentDetails: settings.paymentDetails,
    });
  } catch (error) {
    return { error: billingError(error) };
  }

  revalidateBilling();
  redirect(`/admin/invoices/${id}`);
}

export async function deleteInvoiceAction(id: number) {
  await requireAdmin();
  validId(id);
  try {
    await deleteInvoice(id);
  } catch (error) {
    throw new Error(billingError(error));
  }
  await deleteInvoicePdf(id).catch(() => undefined);
  revalidateBilling();
}

/** Stores the browser-built PDF and returns its public link path, e.g. `/invoice/12-Xk3…`. */
export async function shareInvoicePdfAction(id: number, formData: FormData): Promise<{ path: string }> {
  await requireAdmin();
  validId(id);
  const file = formData.get("pdf");
  if (!(file instanceof File)) throw new Error("No PDF was uploaded.");
  if (!(await getInvoiceById(id))) throw new Error("Invoice not found. It may have been deleted.");
  await saveInvoicePdf(id, file);
  return { path: `/invoice/${invoicePdfToken(id)}` };
}

export type EmailInvoiceResult =
  | { ok: true; to: string }
  | { ok: false; error: string }
  /** The automatic email for a new invoice was already sent by another request. */
  | { ok: "skipped" };

/** Public base URL for links in emails, or null when running on this computer (customers can't open those). */
async function publicOrigin() {
  const store = await headers();
  const host = store.get("x-forwarded-host") ?? store.get("host");
  if (!host) return null;
  const hostname = host.replace(/:\d+$/, "").toLowerCase();
  const isPrivate =
    hostname === "localhost" ||
    hostname.endsWith(".local") ||
    /^(127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|0\.0\.0\.0$|\[?::1\]?$)/.test(hostname);
  if (isPrivate) return null;
  const proto = store.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}`;
}

/** Saves the browser-built PDF (refreshing the shared link) and emails it to the client with the trip details. */
export async function emailInvoiceAction(id: number, formData: FormData): Promise<EmailInvoiceResult> {
  return sendInvoiceEmail(id, formData, { once: false });
}

/**
 * The automatic email sent right after an invoice is created. The server only sends it if it can
 * claim the invoice's one-time flag, so the client gets it once however many times this is called.
 */
export async function emailNewInvoiceAction(id: number, formData: FormData): Promise<EmailInvoiceResult> {
  return sendInvoiceEmail(id, formData, { once: true });
}

async function sendInvoiceEmail(
  id: number,
  formData: FormData,
  { once }: { once: boolean },
): Promise<EmailInvoiceResult> {
  await requireAdmin();
  validId(id);
  const file = formData.get("pdf");
  if (!(file instanceof File)) {
    console.warn(`[invoice email] invoice ${id}: no PDF in the request`);
    return { ok: false, error: "No PDF was uploaded." };
  }

  try {
    const data = await loadInvoiceDocument(id);
    const to = data.clientEmail.trim();
    if (!isValidEmail(to)) {
      console.warn(`[invoice email] invoice ${id}: client email "${to}" is not valid`);
      return { ok: false, error: "This client has no valid email address. Add one with Edit, then send again." };
    }

    if (once && !(await claimInvoiceAutoEmail(id))) {
      console.info(`[invoice email] invoice ${id}: automatic email already sent, skipping duplicate`);
      return { ok: "skipped" };
    }

    await saveInvoicePdf(id, file);
    const origin = await publicOrigin();
    const pdfUrl = origin ? `${origin}/invoice/${invoicePdfToken(id)}` : null;
    const info = await sendMail({
      to: { name: data.clientName, address: to },
      subject: invoiceEmailSubject(data),
      text: invoiceEmailText(data, pdfUrl),
      html: invoiceEmailHtml(data, pdfUrl),
      attachments: [
        {
          filename: invoicePdfFileName(data.invoiceNo, data.clientName),
          content: Buffer.from(await file.arrayBuffer()),
          contentType: "application/pdf",
        },
      ],
    });
    console.info(`[invoice email] invoice ${id} sent to ${to} (${file.size} byte PDF): ${info.response}`);
    return { ok: true, to };
  } catch (error) {
    console.error(`[invoice email] invoice ${id} failed:`, error);
    const message = error instanceof Error ? error.message : "";
    if (/auth|credentials|535|534/i.test(message)) {
      return { ok: false, error: "The email server rejected the login. Check SMTP_USER and SMTP_PASS in .env.local." };
    }
    if (/ENOTFOUND|ECONNREFUSED|ETIMEDOUT|timeout|ECONNRESET/i.test(message)) {
      return { ok: false, error: "Could not reach the email server. Check SMTP_HOST / SMTP_PORT and your connection." };
    }
    return { ok: false, error: message || "Could not send the email. Please try again." };
  }
}

export async function getInvoicePdfDataAction(id: number): Promise<InvoiceData> {
  await requireAdmin();
  validId(id);
  return loadInvoiceDocument(id);
}

async function loadInvoiceDocument(id: number): Promise<InvoiceData> {
  const [invoice, settings, payments] = await Promise.all([
    getInvoiceById(id),
    getInvoiceSettings(),
    listInvoicePayments(id),
  ]);
  if (!invoice) throw new Error("Invoice not found. It may have been deleted.");
  return {
    payments,
    invoiceNo: invoice.invoiceNo,
    invoiceDate: invoice.invoiceDate,
    clientName: invoice.clientName,
    clientMobile: invoice.clientMobile,
    clientEmail: invoice.clientEmail,
    clientCity: invoice.clientCity,
    packageName: invoice.packageName,
    duration: invoice.duration,
    destinations: invoice.destinations,
    travellers: invoice.travellers,
    rooms: invoice.rooms,
    hotel: invoice.hotel,
    stayPlan: invoice.stayPlan,
    includes: invoice.includes,
    charges: invoice.charges,
    advanceReceived: invoice.advanceReceived,
    paymentsReceived: invoice.paymentsReceived,
    paymentDetails: settings.paymentDetails,
  };
}

// ── Invoice payments ─────────────────────────────────────────────────────────

export async function addInvoicePaymentAction(
  invoiceId: number,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  validId(invoiceId);

  const amount = toAmount(formData.get("amount"));
  const paidOn = String(formData.get("paidOn") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim().slice(0, 255);

  if (!(amount > 0)) return { error: "Enter a payment amount greater than 0." };
  if (!isIsoDate(paidOn)) return { error: "Choose a valid payment date." };

  try {
    await insertInvoicePayment(invoiceId, { amount, paidOn, method: "", note });
  } catch (error) {
    return { error: billingError(error) };
  }

  revalidateBilling();
  revalidatePath(`/admin/invoices/${invoiceId}`);
  return { success: `Payment of ₹${formatINR(amount)} recorded.` };
}

export async function deleteInvoicePaymentAction(invoiceId: number, paymentId: number) {
  await requireAdmin();
  validId(invoiceId);
  validId(paymentId);
  try {
    await deleteInvoicePayment(invoiceId, paymentId);
  } catch (error) {
    throw new Error(billingError(error));
  }
  revalidateBilling();
  revalidatePath(`/admin/invoices/${invoiceId}`);
}

// ── Invoice settings ─────────────────────────────────────────────────────────

export async function saveInvoiceSettingsAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const prefix = String(formData.get("prefix") ?? "").trim() || DEFAULT_INVOICE_PREFIX;
  if (!isValidInvoicePrefix(prefix)) {
    return {
      error: "Invoice prefix can be up to 12 letters, numbers, # - or _ (no spaces or /). Example: #NH",
    };
  }

  const paymentDetails = sanitizePaymentDetails(
    Object.fromEntries(paymentDetailFields.map((field) => [field.key, formData.get(field.key)])),
  );

  try {
    await saveInvoiceSettings({ prefix, paymentDetails });
  } catch (error) {
    return { error: billingError(error) };
  }

  revalidatePath("/admin/settings/invoice");
  revalidateBilling();
  return { success: "Invoice settings saved. All invoices now use these details." };
}
