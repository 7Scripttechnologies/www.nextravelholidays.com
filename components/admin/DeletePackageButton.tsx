"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deletePackageAction } from "@/app/admin/actions";

export default function DeletePackageButton({ id, name }: { id: number; name: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(`Delete “${name}”? This cannot be undone.`)) return;
        startTransition(async () => {
          await deletePackageAction(id);
        });
      }}
      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-muted transition hover:border-[#E20E17]/50 hover:text-[#E20E17] disabled:opacity-60"
    >
      <Trash2 className="size-3.5" />
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}
