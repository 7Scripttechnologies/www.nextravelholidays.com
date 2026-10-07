import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, MapPin, Pencil, Phone, Plus, ReceiptText } from "lucide-react";
import { deleteCustomerAction } from "@/app/admin/billing-actions";
import AdminShell from "@/components/admin/AdminShell";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import InvoiceTable from "@/components/admin/InvoiceTable";
import Button from "@/components/Button";
import { getCustomerById } from "@/lib/customers-db";
import { formatINR } from "@/lib/invoice";
import { listInvoicesByCustomer } from "@/lib/invoices-db";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Customer — Admin",
  robots: { index: false, follow: false },
};

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customerId = Number(id);
  if (!Number.isInteger(customerId) || customerId < 1) notFound();

  const customer = await getCustomerById(customerId);
  if (!customer) notFound();
  const invoices = await listInvoicesByCustomer(customer.id);

  const billed = invoices.reduce((sum, item) => sum + item.totalAmount, 0);
  const received = invoices.reduce((sum, item) => sum + item.amountReceived, 0);
  const outstanding = invoices.reduce((sum, item) => sum + item.outstanding, 0);

  const details = [
    { icon: Phone, label: "Mobile", value: customer.mobile },
    { icon: Mail, label: "Email", value: customer.email || "—" },
    { icon: MapPin, label: "City", value: customer.city || "—" },
  ];

  return (
    <AdminShell
      title={customer.name}
      activeNav="customers"
      actions={
        <>
          <Button href="/admin/customers" variant="secondary" className="px-5">
            <ArrowLeft className="size-4" />
            Customers
          </Button>
          <Button href={`/admin/customers/${customer.id}/edit`} variant="secondary" className="px-5">
            <Pencil className="size-4" />
            Edit
          </Button>
          <Button
            href={`/admin/invoices/new?customer=${customer.id}`}
            className="shadow-[0_10px_28px_rgba(226,14,23,0.35)]"
          >
            <Plus className="size-4" />
            New invoice
          </Button>
        </>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section className="rounded-[22px] border border-white/[0.07] bg-[#111111] p-5 sm:p-6">
          <h2 className="text-[12px] font-bold tracking-[0.16em] text-[#EDEDED] uppercase">Contact</h2>
          <dl className="mt-4 space-y-3">
            {details.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-white/[0.04] text-[#9A9A9A]">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-[11px] font-semibold tracking-[0.14em] text-[#7A7A7A] uppercase">
                      {item.label}
                    </dt>
                    <dd className="truncate text-sm font-semibold text-[#EDEDED]">{item.value}</dd>
                  </div>
                </div>
              );
            })}
          </dl>
          <div className="mt-5 border-t border-white/[0.07] pt-4">
            <ConfirmDeleteButton
              action={deleteCustomerAction.bind(null, customer.id)}
              confirmMessage={`Delete customer “${customer.name}”? Their invoices are kept.`}
              redirectTo="/admin/customers"
              label="Delete customer"
            />
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3">
          {[
            { label: "Invoices", value: String(invoices.length), className: "text-[#EDEDED]" },
            { label: "Billed (₹)", value: formatINR(billed), className: "text-[#EDEDED]" },
            { label: "Received (₹)", value: formatINR(received), className: "text-emerald-400" },
            {
              label: "Outstanding (₹)",
              value: formatINR(outstanding),
              className: outstanding > 0 ? "text-[#E20E17]" : "text-[#EDEDED]",
            },
          ].map((stat) => (
            <div key={stat.label} className="rounded-[22px] border border-white/[0.07] bg-[#111111] p-4 sm:p-5">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-[#9A9A9A] uppercase">{stat.label}</p>
              <p
                className={cn(
                  "mt-4 truncate text-[22px] leading-none font-extrabold tracking-tight sm:text-[28px]",
                  stat.className,
                )}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </section>
      </div>

      <section className="mt-8">
        <h2 className="mb-4 flex items-center gap-2 text-[12px] font-bold tracking-[0.16em] text-[#EDEDED] uppercase">
          <ReceiptText className="size-4 text-[#E20E17]" />
          Invoices
        </h2>
        {invoices.length === 0 ? (
          <div className="rounded-[22px] border border-dashed border-white/15 bg-[#111111] p-8 text-center text-sm text-muted">
            No invoices for this customer yet.
          </div>
        ) : (
          <InvoiceTable items={invoices} />
        )}
      </section>
    </AdminShell>
  );
}
