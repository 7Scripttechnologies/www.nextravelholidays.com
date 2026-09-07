"use client";

import { useActionState } from "react";
import { updateAdminLoginAction, type ActionState } from "@/app/admin/actions";
import Button from "@/components/Button";

interface AdminSettingsFormProps {
  email: string;
}

export default function AdminSettingsForm({ email }: AdminSettingsFormProps) {
  const [state, action, pending] = useActionState(updateAdminLoginAction, null as ActionState);

  return (
    <form
      action={action}
      className="max-w-xl space-y-5 rounded-[24px] border border-white/8 bg-[#111111] p-6 sm:p-8"
    >
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

      <div>
        <label htmlFor="admin-settings-email" className="text-sm font-medium text-[#EDEDED]">
          Login email
        </label>
        <input
          id="admin-settings-email"
          name="email"
          type="email"
          required
          defaultValue={email}
          autoComplete="username"
          className="mt-1.5 w-full rounded-2xl border border-line bg-black px-4 py-3 text-sm text-[#EDEDED] outline-none focus:border-brand"
        />
      </div>

      <div>
        <label htmlFor="admin-settings-current" className="text-sm font-medium text-[#EDEDED]">
          Current password
        </label>
        <input
          id="admin-settings-current"
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1.5 w-full rounded-2xl border border-line bg-black px-4 py-3 text-sm text-[#EDEDED] outline-none focus:border-brand"
        />
        <p className="mt-1.5 text-xs text-muted">Required to confirm any change.</p>
      </div>

      <div>
        <label htmlFor="admin-settings-new" className="text-sm font-medium text-[#EDEDED]">
          New password
        </label>
        <input
          id="admin-settings-new"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          minLength={6}
          className="mt-1.5 w-full rounded-2xl border border-line bg-black px-4 py-3 text-sm text-[#EDEDED] outline-none focus:border-brand"
        />
        <p className="mt-1.5 text-xs text-muted">Leave blank to keep the current password.</p>
      </div>

      <div>
        <label htmlFor="admin-settings-confirm" className="text-sm font-medium text-[#EDEDED]">
          Confirm new password
        </label>
        <input
          id="admin-settings-confirm"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          minLength={6}
          className="mt-1.5 w-full rounded-2xl border border-line bg-black px-4 py-3 text-sm text-[#EDEDED] outline-none focus:border-brand"
        />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save login details"}
      </Button>
    </form>
  );
}
