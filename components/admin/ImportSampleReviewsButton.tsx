"use client";

import { useActionState } from "react";
import { importSampleReviewsAction, type ActionState } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

export default function ImportSampleReviewsButton({ compact = false }: { compact?: boolean }) {
  const [state, action, pending] = useActionState(importSampleReviewsAction, null as ActionState);

  return (
    <form action={action} className={cn("flex flex-col", compact ? "items-stretch" : "items-start gap-2")}>
      <button
        type="submit"
        disabled={pending}
        className={cn(
          "rounded-full border border-white/15 bg-transparent px-4 py-2.5 text-sm font-semibold text-[#EDEDED] transition hover:border-[#E20E17]/50 hover:bg-white/[0.03] disabled:opacity-60",
          compact && "whitespace-nowrap",
        )}
      >
        {pending ? "Importing..." : "Import sample reviews"}
      </button>
      {state?.error ? <p className="mt-1.5 text-xs text-[#E20E17]">{state.error}</p> : null}
      {state?.success ? <p className="mt-1.5 text-xs text-muted">{state.success}</p> : null}
    </form>
  );
}
