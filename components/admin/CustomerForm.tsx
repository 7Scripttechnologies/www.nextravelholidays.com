"use client";

import { useActionState, useState } from "react";
import type { ActionState } from "@/app/admin/actions";
import { FormSection, fieldClass } from "@/components/admin/billing-fields";
import Button from "@/components/Button";
import type { CustomerRecord } from "@/lib/customers-db";

interface CustomerFormProps {
  mode: "create" | "edit";
  initial?: CustomerRecord;
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
}

export default function CustomerForm({ mode, initial, action }: CustomerFormProps) {
  const [state, formAction, pending] = useActionState(action, null);
  const [values, setValues] = useState({
    name: initial?.name ?? "",
    mobile: initial?.mobile ?? "",
    email: initial?.email ?? "",
    city: initial?.city ?? "",
  });

  const bind = (key: keyof typeof values) => ({
    name: key,
    value: values[key],
    onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
      setValues((current) => ({ ...current, [key]: event.target.value })),
  });

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      {state?.error ? (
        <p className="rounded-2xl border border-[#E20E17]/40 bg-[#E20E17]/10 px-4 py-3 text-sm text-[#EDEDED]">
          {state.error}
        </p>
      ) : null}

      <FormSection
        title="Customer details"
        description="Saved customers can be picked on an invoice to fill in client details automatically."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <span className="text-sm font-medium text-[#EDEDED]">Customer name</span>
            <input
              {...bind("name")}
              required
              maxLength={255}
              autoComplete="off"
              placeholder="Full name"
              className={fieldClass}
            />
          </label>

          <label>
            <span className="text-sm font-medium text-[#EDEDED]">Mobile no.</span>
            <input
              {...bind("mobile")}
              type="tel"
              inputMode="tel"
              required
              maxLength={32}
              autoComplete="off"
              placeholder="+91 98765 43210"
              className={fieldClass}
            />
          </label>

          <label>
            <span className="text-sm font-medium text-[#EDEDED]">Email</span>
            <input
              {...bind("email")}
              type="email"
              maxLength={255}
              autoComplete="off"
              placeholder="name@example.com"
              className={fieldClass}
            />
          </label>

          <label>
            <span className="text-sm font-medium text-[#EDEDED]">City</span>
            <input
              {...bind("city")}
              maxLength={128}
              autoComplete="off"
              placeholder="Ahmedabad"
              className={fieldClass}
            />
          </label>
        </div>
      </FormSection>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : mode === "create" ? "Save customer" : "Save changes"}
        </Button>
        <Button href={initial ? `/admin/customers/${initial.id}` : "/admin/customers"} variant="secondary">
          Cancel
        </Button>
      </div>
    </form>
  );
}
