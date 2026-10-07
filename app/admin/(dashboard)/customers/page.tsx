import type { Metadata } from "next";
import Link from "next/link";
import { Eye, Pencil, Plus, ReceiptText, Users } from "lucide-react";
import { deleteCustomerAction } from "@/app/admin/billing-actions";
import AdminShell from "@/components/admin/AdminShell";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import DbErrorNotice, { dbErrorMessage } from "@/components/admin/DbErrorNotice";
import SearchBox from "@/components/admin/SearchBox";
import Button from "@/components/Button";
import { listCustomers, type CustomerRecord } from "@/lib/customers-db";

export const metadata: Metadata = {
  title: "Customers — Admin",
  robots: { index: false, follow: false },
};

const actionLinkClass =
  "inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs font-semibold text-[#EDEDED] transition hover:border-[#E20E17]/45";

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { q } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q)?.trim() ?? "";

  let items: CustomerRecord[] = [];
  let dbError = "";

  try {
    items = await listCustomers(query);
  } catch (error) {
    dbError = dbErrorMessage(error);
  }

  return (
    <AdminShell
      title="Customers"
      description="Save customer details once and pick them on any invoice."
      activeNav="customers"
      actions={
        <Button
          href="/admin/customers/new"
          className="w-full shrink-0 shadow-[0_10px_28px_rgba(226,14,23,0.35)] sm:w-auto"
        >
          <Plus className="size-4" />
          Add customer
        </Button>
      }
    >
      {dbError ? (
        <DbErrorNotice message={dbError} />
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchBox action="/admin/customers" query={query} placeholder="Search name, mobile, email or city" />
            <p className="text-xs font-medium text-[#9A9A9A]">
              {items.length} customer{items.length === 1 ? "" : "s"}
              {query ? ` matching “${query}”` : ""}
            </p>
          </div>

          {items.length === 0 ? (
            <div className="mt-6 rounded-[24px] border border-dashed border-white/15 bg-[#111111] p-10 text-center sm:p-14">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#E20E17]/15 text-[#E20E17]">
                <Users className="size-6" />
              </div>
              <p className="mt-4 text-lg font-bold text-[#EDEDED]">
                {query ? "No customers found" : "No customers yet"}
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted">
                {query
                  ? "Try a different name, mobile number or city."
                  : "Add a customer, or tick “Save as customer” while creating an invoice."}
              </p>
              {!query ? (
                <div className="mt-6 flex justify-center">
                  <Button href="/admin/customers/new">
                    <Plus className="size-4" />
                    Add customer
                  </Button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-[22px] border border-white/[0.07] bg-[#111111]">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/[0.07] text-[11px] font-semibold tracking-[0.14em] text-[#9A9A9A] uppercase">
                    <th className="px-5 py-3.5">Name</th>
                    <th className="px-3 py-3.5">Mobile</th>
                    <th className="px-3 py-3.5">Email</th>
                    <th className="px-3 py-3.5">City</th>
                    <th className="px-3 py-3.5 text-center">Invoices</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.02]">
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/admin/customers/${item.id}`}
                          className="font-bold text-[#EDEDED] hover:text-[#E20E17]"
                        >
                          {item.name}
                        </Link>
                      </td>
                      <td className="px-3 py-3.5 text-[#BDBDBD]">{item.mobile}</td>
                      <td className="px-3 py-3.5 text-[#BDBDBD]">{item.email || "—"}</td>
                      <td className="px-3 py-3.5 text-[#BDBDBD]">{item.city || "—"}</td>
                      <td className="px-3 py-3.5 text-center font-semibold text-[#EDEDED]">{item.invoiceCount}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/invoices/new?customer=${item.id}`}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#E20E17] px-3 py-1.5 text-xs font-semibold text-white transition hover:brightness-110"
                          >
                            <ReceiptText className="size-3.5" />
                            Invoice
                          </Link>
                          <Link href={`/admin/customers/${item.id}`} className={actionLinkClass}>
                            <Eye className="size-3.5" />
                            View
                          </Link>
                          <Link href={`/admin/customers/${item.id}/edit`} className={actionLinkClass}>
                            <Pencil className="size-3.5" />
                            Edit
                          </Link>
                          <ConfirmDeleteButton
                            action={deleteCustomerAction.bind(null, item.id)}
                            confirmMessage={`Delete customer “${item.name}”? Their invoices are kept.`}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </AdminShell>
  );
}
