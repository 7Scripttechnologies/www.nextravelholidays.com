import type { Metadata } from "next";
import AppImage from "@/components/AppImage";
import Link from "next/link";
import { Eye, EyeOff, MessageSquareQuote, Pencil, Plus, Star } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import DeleteReviewButton from "@/components/admin/DeleteReviewButton";
import ImportSampleReviewsButton from "@/components/admin/ImportSampleReviewsButton";
import ToggleReviewActiveButton from "@/components/admin/ToggleReviewActiveButton";
import Button from "@/components/Button";
import { pingMysql } from "@/lib/packages-db";
import { listReviews } from "@/lib/reviews-db";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Reviews — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminReviewsPage() {
  let items: Awaited<ReturnType<typeof listReviews>> = [];
  let dbError = "";

  try {
    await pingMysql();
    items = await listReviews({ includeInactive: true });
  } catch (error) {
    dbError =
      error instanceof Error
        ? error.message
        : "Could not connect to MySQL. Start the database and try again.";
  }

  const total = items.length;
  const activeCount = items.filter((item) => item.active).length;
  const inactiveCount = total - activeCount;

  const stats = [
    { label: "Total reviews", value: total, icon: MessageSquareQuote, valueClass: "text-[#EDEDED]" },
    { label: "Active", value: activeCount, icon: Eye, valueClass: "text-[#E20E17]" },
    { label: "Inactive", value: inactiveCount, icon: EyeOff, valueClass: "text-[#9A9A9A]" },
  ];

  return (
    <AdminShell
      title="Reviews"
      description="Manage traveler reviews shown on the homepage and destinations page."
      activeNav="reviews"
      actions={
        <>
          <ImportSampleReviewsButton compact />
          <Button
            href="/admin/reviews/new"
            className="w-full shrink-0 shadow-[0_10px_28px_rgba(226,14,23,0.35)] sm:w-auto"
          >
            <Plus className="size-4" />
            Add review
          </Button>
        </>
      }
    >
      {dbError ? (
        <div className="rounded-[24px] border border-[#E20E17]/40 bg-[#E20E17]/10 p-6 text-sm leading-7 text-[#EDEDED]">
          <p className="font-semibold">MySQL is not connected.</p>
          <p className="mt-2 text-muted">{dbError}</p>
          <p className="mt-3 text-muted">
            Start MySQL locally, then run <code className="text-[#EDEDED]">npm run db:seed</code>.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="rounded-[20px] border border-white/[0.07] bg-[#111111] p-4 sm:rounded-[22px] sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[11px] font-semibold tracking-[0.14em] text-[#9A9A9A] uppercase">
                      {stat.label}
                    </p>
                    <span className="flex size-8 items-center justify-center rounded-lg bg-white/[0.04] text-[#9A9A9A]">
                      <Icon className="size-4" />
                    </span>
                  </div>
                  <p className={cn("mt-4 text-[32px] leading-none font-extrabold tracking-tight", stat.valueClass)}>
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          {items.length === 0 ? (
            <div className="mt-7 rounded-[24px] border border-dashed border-white/15 bg-[#111111] p-10 text-center sm:mt-8 sm:p-14">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#E20E17]/15 text-[#E20E17]">
                <MessageSquareQuote className="size-6" />
              </div>
              <p className="mt-4 text-lg font-bold text-[#EDEDED]">No reviews yet</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted">
                Import sample reviews or add a new one for the homepage carousel.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Button href="/admin/reviews/new">
                  <Plus className="size-4" />
                  Add review
                </Button>
              </div>
            </div>
          ) : (
            <section className="mt-7 sm:mt-8">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-[12px] font-bold tracking-[0.16em] text-[#EDEDED] uppercase">
                  All reviews
                </h2>
                <p className="text-xs font-medium text-[#9A9A9A]">{total} total</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-5">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className={cn(
                      "group flex flex-col overflow-hidden rounded-[22px] border border-white/[0.07] bg-[#111111] transition duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:shadow-[0_18px_40px_rgba(0,0,0,0.35)]",
                      !item.active && "opacity-65",
                    )}
                  >
                    <div className="flex flex-1 flex-col px-4 pt-4 pb-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <AppImage
                            src={item.avatar}
                            alt=""
                            width={44}
                            height={44}
                            className="size-11 rounded-full object-cover ring-2 ring-[#E20E17]/40"
                          />
                          <div>
                            <h3 className="text-[15px] font-bold tracking-tight text-[#EDEDED]">
                              {item.name}
                            </h3>
                            <p className="text-[12px] text-[#7A7A7A]">{item.type}</p>
                          </div>
                        </div>
                        <ToggleReviewActiveButton id={item.id} active={item.active} name={item.name} />
                      </div>

                      <div className="mt-3 inline-flex items-center gap-0.5 text-[#E20E17]">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            className={cn(
                              "size-3.5",
                              index < item.rating
                                ? "fill-[#E20E17] text-[#E20E17]"
                                : "fill-transparent text-white/20",
                            )}
                          />
                        ))}
                      </div>

                      {item.title ? (
                        <p className="mt-3 text-sm font-bold text-[#EDEDED]">{item.title}</p>
                      ) : null}
                      <p className={cn("line-clamp-4 text-sm leading-6 text-[#9A9A9A]", item.title ? "mt-1.5" : "mt-3")}>
                        {item.quote}
                      </p>
                      <p className="mt-3 text-[12px] text-[#7A7A7A]">Order {item.sortOrder}</p>

                      <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-white/[0.07] pt-3.5 mt-4">
                        <Link
                          href={`/admin/reviews/${item.id}/edit`}
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs font-semibold text-[#EDEDED] transition hover:border-[#E20E17]/45"
                        >
                          <Pencil className="size-3.5" />
                          Edit
                        </Link>
                        <div className="ml-auto">
                          <DeleteReviewButton id={item.id} name={item.name} />
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </AdminShell>
  );
}
