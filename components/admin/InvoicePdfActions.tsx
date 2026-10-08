"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AlertCircle, CheckCircle2, Download, Loader2, Mail, X } from "lucide-react";
import {
  emailInvoiceAction,
  emailNewInvoiceAction,
  getInvoicePdfDataAction,
  shareInvoicePdfAction,
} from "@/app/admin/billing-actions";
import InvoiceDocument from "@/components/admin/InvoiceDocument";
import {
  chargesTotal,
  formatINR,
  invoicePdfFileName,
  toAmount,
  whatsappNumber,
  type InvoiceData,
} from "@/lib/invoice";
import { cn } from "@/lib/utils";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
/** Up to ~1.5 A4 pages of content still reads fine when scaled onto a single page. */
const MAX_SHRINK_RATIO = 1.5;

type Busy = "download" | "whatsapp" | "email" | null;
type RenderJob = { id: number; data: InvoiceData };

function waitForAssets(root: HTMLElement) {
  const images = Array.from(root.querySelectorAll("img")).map((img) =>
    img.complete
      ? img.decode().catch(() => undefined)
      : new Promise<void>((resolve) => {
          img.addEventListener("load", () => resolve(), { once: true });
          img.addEventListener("error", () => resolve(), { once: true });
        }),
  );
  return Promise.all([document.fonts.ready, ...images]);
}

async function elementToPdf(element: HTMLElement, title: string) {
  const [{ toJpeg }, { jsPDF }] = await Promise.all([import("html-to-image"), import("jspdf")]);
  const imageUrl = await toJpeg(element, { quality: 0.95, pixelRatio: 2.5, backgroundColor: "#ffffff" });

  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait", compress: true });
  pdf.setProperties({ title, author: "NexTravel Holidays" });

  const imageHeight = (A4_WIDTH_MM * element.offsetHeight) / element.offsetWidth;
  // Shrink a slightly-too-tall invoice onto one page rather than slicing through its content;
  // only very long invoices (where shrinking would make text unreadable) continue onto more pages.
  if (imageHeight <= A4_HEIGHT_MM * MAX_SHRINK_RATIO) {
    const scale = Math.min(1, A4_HEIGHT_MM / imageHeight);
    const width = A4_WIDTH_MM * scale;
    pdf.addImage(imageUrl, "JPEG", (A4_WIDTH_MM - width) / 2, 0, width, imageHeight * scale);
  } else {
    for (let offset = 0; offset < imageHeight; offset += A4_HEIGHT_MM) {
      if (offset > 0) pdf.addPage();
      pdf.addImage(imageUrl, "JPEG", 0, -offset, A4_WIDTH_MM, imageHeight);
    }
  }
  return pdf.output("blob");
}

function saveBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

function whatsappMessage(data: InvoiceData, pdfUrl: string) {
  const total = chargesTotal(data.charges);
  const received = toAmount(data.advanceReceived + (data.paymentsReceived ?? 0));
  const outstanding = Math.max(0, toAmount(total - received));
  return [
    `Hello ${data.clientName},`,
    "",
    `Here is your invoice ${data.invoiceNo}${data.packageName ? ` for ${data.packageName}` : ""}.`,
    `Total: ₹${formatINR(total)}`,
    `Outstanding: ₹${formatINR(outstanding)}`,
    "",
    "View / download your invoice (PDF):",
    pdfUrl,
    "",
    "Thank you for choosing NexTravel Holidays.",
  ].join("\n");
}

function whatsappUrl(mobile: string, text: string) {
  const number = whatsappNumber(mobile);
  // On a computer go straight to the WhatsApp Web chat; wa.me adds an extra "Continue to chat" page.
  return isTouchDevice()
    ? `https://wa.me/${number}?text=${encodeURIComponent(text)}`
    : `https://web.whatsapp.com/send?phone=${number}&text=${encodeURIComponent(text)}`;
}

