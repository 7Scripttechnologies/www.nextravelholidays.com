"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toggleGalleryItemActiveAction } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

interface ToggleGalleryActiveButtonProps {
  id: number;
  active: boolean;
  name: string;
}

export default function ToggleGalleryActiveButton({
  id,
  active,
  name,
}: ToggleGalleryActiveButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      title={active ? `Hide ${name}` : `Show ${name}`}
      onClick={() => {
        startTransition(async () => {
          await toggleGalleryItemActiveAction(id, !active);
          router.refresh();
        });
      }}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase transition disabled:opacity-60",
        active
          ? "bg-[#E20E17] text-white shadow-[0_6px_16px_rgba(226,14,23,0.35)] hover:brightness-110"
          : "bg-black/55 text-[#C8C8C8] ring-1 ring-white/20 backdrop-blur-sm hover:text-white",
      )}
    >
      {pending ? "…" : active ? "Active" : "Inactive"}
    </button>
  );
}
