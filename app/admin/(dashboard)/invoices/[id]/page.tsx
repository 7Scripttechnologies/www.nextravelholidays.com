import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { deleteInvoiceAction } from "@/app/admin/billing-actions";
import AdminShell from "@/components/admin/AdminShell";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import InvoiceDocument from "@/components/admin/InvoiceDocument";
import InvoicePaymentsPanel from "@/components/admin/InvoicePaymentsPanel";
import InvoicePdfActions from "@/components/admin/InvoicePdfActions";
import PrintInvoiceButton from "@/components/admin/PrintInvoiceButton";
import ScaledPreview from "@/components/admin/ScaledPreview";
import Button from "@/components/Button";
import { invoicePdfFileName, todayIso, type InvoiceData } from "@/lib/invoice";
import { getInvoiceSettings } from "@/lib/invoice-settings-db";
import { getInvoiceById, listInvoicePayments } from "@/lib/invoices-db";

type Params = { params: Promise<{ id: string }> };

async function loadInvoice(id: string) {
  const invoiceId = Number(id);
  if (!Number.isInteger(invoiceId) || invoiceId < 1) return null;
  return getInvoiceById(invoiceId);
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const invoice = await loadInvoice(id).catch(() => null);
  return {
    // Browsers use the page title as the default "Save as PDF" file name.
    title: {
      absolute: invoice
        ? invoicePdfFileName(invoice.invoiceNo, invoice.clientName).replace(/\.pdf$/, "")
        : "Invoice — Admin",
    },
    robots: { index: false, follow: false },
  };
}

export default async function InvoiceDetailPage({
  params,
  searchParams,
}: Params & { searchParams: Promise<{ email?: string | string[] }> }) {
  const [{ id }, { email }] = await Promise.all([params, searchParams]);
  const [invoice, settings] = await Promise.all([loadInvoice(id), getInvoiceSettings()]);
  if (!invoice) notFound();
  const payments = await listInvoicePayments(invoice.id);
  const documentData: InvoiceData = { ...invoice, paymentDetails: settings.paymentDetails, payments };

  return (
    <AdminShell
      title={`Invoice ${invoice.invoiceNo}`}
      activeNav="invoices"
      actions={
        <>
          <Button href="/admin/invoices" variant="secondary" className="px-5">
            <ArrowLeft className="size-4" />
            Invoices
          </Button>
          <Button href={`/admin/invoices/${invoice.id}/edit`} variant="secondary" className="px-5">
            <Pencil className="size-4" />
            Edit
          </Button>
          <PrintInvoiceButton />
          <InvoicePdfActions invoiceId={invoice.id} data={documentData} size="lg" autoEmail={email === "1"} />
        </>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-start print:block">
        <div className="mx-auto w-full max-w-[210mm] print:max-w-none">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white shadow-[0_24px_60px_rgba(0,0,0,0.45)] print:rounded-none print:border-0 print:shadow-none">
            <ScaledPreview>
              <InvoiceDocument data={documentData} />
            </ScaledPreview>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 print:hidden">
            <p className="text-xs text-muted">
              “Email” sends the PDF and trip details to the client. “WhatsApp” opens their chat with a secure PDF
              link.
            </p>
            <ConfirmDeleteButton
              action={deleteInvoiceAction.bind(null, invoice.id)}
              confirmMessage={`Delete invoice ${invoice.invoiceNo}? This cannot be undone.`}
              redirectTo="/admin/invoices"
              label="Delete invoice"
            />
          </div>
        </div>

        <div className="print:hidden">
          <InvoicePaymentsPanel
            invoiceId={invoice.id}
            invoiceDate={invoice.invoiceDate}
            total={invoice.totalAmount}
            advance={invoice.advanceReceived}
            payments={payments}
            today={todayIso()}
          />
        </div>
      </div>
    </AdminShell>
  );
}
