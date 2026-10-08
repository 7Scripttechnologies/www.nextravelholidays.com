import type { Metadata } from "next";
import { createInvoiceAction } from "@/app/admin/billing-actions";
import AdminShell from "@/components/admin/AdminShell";
import DbErrorNotice, { dbErrorMessage } from "@/components/admin/DbErrorNotice";
import InvoiceForm, { type InvoiceFormInitial } from "@/components/admin/InvoiceForm";
import { listCustomers } from "@/lib/customers-db";
import { todayIso } from "@/lib/invoice";
import { getInvoiceSettings } from "@/lib/invoice-settings-db";
import { getNextInvoiceNo } from "@/lib/invoices-db";

export const metadata: Metadata = {
  title: "New invoice — Admin",
  robots: { index: false, follow: false },
};

function firstParam(value: string | string[] | undefined) {
  const id = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export default async function NewInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ customer?: string | string[] }>;
}) {
  const params = await searchParams;

  let data: Awaited<ReturnType<typeof loadFormData>>;
  try {
    data = await loadFormData();
  } catch (error) {
    return (
      <AdminShell title="New invoice" activeNav="invoices">
        <DbErrorNotice message={dbErrorMessage(error)} />
      </AdminShell>
    );
  }

  const customer = data.customers.find((item) => item.id === firstParam(params.customer)) ?? null;

  const initial: InvoiceFormInitial = {
    invoiceNo: data.invoiceNo,
    invoiceDate: data.today,
    customerId: customer?.id ?? null,
    tourPackageId: null,
    clientName: customer?.name ?? "",
    clientMobile: customer?.mobile ?? "",
    clientEmail: customer?.email ?? "",
    clientCity: customer?.city ?? "",
    packageName: "",
    duration: "",
    destinations: "",
    travellers: "",
    rooms: "",
    hotel: "",
    stayPlan: [],
    includes: [],
    charges: [],
    advanceReceived: 0,
    paymentDetails: data.settings.paymentDetails,
  };

  return (
    <AdminShell
      title="New invoice"
      description="Pick a saved customer or type new details, then fill in the package. Every field stays editable."
      activeNav="invoices"
    >
      <InvoiceForm
        mode="create"
        initial={initial}
        customers={data.customers}
        action={createInvoiceAction}
        cancelHref="/admin/invoices"
        invoicePrefix={data.settings.prefix}
      />
    </AdminShell>
  );
}

async function loadFormData() {
  const today = todayIso();
  const [customers, settings] = await Promise.all([listCustomers(), getInvoiceSettings()]);
  const invoiceNo = await getNextInvoiceNo(settings.prefix, today);
  return {
    customers: customers.map(({ id, name, mobile, email, city }) => ({ id, name, mobile, email, city })),
    invoiceNo,
    today,
    settings,
  };
}
