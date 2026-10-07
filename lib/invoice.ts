import { siteConfig } from "@/lib/site";

export type StayStop = { place: string; nights: number };

export type ChargeLine = { description: string; qty: number; rate: number };

export type PaymentDetails = {
  bankName: string;
  accountNo: string;
  accountName: string;
  ifsc: string;
  gpay: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  website: string;
};

export type InvoiceData = {
  invoiceNo: string;
  invoiceDate: string;
  clientName: string;
  clientMobile: string;
  clientEmail: string;
  clientCity: string;
  packageName: string;
  duration: string;
  destinations: string;
  travellers: string;
  rooms: string;
  hotel: string;
  stayPlan: StayStop[];
  includes: string[];
  charges: ChargeLine[];
  advanceReceived: number;
  /** Sum of payments recorded after the invoice was created (on top of the advance). */
  paymentsReceived?: number;
  /** Individual payments behind `paymentsReceived`, oldest first, for the payment history table. */
  payments?: Array<Pick<InvoicePayment, "amount" | "paidOn" | "method" | "note">>;
  paymentDetails: PaymentDetails;
};

export type InvoicePayment = {
  id: number;
  amount: number;
  paidOn: string;
  method: string;
  note: string;
  createdAt: string;
};

export type PaymentStatus = "unpaid" | "partial" | "paid";

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  unpaid: "Unpaid",
  partial: "Partially paid",
  paid: "Paid",
};

export function isPaymentStatus(value: string): value is PaymentStatus {
  return value === "unpaid" || value === "partial" || value === "paid";
}

export function paymentStatus(total: number, received: number): PaymentStatus {
  if (received > 0 && received >= total) return "paid";
  if (received > 0) return "partial";
  return total > 0 ? "unpaid" : "paid";
}

export const DEFAULT_INVOICE_PREFIX = "#NH";

export const paymentDetailFields: Array<{
  key: keyof PaymentDetails;
  label: string;
  group: "payment" | "contact";
}> = [
  { key: "bankName", label: "Bank name", group: "payment" },
  { key: "accountNo", label: "Account no.", group: "payment" },
  { key: "accountName", label: "Account holder name", group: "payment" },
  { key: "ifsc", label: "IFSC code", group: "payment" },
  { key: "gpay", label: "GPay no.", group: "payment" },
  { key: "contactName", label: "Contact name", group: "contact" },
  { key: "contactPhone", label: "Contact no.", group: "contact" },
  { key: "contactEmail", label: "Email", group: "contact" },
  { key: "website", label: "Website", group: "contact" },
];

export function defaultPaymentDetails(): PaymentDetails {
  return {
    bankName: "",
    accountNo: "",
    accountName: siteConfig.founder.name,
    ifsc: "",
    gpay: "+91 88664 86477",
    contactName: siteConfig.founder.name,
    contactPhone: "+91 88664 86477",
    contactEmail: siteConfig.email,
    website: siteConfig.url.replace(/^https?:\/\//, "").replace(/^(?!www\.)/, "www."),
  };
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function isIsoDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  );
}

/** Formats `YYYY-MM-DD` as `01 October 2026` without timezone shifts. */
export function formatInvoiceDate(value: string) {
  const iso = value.slice(0, 10);
  if (!isIsoDate(iso)) return value;
  const [year, month, day] = iso.split("-");
  return `${day} ${MONTHS[Number(month) - 1]} ${year}`;
}

export function todayIso() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

export function toAmount(value: unknown) {
  const number = typeof value === "number" ? value : Number(String(value ?? "").replace(/,/g, ""));
  return Number.isFinite(number) ? round2(number) : 0;
}

export function lineAmount(line: ChargeLine) {
  return round2(toAmount(line.qty) * toAmount(line.rate));
}

export function chargesTotal(charges: ChargeLine[]) {
  return round2(charges.reduce((sum, line) => sum + lineAmount(line), 0));
}