function isTouchDevice() {
  return window.matchMedia("(pointer: coarse)").matches;
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

type PreparedPdf = {
  invoice: InvoiceData;
  fileName: string;
  blob: Blob;
  createdAt: number;
  source?: InvoiceData;
  /** Public link once this exact PDF has been uploaded. */
  linkUrl?: string;
};

/** A prepared PDF is reused briefly so hovering then clicking doesn't render it twice. */
const PREPARED_TTL_MS = 60_000;

/**
 * AdminShell renders its header actions twice (desktop and mobile copies are both mounted), so
 * the auto-email claim has to be shared across component instances rather than kept in a ref.
 */
const autoEmailedInvoices = new Set<number>();

type Notice = { tone: "success" | "error" | "info"; text: string };

function NoticeToast({ notice, onClose }: { notice: Notice; onClose: () => void }) {
  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed right-4 bottom-4 z-50 flex max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 text-sm text-[#EDEDED] shadow-[0_18px_40px_rgba(0,0,0,0.55)] print:hidden",
        notice.tone === "success" && "border-emerald-500/40 bg-[#0F1F17]",
        notice.tone === "error" && "border-[#E20E17]/50 bg-[#231012]",
        notice.tone === "info" && "border-white/15 bg-[#161616]",
      )}
    >
      {notice.tone === "success" ? (
        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" />
      ) : notice.tone === "error" ? (
        <AlertCircle className="mt-0.5 size-4 shrink-0 text-[#FF5A61]" />
      ) : (
        <Loader2 className="mt-0.5 size-4 shrink-0 animate-spin text-muted" />
      )}
      <p className="min-w-0 flex-1 break-words">{notice.text}</p>
      <button type="button" onClick={onClose} aria-label="Dismiss" className="text-muted hover:text-[#EDEDED]">
        <X className="size-4" />
      </button>
    </div>,
    document.body,
  );
}

