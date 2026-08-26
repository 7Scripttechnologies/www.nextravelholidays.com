"use client";

import { useActionState } from "react";
import { loginAdmin, type ActionState } from "@/app/admin/actions";
import Button from "@/components/Button";
import Logo from "@/components/Logo";

export default function AdminLoginForm() {
  const [state, action, pending] = useActionState(loginAdmin, null as ActionState);

  return (
    <div className="w-full max-w-md rounded-[28px] border border-line bg-card p-8 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
      <Logo />
      <h1 className="mt-6 text-2xl font-extrabold text-[#EDEDED]">Admin login</h1>
      <p className="mt-2 text-sm text-muted">Sign in to create, edit and delete tour packages.</p>

      <form action={action} className="mt-8 space-y-4">
        {state?.error ? (
          <p className="rounded-2xl border border-[#E20E17]/40 bg-[#E20E17]/10 px-4 py-3 text-sm text-[#EDEDED]">
            {state.error}
          </p>
        ) : null}
        <div>
          <label htmlFor="admin-email" className="text-sm font-medium text-[#EDEDED]">
            Email
          </label>
          <input
            id="admin-email"
            name="email"
            type="email"
            required
            autoComplete="username"
            className="mt-1.5 w-full rounded-2xl border border-line bg-black px-4 py-3 text-sm text-[#EDEDED] outline-none focus:border-brand"
          />
        </div>
        <div>
          <label htmlFor="admin-password" className="text-sm font-medium text-[#EDEDED]">
            Password
          </label>
          <input
            id="admin-password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-1.5 w-full rounded-2xl border border-line bg-black px-4 py-3 text-sm text-[#EDEDED] outline-none focus:border-brand"
          />
        </div>
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Signing in..." : "Log in"}
        </Button>
      </form>
    </div>
  );
}
