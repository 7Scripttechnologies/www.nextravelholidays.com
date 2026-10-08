"use client";

import { useActionState, useState } from "react";
import type { ActionState } from "@/app/admin/actions";
import { saveInvoiceSettingsAction } from "@/app/admin/billing-actions";
import { FormSection, fieldClass } from "@/components/admin/billing-fields";
import Button from "@/components/Button";
import {
  DEFAULT_INVOICE_PREFIX,
  formatInvoiceNo,
  isValidInvoicePrefix,
  paymentDetailFields,
  type PaymentDetails,
} from "@/lib/invoice";

interface InvoiceSettingsFormProps {
  prefix: string;
  paymentDetails: PaymentDetails;
  today: string;
}

export default function InvoiceSettingsForm({ prefix, paymentDetails, today }: InvoiceSettingsFormProps) {
  const [state, action, pending] = useActionState(saveInvoiceSettingsAction, null as ActionState);
  const [prefixValue, setPrefixValue] = useState(prefix);
  const [payment, setPayment] = useState<PaymentDetails>(paymentDetails);

  const effectivePrefix = prefixValue.trim() || DEFAULT_INVOICE_PREFIX;
  const prefixOk = isValidInvoicePrefix(effectivePrefix);

  return (
    <form action={action} className="max-w-3xl space-y-6">
      {state?.error ? (
        <p className="rounded-2xl border border-[#E20E17]/40 bg-[#E20E17]/10 px-4 py-3 text-sm text-[#EDEDED]">
          {state.error}
        </p>
      ) : null}
      {state?.success ? (
        <p className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-[#EDEDED]">
          {state.success}
        </p>
      ) : null}

      <FormSection
        title="Invoice number"
        description="Numbers are created automatically from the invoice date. The counter restarts at 001 every month."
      >
        <div className="grid gap-4 sm:grid-cols-[220px_minmax(0,1fr)] sm:items-end">
          <label>
            <span className="text-sm font-medium text-[#EDEDED]">Prefix</span>
            <input
              name="prefix"
              value={prefixValue}
              onChange={(event) => setPrefixValue(event.target.value)}
              maxLength={12}
              placeholder={DEFAULT_INVOICE_PREFIX}
              className={fieldClass}
            />
          </label>
          <div className="rounded-xl border border-white/10 bg-black px-4 py-3">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">Example</p>
            <p className="mt-1 font-mono text-sm font-bold text-[#EDEDED]">
              {prefixOk ? formatInvoiceNo(effectivePrefix, today, 1) : "Use letters, numbers, # - or _"}
            </p>
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Payment & contact"
        description="Printed at the bottom of every invoice."
      >
        {(["payment", "contact"] as const).map((group) => (
          <div key={group} className={group === "contact" ? "mt-6" : undefined}>
            <p className="mb-3 text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
              {group === "payment" ? "Payment information" : "Contact details"}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {paymentDetailFields
                .filter((field) => field.group === group)
                .map((field) => (
                  <label key={field.key} className={field.wide ? "block sm:col-span-2" : "block"}>
                    <span className="text-sm font-medium text-[#EDEDED]">{field.label}</span>
                    <input
                      name={field.key}
                      value={payment[field.key]}
                      onChange={(event) =>
                        setPayment((current) => ({ ...current, [field.key]: event.target.value }))
                      }
                      maxLength={160}
                      className={fieldClass}
                    />
                  </label>
                ))}
            </div>
          </div>
        ))}
      </FormSection>

      <Button type="submit" disabled={pending || !prefixOk}>
        {pending ? "Saving..." : "Save invoice settings"}
      </Button>
    </form>
  );
}
