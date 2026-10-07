"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ConfirmDeleteButton({
  action,
  confirmMessage,
  redirectTo,
  label = "Delete",
  className,
}: {
  action: () => Promise<void>;
  confirmMessage: string;
  redirectTo?: string;
  label?: string;
  className?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(confirmMessage)) return;
        startTransition(async () => {
          try {
            await action();
          } catch (error) {
            window.alert(error instanceof Error ? error.message : "Could not delete. Please try again.");
            return;
          }
          if (redirectTo) router.push(redirectTo);
          router.refresh();
        });
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-muted transition hover:border-[#E20E17]/50 hover:text-[#E20E17] disabled:opacity-60",
        className,
      )}
    >
      <Trash2 className="size-3.5" />
      {pending ? "Deleting..." : label}
    </button>
  );
}
