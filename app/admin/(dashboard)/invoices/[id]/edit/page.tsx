import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { updateInvoiceAction } from "@/app/admin/billing-actions";
import AdminShell from "@/components/admin/AdminShell";
import InvoiceForm from "@/components/admin/InvoiceForm";
import { listCustomers } from "@/lib/customers-db";
import { getInvoiceSettings } from "@/lib/invoice-settings-db";
import { getInvoiceById, listInvoicePayments } from "@/lib/invoices-db";
import { listTourPackages } from "@/lib/tour-packages-db";

export const metadata: Metadata = {
  title: "Edit invoice — Admin",
  robots: { index: false, follow: false },
};

export default async function EditInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoiceId = Number(id);
  if (!Number.isInteger(invoiceId) || invoiceId < 1) notFound();

  const [invoice, customers, packages, settings, payments] = await Promise.all([
    getInvoiceById(invoiceId),
    listCustomers(),
    listTourPackages(),
    getInvoiceSettings(),
    listInvoicePayments(invoiceId),
  ]);
  if (!invoice) notFound();

  return (
    <AdminShell
      title={`Edit ${invoice.invoiceNo}`}
      description="Update any detail. Totals and the preview recalculate automatically."
      activeNav="invoices"
    >
      <InvoiceForm
        mode="edit"
        initial={{ ...invoice, paymentDetails: settings.paymentDetails, payments }}
        customers={customers.map(({ id: customerId, name, mobile, email, city }) => ({
          id: customerId,
          name,
          mobile,
          email,
          city,
        }))}
        packages={packages.map(({ id: packageId, name, duration, stayPlan, includes }) => ({
          id: packageId,
          name,
          duration,
          stayPlan,
          includes,
        }))}
        action={updateInvoiceAction.bind(null, invoice.id)}
        cancelHref={`/admin/invoices/${invoice.id}`}
        invoicePrefix={settings.prefix}
      />
    </AdminShell>
  );
}
