import Link from "next/link";
import { Eye, Pencil } from "lucide-react";
import { deleteInvoiceAction } from "@/app/admin/billing-actions";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import InvoicePdfActions from "@/components/admin/InvoicePdfActions";
import PaymentStatusBadge from "@/components/admin/PaymentStatusBadge";
import { formatINR, formatInvoiceDate } from "@/lib/invoice";
import type { InvoiceSummary } from "@/lib/invoices-db";
import { cn } from "@/lib/utils";

const actionLinkClass =
  "inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs font-semibold text-[#EDEDED] transition hover:border-[#E20E17]/45";

export default function InvoiceTable({ items }: { items: InvoiceSummary[] }) {
  return (
    <div className="overflow-x-auto rounded-[22px] border border-white/[0.07] bg-[#111111]">
      <table className="w-full min-w-[1200px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/[0.07] text-[11px] font-semibold tracking-[0.14em] text-[#9A9A9A] uppercase">
            <th className="px-5 py-3.5">Invoice</th>
            <th className="px-3 py-3.5">Client</th>
            <th className="px-3 py-3.5">Package</th>
            <th className="px-3 py-3.5 text-right">Total (₹)</th>
            <th className="px-3 py-3.5 text-right">Received (₹)</th>
            <th className="px-3 py-3.5 text-right">Outstanding (₹)</th>
            <th className="px-3 py-3.5">Status</th>
            <th className="px-5 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const outstanding = item.outstanding;
            return (
              <tr key={item.id} className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.02]">
                <td className="px-5 py-3.5">
                  <Link
                    href={`/admin/invoices/${item.id}`}
                    className="font-bold text-[#EDEDED] hover:text-[#E20E17]"
                  >
                    {item.invoiceNo}
                  </Link>
                  <p className="mt-0.5 text-xs text-[#7A7A7A]">{formatInvoiceDate(item.invoiceDate)}</p>
                </td>
                <td className="px-3 py-3.5">
                  {item.customerId ? (
                    <Link
                      href={`/admin/customers/${item.customerId}`}
                      className="font-semibold text-[#EDEDED] hover:text-[#E20E17]"
                    >
                      {item.clientName}
                    </Link>
                  ) : (
                    <span className="font-semibold text-[#EDEDED]">{item.clientName}</span>
                  )}
                  {item.clientMobile ? (
                    <p className="mt-0.5 text-xs text-[#7A7A7A]">{item.clientMobile}</p>
                  ) : null}
                </td>
                <td className="px-3 py-3.5 text-[#BDBDBD]">{item.packageName}</td>
                <td className="px-3 py-3.5 text-right font-semibold text-[#EDEDED] tabular-nums">
                  {formatINR(item.totalAmount)}
                </td>
                <td className="px-3 py-3.5 text-right font-semibold text-emerald-400 tabular-nums">
                  {formatINR(item.amountReceived)}
                </td>
                <td
                  className={cn(
                    "px-3 py-3.5 text-right font-bold tabular-nums",
                    outstanding > 0 ? "text-[#FF5A61]" : "text-[#7A7A7A]",
                  )}
                >
                  {formatINR(outstanding)}
                </td>
                <td className="px-3 py-3.5">
                  <PaymentStatusBadge status={item.status} />
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/invoices/${item.id}`} className={actionLinkClass}>
                      <Eye className="size-3.5" />
                      View
                    </Link>
                    <Link href={`/admin/invoices/${item.id}/edit`} className={actionLinkClass}>
                      <Pencil className="size-3.5" />
                      Edit
                    </Link>
                    <InvoicePdfActions invoiceId={item.id} showEmail={false} />
                    <ConfirmDeleteButton
                      action={deleteInvoiceAction.bind(null, item.id)}
                      confirmMessage={`Delete invoice ${item.invoiceNo}? This cannot be undone.`}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