/** Indian digit grouping: 140000 → 1,40,000 */
export function formatINR(value: number) {
  return toAmount(value).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export function totalNights(stayPlan: StayStop[]) {
  return stayPlan.reduce((sum, stop) => sum + (Number.isFinite(stop.nights) ? stop.nights : 0), 0);
}

export function durationFromStayPlan(stayPlan: StayStop[]) {
  const nights = totalNights(stayPlan);
  if (nights <= 0) return "";
  return `${nights} Night${nights === 1 ? "" : "s"}`;
}

export function destinationsFromStayPlan(stayPlan: StayStop[]) {
  return stayPlan
    .map((stop) => stop.place.trim())
    .filter(Boolean)
    .join(", ");
}

export function isValidInvoicePrefix(prefix: string) {
  return /^[A-Za-z0-9#_-]{1,12}$/.test(prefix);
}

/** `#NH` + `2026-10-06` → `#NH/2026/10` */
export function invoiceNoBase(prefix: string, dateIso: string) {
  const [year, month] = dateIso.slice(0, 10).split("-");
  return `${prefix}/${year}/${month}`;
}

/** `#NH/2026/10/001` — the counter restarts every month. */
export function formatInvoiceNo(prefix: string, dateIso: string, sequence: number) {
  return `${invoiceNoBase(prefix, dateIso)}/${String(sequence).padStart(3, "0")}`;
}

export function nextInvoiceSequence(existing: string[], base: string) {
  let max = 0;
  for (const value of existing) {
    if (!value.startsWith(`${base}/`)) continue;
    const number = Number(value.slice(base.length + 1));
    if (Number.isInteger(number) && number > max) max = number;
  }
  return max + 1;
}

/** Browsers use the page title as the "Save as PDF" file name, and `/` is not allowed there. */
export function invoiceFileName(invoiceNo: string) {
  return invoiceNo.replace(/^#/, "").replace(/[/\\]+/g, "-");
}

/** `#NH/2026/10/001` + `Mitul Topiya` → `#NH-2026-10-001 Mitul Topiya.pdf` (`/` is illegal in file names). */
export function invoicePdfFileName(invoiceNo: string, clientName: string) {
  const number = invoiceNo.replace(/[/\\]+/g, "-").replace(/[:*?"<>|]+/g, "").trim();
  const name = clientName.replace(/[/\\:*?"<>|]+/g, " ").replace(/\s+/g, " ").trim();
  return `${[number, name].filter(Boolean).join(" ") || "Invoice"}.pdf`;
}

/** wa.me needs digits only with the country code; bare 10-digit numbers are treated as Indian. */
export function whatsappNumber(mobile: string) {
  const digits = mobile.replace(/\D/g, "").replace(/^0+/, "");
  if (digits.length === 10) return `91${digits}`;
  return digits.length >= 11 ? digits : "";
}

function cleanText(value: unknown, max = 255) {
  return String(value ?? "")
    .trim()
    .slice(0, max);
}

export function sanitizeStayPlan(value: unknown): StayStop[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const record = (item ?? {}) as Record<string, unknown>;
      const nights = Math.round(Number(record.nights));
      return {
        place: cleanText(record.place, 120),
        nights: Number.isFinite(nights) ? Math.min(Math.max(nights, 0), 99) : 0,
      };
    })
    .filter((stop) => stop.place && stop.nights > 0)
    .slice(0, 20);
}

export function sanitizeIncludes(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => cleanText(item, 200))
    .filter(Boolean)
    .slice(0, 40);
}

export function sanitizeCharges(value: unknown): ChargeLine[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const record = (item ?? {}) as Record<string, unknown>;
      return {
        description: cleanText(record.description, 200),
        qty: Math.max(0, toAmount(record.qty)),
        rate: Math.max(0, toAmount(record.rate)),
      };
    })
    .filter((line) => line.description)
    .slice(0, 50);
}

export function sanitizePaymentDetails(value: unknown): PaymentDetails {
  const record = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
  const result = {} as PaymentDetails;
  for (const field of paymentDetailFields) {
    result[field.key] = cleanText(record[field.key], 160);
  }
  return result;
}
