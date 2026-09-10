import type { Metadata } from "next";
import AppImage from "@/components/AppImage";
import { CheckCircle2, ImageIcon } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import OptimizeImagesCard from "@/components/admin/OptimizeImagesCard";
import { listPendingImages } from "@/lib/image-optimize";
import { countOrphanUploads } from "@/lib/media-cleanup";
import { formatBytes } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Optimise images — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminOptimiseImagesPage() {
  const pending = await listPendingImages().catch(() => []);
  const unusedCount = await countOrphanUploads().catch(() => 0);
  const totalBytes = pending.reduce((sum, item) => sum + item.bytes, 0);

  return (
    <AdminShell
      title="Optimise images"
      description="Compress pending photos and delete unused uploads that are no longer used on the site."
      activeNav="optimise"
    >
      <OptimizeImagesCard
        imageCount={pending.length}
        totalBytes={totalBytes}
        unusedCount={unusedCount}
      />

      {pending.length > 0 ? (
        <section className="mt-7 sm:mt-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-[12px] font-bold tracking-[0.16em] text-[#EDEDED] uppercase">
              Waiting to optimise
            </h2>
            <p className="text-xs font-medium text-[#9A9A9A]">
              {pending.length} shown · {formatBytes(totalBytes)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4 xl:gap-4">
            {pending.map((item) => (
              <article
                key={item.publicPath}
                className="overflow-hidden rounded-[18px] border border-white/[0.07] bg-[#111111]"
              >
                <div className="relative aspect-[16/10] bg-[#0A0A0A]">
                  <AppImage
                    src={item.publicPath}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="px-3 py-2.5">
                  <p className="truncate text-[12px] font-medium text-[#EDEDED]" title={item.publicPath}>
                    {item.publicPath.split("/").pop()}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-[#7A7A7A]" title={item.publicPath}>
                    {item.publicPath.startsWith("/uploads/") ? "uploads" : "images"} ·{" "}
                    {formatBytes(item.bytes)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <div className="mt-7 rounded-[24px] border border-white/[0.08] bg-[#141414] p-8 text-center sm:mt-8 sm:p-12">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#E20E17]/15 text-[#E20E17]">
            <CheckCircle2 className="size-6" />
          </div>
          <p className="mt-4 text-lg font-bold text-[#EDEDED]">
            {unusedCount > 0 ? "Compression is up to date" : "All images optimised"}
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            {unusedCount > 0
              ? `${unusedCount} unused upload${unusedCount === 1 ? "" : "s"} can be removed with the button above.`
              : "The waiting list is empty. New or replaced photos will show up here until you run optimise again."}
          </p>
          <div className="mt-5 inline-flex items-center gap-2 text-xs text-[#7A7A7A]">
            <ImageIcon className="size-3.5" />
            {unusedCount > 0 ? "Unused files are not shown in this list" : "Nothing left in this list"}
          </div>
        </div>
      )}
    </AdminShell>
  );
}
