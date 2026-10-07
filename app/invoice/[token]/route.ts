import { NextResponse } from "next/server";
import { invoicePdfFileName } from "@/lib/invoice";
import { invoiceIdFromPdfToken, readInvoicePdf } from "@/lib/invoice-pdf-store";
import { getInvoiceById } from "@/lib/invoices-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function notFound() {
  return new NextResponse("This invoice link is no longer available.", {
    status: 404,
    headers: { "X-Robots-Tag": "noindex, nofollow" },
  });
}

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const invoiceId = invoiceIdFromPdfToken(token);
  if (!invoiceId) return notFound();

  const [invoice, pdf] = await Promise.all([getInvoiceById(invoiceId), readInvoicePdf(invoiceId)]);
  if (!invoice || !pdf) return notFound();

  const fileName = invoicePdfFileName(invoice.invoiceNo, invoice.clientName);
  const asciiName = fileName.replace(/[^\x20-\x7E]+/g, "").replace(/"/g, "") || "Invoice.pdf";

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      // Re-sharing replaces the file, so customers must always get the latest copy.
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