export default function InvoicePdfActions({
  invoiceId,
  data,
  size = "sm",
  autoEmail = false,
  showEmail = true,
}: {
  invoiceId: number;
  /** Pass when the invoice is already loaded to skip the extra server round-trip. */
  data?: InvoiceData;
  size?: "sm" | "lg";
  /** Email the invoice to the client as soon as the page opens (used right after creating it). */
  autoEmail?: boolean;
  showEmail?: boolean;
}) {
  const [busy, setBusy] = useState<Busy>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    if (!notice || notice.tone === "info") return;
    const timer = setTimeout(() => setNotice(null), notice.tone === "success" ? 7000 : 12000);
    return () => clearTimeout(timer);
  }, [notice]);
  const [job, setJob] = useState<RenderJob | null>(null);
  const captureRef = useRef<HTMLDivElement>(null);
  const pendingRef = useRef<{ id: number; resolve: (element: HTMLElement) => void } | null>(null);

  useEffect(() => {
    const element = captureRef.current?.firstElementChild;
    const pending = pendingRef.current;
    if (!job || !pending || pending.id !== job.id || !(element instanceof HTMLElement)) return;
    pendingRef.current = null;
    pending.resolve(element);
  }, [job]);

  function renderOffscreen(invoice: InvoiceData) {
    return new Promise<HTMLElement>((resolve) => {
      const id = Date.now() + Math.random();
      pendingRef.current = { id, resolve };
      setJob({ id, data: invoice });
    });
  }

  async function buildPdf(): Promise<PreparedPdf> {
    const invoice = data ?? (await getInvoicePdfDataAction(invoiceId));
    const fileName = invoicePdfFileName(invoice.invoiceNo, invoice.clientName);
    try {
      const element = await renderOffscreen(invoice);
      await waitForAssets(element);
      const blob = await elementToPdf(element, fileName.replace(/\.pdf$/, ""));
      return { invoice, fileName, blob, createdAt: Date.now(), source: data };
    } finally {
      setJob(null);
    }
  }

  const preparedRef = useRef<PreparedPdf | null>(null);
  const preparingRef = useRef<Promise<PreparedPdf> | null>(null);
  // Keyed by `data` so an invoice refreshed after an edit or payment is never sent stale.
  const [readyFor, setReadyFor] = useState<{ data?: InvoiceData } | null>(null);
  const readyToSend = readyFor !== null && readyFor.data === data;
  const setReadyToSend = (ready: boolean) => setReadyFor(ready ? { data } : null);

  function freshPdf() {
    const prepared = preparedRef.current;
    if (!prepared || prepared.source !== data) return null;
    return Date.now() - prepared.createdAt < PREPARED_TTL_MS ? prepared : null;
  }

  function preparePdf() {
    const prepared = freshPdf();
    if (prepared) return Promise.resolve(prepared);
    preparingRef.current ??= buildPdf()
      .then((pdf) => {
        preparedRef.current = pdf;
        return pdf;
      })
      .finally(() => {
        preparingRef.current = null;
      });
    return preparingRef.current;
  }

  function prefetchPdf() {
    if (!busy) preparePdf().catch(() => undefined);
  }

  function showError(error: unknown) {
    window.alert(error instanceof Error ? error.message : "Could not create the PDF. Please try again.");
  }

  async function handleDownload() {
    if (busy) return;
    setBusy("download");
    try {
      const { blob, fileName } = await preparePdf();
      saveBlob(blob, fileName);
    } catch (error) {
      showError(error);
    } finally {
      setBusy(null);
    }
  }

  async function uploadPdf(pdf: PreparedPdf) {
    if (pdf.linkUrl) return pdf.linkUrl;
    const formData = new FormData();
    formData.set("pdf", new File([pdf.blob], pdf.fileName, { type: "application/pdf" }));
    const { path } = await shareInvoicePdfAction(invoiceId, formData);
    pdf.linkUrl = `${window.location.origin}${path}`;
    return pdf.linkUrl;
  }

  /** Returns false when the popup blocker stopped the chat from opening. */
  function openChat(pdf: PreparedPdf, linkUrl: string) {
    const text = whatsappMessage(pdf.invoice, linkUrl);
    const chatWindow = window.open(whatsappUrl(pdf.invoice.clientMobile, text), "_blank");
    if (!chatWindow) return false;
    try {
      chatWindow.opener = null;
    } catch {
      // Already navigated cross-origin; nothing to detach.
    }
    return true;
  }

  /**
   * Uploads the PDF and opens the customer's chat with a link to it. Everything runs in this tab
   * before the chat opens because Chrome pauses rendering in background tabs.
   */
  async function handleWhatsApp() {
    if (busy) return;

    const prepared = freshPdf();
    if (prepared?.linkUrl) {
      setReadyToSend(false);
      openChat(prepared, prepared.linkUrl);
      return;
    }

    setBusy("whatsapp");
    try {
      const pdf = await preparePdf();
      const linkUrl = await uploadPdf(pdf);
      // The popup blocker only allows a few seconds after the click; if that passed, one more tap opens it.
      if (!openChat(pdf, linkUrl)) setReadyToSend(true);
    } catch (error) {
      showError(error);
    } finally {
      setBusy(null);
    }
  }

  async function sendEmail({ confirmFirst, auto = false }: { confirmFirst: boolean; auto?: boolean }) {
    if (busy) return;
    setBusy("email");
    try {
      setNotice({ tone: "info", text: "Preparing the invoice PDF…" });
      const pdf = await preparePdf();
      const to = pdf.invoice.clientEmail.trim();
      if (!to) {
        setNotice({ tone: "error", text: "This client has no email address. Add one with Edit, then send again." });
        return;
      }
      if (confirmFirst && !window.confirm(`Email invoice ${pdf.invoice.invoiceNo} to ${to}?`)) {
        setNotice(null);
        return;
      }

      setNotice({ tone: "info", text: `Emailing the invoice to ${to}…` });
      const formData = new FormData();
      formData.set("pdf", new File([pdf.blob], pdf.fileName, { type: "application/pdf" }));
      const result = await (auto ? emailNewInvoiceAction : emailInvoiceAction)(invoiceId, formData);
      if (result.ok === "skipped") {
        setNotice(null);
      } else if (result.ok) {
        setNotice({ tone: "success", text: `Invoice emailed to ${result.to}.` });
      } else {
        setNotice({ tone: "error", text: result.error });
      }
    } catch (error) {
      setNotice({
        tone: "error",
        text: error instanceof Error ? error.message : "Could not email the invoice. Please try again.",
      });
    } finally {
      setBusy(null);
    }
  }

  useEffect(() => {
    if (!autoEmail || autoEmailedInvoices.has(invoiceId)) return;
    autoEmailedInvoices.add(invoiceId);
    // Drop `?email=1` so refreshing the page doesn't email the client again.
    window.history.replaceState(window.history.state, "", window.location.pathname);
    void Promise.resolve().then(() => sendEmail({ confirmFirst: false, auto: true }));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once per invoice
  }, [autoEmail, invoiceId]);

  const large = size === "lg";
  const baseClass = large
    ? "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-60"
    : "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition disabled:pointer-events-none disabled:opacity-60";
  const iconClass = large ? "size-4" : "size-3.5";

  return (
    <>
      <button
        type="button"
        onClick={handleDownload}
        disabled={busy !== null}
        title="Download PDF"
        className={cn(
          baseClass,
          large
            ? "bg-[#E20E17] text-[#EDEDED] shadow-[0_10px_28px_rgba(226,14,23,0.35)] hover:brightness-110"
            : "border-white/10 bg-white/[0.02] text-[#EDEDED] hover:border-[#E20E17]/45",
        )}
      >
        {busy === "download" ? <Loader2 className={cn(iconClass, "animate-spin")} /> : <Download className={iconClass} />}
        {large ? "Download PDF" : "PDF"}
      </button>
      <button
        type="button"
        onClick={handleWhatsApp}
        onPointerEnter={prefetchPdf}
        onFocus={prefetchPdf}
        disabled={busy !== null}
        title="Send invoice PDF link on WhatsApp"
        className={cn(
          baseClass,
          large
            ? "border border-[#25D366]/40 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20"
            : "border-[#25D366]/30 bg-[#25D366]/[0.06] text-[#25D366] hover:border-[#25D366]/60",
          readyToSend && "animate-pulse border-[#25D366] bg-[#25D366] text-white hover:bg-[#25D366]",
        )}
      >
        {busy === "whatsapp" ? (
          <Loader2 className={cn(iconClass, "animate-spin")} />
        ) : (
          <WhatsAppIcon className={iconClass} />
        )}
        {readyToSend ? "Tap to send" : "WhatsApp"}
      </button>
      {showEmail ? (
        <button
          type="button"
          onClick={() => sendEmail({ confirmFirst: true })}
          onPointerEnter={prefetchPdf}
          disabled={busy !== null}
          title="Email the invoice PDF to the client"
          className={cn(
            baseClass,
            large
              ? "border border-sky-400/40 bg-sky-400/10 text-sky-300 hover:bg-sky-400/20"
              : "border-sky-400/30 bg-sky-400/[0.06] text-sky-300 hover:border-sky-400/60",
          )}
        >
          {busy === "email" ? <Loader2 className={cn(iconClass, "animate-spin")} /> : <Mail className={iconClass} />}
          Email
        </button>
      ) : null}

      {notice ? <NoticeToast notice={notice} onClose={() => setNotice(null)} /> : null}

      {job
        ? createPortal(
            <div
              ref={captureRef}
              aria-hidden="true"
              className="pointer-events-none fixed top-0 left-[-10000px] print:hidden"
            >
              <InvoiceDocument data={job.data} />
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
