"use client";

import { useActionState, useState } from "react";
import { CheckCircle2, HandCoins } from "lucide-react";
import type { ActionState } from "@/app/admin/actions";
import { addInvoicePaymentAction, deleteInvoicePaymentAction } from "@/app/admin/billing-actions";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { fieldClass } from "@/components/admin/billing-fields";
import PaymentStatusBadge from "@/components/admin/PaymentStatusBadge";
import Button from "@/components/Button";
import {
  formatINR,
  formatInvoiceDate,
  paymentStatus,
  toAmount,
  type InvoicePayment,
} from "@/lib/invoice";
import { cn } from "@/lib/utils";

interface InvoicePaymentsPanelProps {
  invoiceId: number;
  invoiceDate: string;
  total: number;
  advance: number;
  payments: InvoicePayment[];
  today: string;
}

function PaymentFields({ outstanding, today, pending }: { outstanding: number; today: string; pending: boolean }) {
  const [amount, setAmount] = useState(String(outstanding));
  const [paidOn, setPaidOn] = useState(today);
  const [note, setNote] = useState("");

  const value = toAmount(amount);
  const tooHigh = value > outstanding;
  const remaining = Math.max(0, toAmount(outstanding - value));

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-[#EDEDED]">Amount (₹)</span>
          <input
            name="amount"
            type="number"
            inputMode="decimal"
            min="0.01"
            step="0.01"
            max={outstanding}
            required
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className={cn(fieldClass, "tabular-nums", tooHigh && "border-[#E20E17]")}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-[#EDEDED]">Payment date</span>
          <input
            name="paidOn"
            type="date"
            required
            value={paidOn}
            onChange={(event) => setPaidOn(event.target.value)}
            className={cn(fieldClass, "[color-scheme:dark]")}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-[#EDEDED]">Note (optional)</span>
          <input
            name="note"
            value={note}
            maxLength={255}
            placeholder="e.g. UTR / cheque no."
            onChange={(event) => setNote(event.target.value)}
            className={fieldClass}
          />
        </label>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {[
          { label: "Full balance", value: outstanding },
          { label: "50%", value: toAmount(outstanding / 2) },
        ].map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => setAmount(String(preset.value))}
            className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-muted transition hover:border-[#E20E17]/45 hover:text-[#EDEDED]"
          >
            {preset.label} · ₹{formatINR(preset.value)}
          </button>
        ))}
      </div>

      <p className={cn("mt-3 text-xs", tooHigh ? "text-[#FF5A61]" : "text-muted")}>
        {tooHigh
          ? `Amount is more than the outstanding ₹${formatINR(outstanding)}.`
          : value > 0
            ? remaining > 0
              ? `After this payment ₹${formatINR(remaining)} will still be due (partially paid).`
              : "This payment clears the invoice (fully paid)."
            : "Enter the amount the client paid."}
      </p>

      <Button type="submit" disabled={pending || tooHigh || !(value > 0)} className="mt-4 w-full sm:w-auto">
        <HandCoins className="size-4" />
        {pending ? "Saving..." : "Record payment"}
      </Button>
    </>
  );
}

export default function InvoicePaymentsPanel({
  invoiceId,
  invoiceDate,
  total,
  advance,
  payments,
  today,
}: InvoicePaymentsPanelProps) {
  const [state, formAction, pending] = useActionState(
    addInvoicePaymentAction.bind(null, invoiceId),
    null as ActionState,
  );

  const paidLater = toAmount(payments.reduce((sum, payment) => sum + payment.amount, 0));
  const received = toAmount(advance + paidLater);
  const outstanding = Math.max(0, toAmount(total - received));
  const status = paymentStatus(total, received);
  const percent = total > 0 ? Math.min(100, Math.round((received / total) * 100)) : 100;

  return (
    <section className="rounded-[24px] border border-white/8 bg-[#141414] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[12px] font-bold tracking-[0.16em] text-[#EDEDED] uppercase">Payments</h2>
        <PaymentStatusBadge status={status} />
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
        {[
          { label: "Total", value: total, className: "text-[#EDEDED]" },
          { label: "Received", value: received, className: "text-emerald-400" },
          { label: "Outstanding", value: outstanding, className: outstanding > 0 ? "text-[#FF5A61]" : "text-[#EDEDED]" },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl bg-black/40 px-2 py-3">
            <dt className="text-[10px] font-semibold tracking-[0.14em] text-muted uppercase">{item.label}</dt>
            <dd className={cn("mt-1 truncate text-[15px] font-extrabold tabular-nums sm:text-base", item.className)}>
              ₹{formatINR(item.value)}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-4">
        <div
          className="h-2 overflow-hidden rounded-full bg-white/[0.06]"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Amount received"
        >
          <div
            className={cn(
              "h-full rounded-full transition-[width] duration-500",
              status === "paid" ? "bg-emerald-500" : status === "partial" ? "bg-amber-400" : "bg-[#E20E17]",
            )}
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-1.5 text-right text-xs font-semibold text-muted">{percent}% received</p>
      </div>

      {state?.error ? (
        <p className="mt-4 rounded-2xl border border-[#E20E17]/40 bg-[#E20E17]/10 px-4 py-3 text-sm text-[#EDEDED]">
          {state.error}
        </p>
      ) : null}
      {state?.success ? (
        <p className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-[#EDEDED]">
          {state.success}
        </p>
      ) : null}

      {outstanding > 0 ? (
        <form action={formAction} className="mt-5 border-t border-white/[0.07] pt-5">
          <h3 className="mb-3 text-sm font-bold text-[#EDEDED]">Record a payment</h3>
          <PaymentFields
            key={`${payments.length}-${outstanding}`}
            outstanding={outstanding}
            today={today}
            pending={pending}
          />
        </form>
      ) : (
        <p className="mt-5 flex items-center gap-2 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-300">
          <CheckCircle2 className="size-4 shrink-0" />
          {total > 0 ? "This invoice is fully paid." : "Nothing to collect on this invoice."}
        </p>
      )}

      <div className="mt-6 border-t border-white/[0.07] pt-5">
        <h3 className="text-sm font-bold text-[#EDEDED]">Payment history</h3>
        {advance <= 0 && payments.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No payments received yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-white/[0.06]">
            {advance > 0 ? (
              <li className="flex items-start justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#EDEDED]">Advance</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {formatInvoiceDate(invoiceDate)} · Set on the invoice (use Edit to change)
                  </p>
                </div>
                <p className="shrink-0 text-sm font-bold text-emerald-400 tabular-nums">₹{formatINR(advance)}</p>
              </li>
            ) : null}
            {payments.map((payment) => (
              <li key={payment.id} className="flex items-start justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#EDEDED]">{payment.method || "Payment"}</p>
                  <p className="mt-0.5 text-xs break-words text-muted">
                    {formatInvoiceDate(payment.paidOn)}
                    {payment.note ? ` · ${payment.note}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <p className="text-sm font-bold text-emerald-400 tabular-nums">₹{formatINR(payment.amount)}</p>
                  <ConfirmDeleteButton
                    action={deleteInvoicePaymentAction.bind(null, invoiceId, payment.id)}
                    confirmMessage={`Delete the ₹${formatINR(payment.amount)} payment from ${formatInvoiceDate(payment.paidOn)}?`}
                    label="Remove"
                    className="px-2.5 py-1 text-[11px]"
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
