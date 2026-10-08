import type { Metadata } from "next";
import Link from "next/link";
import { CircleDollarSign, HandCoins, Plus, ReceiptText, Wallet } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import DbErrorNotice, { dbErrorMessage } from "@/components/admin/DbErrorNotice";
import InvoiceTable from "@/components/admin/InvoiceTable";
import SearchBox from "@/components/admin/SearchBox";
import Button from "@/components/Button";
import { formatINR, isPaymentStatus, paymentStatusLabels, type PaymentStatus } from "@/lib/invoice";
import { listInvoices, type InvoiceSummary } from "@/lib/invoices-db";
import { cn } from "@/lib/utils";

const statusTabs: Array<{ value: PaymentStatus | ""; label: string }> = [
  { value: "", label: "All" },
  { value: "unpaid", label: paymentStatusLabels.unpaid },
  { value: "partial", label: paymentStatusLabels.partial },
  { value: "paid", label: paymentStatusLabels.paid },
];

function invoicesHref(query: string, status: string) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (status) params.set("status", status);
  const search = params.toString();
  return search ? `/admin/invoices?${search}` : "/admin/invoices";
}

export const metadata: Metadata = {
  title: "Invoices — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminInvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[]; status?: string | string[] }>;
}) {
  const { q, status: statusParam } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q)?.trim() ?? "";
  const rawStatus = (Array.isArray(statusParam) ? statusParam[0] : statusParam) ?? "";
  const status: PaymentStatus | "" = isPaymentStatus(rawStatus) ? rawStatus : "";

  let allItems: InvoiceSummary[] = [];
  let dbError = "";

  try {
    allItems = await listInvoices(query);
  } catch (error) {
    dbError = dbErrorMessage(error);
  }

  const items = status ? allItems.filter((item) => item.status === status) : allItems;
  const countFor = (value: PaymentStatus | "") =>
    value ? allItems.filter((item) => item.status === value).length : allItems.length;

  const billed = items.reduce((sum, item) => sum + item.totalAmount, 0);
  const received = items.reduce((sum, item) => sum + item.amountReceived, 0);

  const stats = [
    { label: "Invoices", value: String(items.length), icon: ReceiptText, valueClass: "text-[#EDEDED]" },
    { label: "Billed (₹)", value: formatINR(billed), icon: CircleDollarSign, valueClass: "text-[#EDEDED]" },
    { label: "Received (₹)", value: formatINR(received), icon: HandCoins, valueClass: "text-emerald-400" },
    {
      label: "Outstanding (₹)",
      value: formatINR(Math.max(0, billed - received)),
      icon: Wallet,
      valueClass: "text-[#E20E17]",
    },
  ];

  return (
    <AdminShell
      title="Invoices"
      description="Create, edit and print invoices. Pick a customer and tour package to fill everything in automatically."
      activeNav="invoices"
      actions={
        <Button
          href="/admin/invoices/new"
          className="w-full shrink-0 shadow-[0_10px_28px_rgba(226,14,23,0.35)] sm:w-auto"
        >
          <Plus className="size-4" />
          New invoice
        </Button>
      }
    >
      {dbError ? (
        <DbErrorNotice message={dbError} />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="rounded-[20px] border border-white/[0.07] bg-[#111111] p-4 sm:rounded-[22px] sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[11px] font-semibold tracking-[0.14em] text-[#9A9A9A] uppercase">
                      {stat.label}
                    </p>
                    <span className="flex size-8 items-center justify-center rounded-lg bg-white/[0.04] text-[#9A9A9A]">
                      <Icon className="size-4" />
                    </span>
                  </div>
                  <p
                    className={cn(
                      "mt-4 truncate text-[24px] leading-none font-extrabold tracking-tight sm:text-[30px]",
                      stat.valueClass,
                    )}
                  >
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchBox
              action="/admin/invoices"
              query={query}
              placeholder="Search invoice no., client or package"
              hiddenParams={{ status }}
            />
            <p className="text-xs font-medium text-[#9A9A9A]">
              {items.length} invoice{items.length === 1 ? "" : "s"}
              {status ? ` · ${paymentStatusLabels[status].toLowerCase()}` : ""}
              {query ? ` matching “${query}”` : ""}
            </p>
          </div>

          <nav className="mt-4 flex flex-wrap gap-2" aria-label="Filter by payment status">
            {statusTabs.map((tab) => {
              const active = tab.value === status;
              return (
                <Link
                  key={tab.label}
                  href={invoicesHref(query, tab.value)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
                    active
                      ? "border-[#E20E17]/50 bg-[#E20E17]/12 text-[#EDEDED]"
                      : "border-white/10 text-[#9A9A9A] hover:border-white/25 hover:text-[#EDEDED]",
                  )}
                >
                  {tab.label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-px text-[10px] tabular-nums",
                      active ? "bg-[#E20E17] text-white" : "bg-white/[0.06] text-[#9A9A9A]",
                    )}
                  >
                    {countFor(tab.value)}
                  </span>
                </Link>
              );
            })}
          </nav>

          {items.length === 0 && status && allItems.length > 0 ? (
            <div className="mt-6 rounded-[24px] border border-dashed border-white/15 bg-[#111111] p-10 text-center text-sm text-muted">
              No {paymentStatusLabels[status].toLowerCase()} invoices
              {query ? ` matching “${query}”` : ""}.{" "}
              <Link href={invoicesHref(query, "")} className="font-semibold text-[#E20E17] hover:underline">
                Show all
              </Link>
            </div>
          ) : items.length === 0 ? (
            <div className="mt-6 rounded-[24px] border border-dashed border-white/15 bg-[#111111] p-10 text-center sm:p-14">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#E20E17]/15 text-[#E20E17]">
                <ReceiptText className="size-6" />
              </div>
              <p className="mt-4 text-lg font-bold text-[#EDEDED]">
                {query ? "No invoices found" : "No invoices yet"}
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted">
                {query
                  ? "Try a different invoice number, client name or package."
                  : "Create your first invoice. Tip: add customers first to save time."}
              </p>
              {!query ? (
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Button href="/admin/invoices/new">
                    <Plus className="size-4" />
                    New invoice
                  </Button>
                  <Button href="/admin/customers/new" variant="secondary">
                    Add customer
                  </Button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mt-6">
              <InvoiceTable items={items} />
            </div>
          )}
        </>
      )}
    </AdminShell>
  );
}
