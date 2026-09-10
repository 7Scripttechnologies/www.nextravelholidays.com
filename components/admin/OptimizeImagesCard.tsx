"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImageIcon } from "lucide-react";
import { optimizeAdminImagesAction } from "@/app/admin/actions";
import { cn, formatBytes } from "@/lib/utils";

interface OptimizeImagesCardProps {
  imageCount: number;
  totalBytes: number;
  unusedCount?: number;
  className?: string;
}

export default function OptimizeImagesCard({
  imageCount,
  totalBytes,
  unusedCount = 0,
  className,
}: OptimizeImagesCardProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const hasPending = imageCount > 0;
  const canRun = hasPending || unusedCount > 0;

  return (
    <div
      className={cn(
        "rounded-[22px] border border-white/[0.08] bg-[#141414] p-5 sm:rounded-[24px] sm:p-6",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#E20E17]/40 bg-black text-[#E20E17]">
          <ImageIcon className="size-5" />
        </span>
        <div className="min-w-0">
          <h2 className="text-base font-bold tracking-tight text-[#EDEDED] sm:text-lg">
            Make images load faster
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-[#9A9A9A]">
            {hasPending ? (
              <>
                Photos from a phone or camera are often bigger than a web page needs. This re-saves
                the {imageCount} picture{imageCount === 1 ? "" : "s"} below in a smaller format (
                {formatBytes(totalBytes)} total). After you click, they leave this list. Unused
                uploaded photos that nothing uses anymore are deleted from storage too.
              </>
            ) : unusedCount > 0 ? (
              <>
                All images are already compressed. {unusedCount} unused upload
                {unusedCount === 1 ? "" : "s"} can be removed from storage.
              </>
            ) : (
              <>
                All caught up — nothing waiting to optimise, and no unused uploads. When you upload
                a new photo (or replace an existing file), it will appear here until you run
                optimise. This AI Tool make by{" "}
                <a
                  href="https://www.7scripttechnologies.com/"
                  className="font-semibold underline text-[#E20E17] hover:text-[#1677ff] transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  7Script Technologies PVT LTD
                </a>
                .
              </>
            )}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <button
          type="button"
          disabled={pending || !canRun}
          onClick={() => {
            setError("");
            setSuccess("");
            startTransition(async () => {
              try {
                const result = await optimizeAdminImagesAction();
                if (result?.error) {
                  setError(result.error);
                  return;
                }
                if (result?.success) setSuccess(result.success);
                router.refresh();
              } catch (err) {
                setError(err instanceof Error ? err.message : "Optimise failed. Try again.");
              }
            });
          }}
          className="inline-flex items-center justify-center rounded-full bg-[#E20E17] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(226,14,23,0.28)] transition hover:brightness-110 disabled:opacity-60"
        >
          {pending
            ? "Optimising… please wait"
            : hasPending
              ? "AI - Optimise images"
              : "Remove unused photos"}
        </button>
      </div>

      {error ? <p className="mt-3 text-sm text-[#E20E17]">{error}</p> : null}
      {success ? <p className="mt-3 text-sm text-[#B0B0B0]">{success}</p> : null}
    </div>
  );
}
