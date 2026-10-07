import { validateCustomer } from "@/lib/customer-form";
import {
  chargesTotal,
  isIsoDate,
  sanitizeCharges,
  sanitizeIncludes,
  sanitizeStayPlan,
  toAmount,
} from "@/lib/invoice";
import type { InvoiceInput } from "@/lib/invoices-db";

/** Invoice number and payment details come from Settings, not from the form. */
export type InvoiceFormData = Omit<InvoiceInput, "invoiceNo" | "paymentDetails">;

function text(record: Record<string, unknown>, key: string, max = 255) {
  return String(record[key] ?? "")
    .trim()
    .slice(0, max);
}

function optionalId(value: unknown) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export function parseInvoiceForm(
  formData: FormData,
):
  | { ok: true; data: InvoiceFormData; saveCustomer: boolean }
  | { ok: false; error: string } {
  let payload: Record<string, unknown>;
  try {
    const parsed = JSON.parse(String(formData.get("payload") ?? "{}"));
    payload = parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return { ok: false, error: "Could not read the invoice form. Please try again." };
  }

  const invoiceDate = text(payload, "invoiceDate", 10);
  const clientName = text(payload, "clientName");
  const clientMobile = text(payload, "clientMobile", 32);
  const clientEmail = text(payload, "clientEmail");
  const clientCity = text(payload, "clientCity", 128);
  const packageName = text(payload, "packageName");
  const charges = sanitizeCharges(payload.charges);
  const advanceReceived = toAmount(payload.advanceReceived);
  const saveCustomer = payload.saveCustomer === true;

  if (!isIsoDate(invoiceDate)) return { ok: false, error: "Choose a valid invoice date." };
  if (!clientName) return { ok: false, error: "Client name is required." };
  if (!packageName) return { ok: false, error: "Package name is required." };
  if (charges.length === 0) {
    return { ok: false, error: "Add at least one charge line with a description." };
  }
  if (charges.some((line) => line.qty <= 0)) {
    return { ok: false, error: "Each charge line needs a quantity greater than 0." };
  }

  const total = chargesTotal(charges);
  if (total > 9_999_999_999) return { ok: false, error: "Total amount is too large." };
  if (advanceReceived < 0) return { ok: false, error: "Advance received cannot be negative." };
  if (advanceReceived > total) {
    return { ok: false, error: "Advance received cannot be more than the total amount." };
  }

  if (saveCustomer) {
    const customerCheck = validateCustomer({
      name: clientName,
      mobile: clientMobile,
      email: clientEmail,
      city: clientCity,
    });
    if (!customerCheck.ok) return { ok: false, error: `Save customer: ${customerCheck.error}` };
  }

  return {
    ok: true,
    saveCustomer,
    data: {
      invoiceDate,
      customerId: optionalId(payload.customerId),
      tourPackageId: optionalId(payload.tourPackageId),
      clientName,
      clientMobile,
      clientEmail,
      clientCity,
      packageName,
      duration: text(payload, "duration", 128),
      destinations: text(payload, "destinations", 500),
      travellers: text(payload, "travellers"),
      rooms: text(payload, "rooms", 128),
      hotel: text(payload, "hotel", 128),
      stayPlan: sanitizeStayPlan(payload.stayPlan),
      includes: sanitizeIncludes(payload.includes),
      charges,
      advanceReceived,
    },
  };
}
