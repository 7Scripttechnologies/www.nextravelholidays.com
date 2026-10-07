import type { Metadata } from "next";
import Link from "next/link";
import { BedDouble, Check, Moon, Package, Pencil, Plus, ReceiptText } from "lucide-react";
import { deleteTourPackageAction } from "@/app/admin/billing-actions";
import AdminShell from "@/components/admin/AdminShell";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import DbErrorNotice, { dbErrorMessage } from "@/components/admin/DbErrorNotice";
import Button from "@/components/Button";
import { totalNights } from "@/lib/invoice";
import { listTourPackages, type TourPackageRecord } from "@/lib/tour-packages-db";

export const metadata: Metadata = {
  title: "Tour packages — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminTourPackagesPage() {
  let items: TourPackageRecord[] = [];
  let dbError = "";

  try {
    items = await listTourPackages();
  } catch (error) {
    dbError = dbErrorMessage(error);
  }

  const invoiceTotal = items.reduce((sum, item) => sum + item.invoiceCount, 0);

  return (
    <AdminShell
      title="Tour Packages"
      description="Build reusable trip packages (stay plan, inclusions, duration) and use them to create invoices in seconds."
      activeNav="tour-packages"
      actions={
        <Button
          href="/admin/tour-packages/new"
          className="w-full shrink-0 shadow-[0_10px_28px_rgba(226,14,23,0.35)] sm:w-auto"
        >
          <Plus className="size-4" />
          Build package
        </Button>
      }
    >
      {dbError ? (
        <DbErrorNotice message={dbError} />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 xl:gap-4">
            {[
              { label: "Packages", value: items.length, icon: Package },
              { label: "Invoices created", value: invoiceTotal, icon: ReceiptText },
            ].map((stat) => {
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
                  <p className="mt-4 text-[32px] leading-none font-extrabold tracking-tight text-[#EDEDED]">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          {items.length === 0 ? (
            <div className="mt-7 rounded-[24px] border border-dashed border-white/15 bg-[#111111] p-10 text-center sm:mt-8 sm:p-14">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#E20E17]/15 text-[#E20E17]">
                <Package className="size-6" />
              </div>
              <p className="mt-4 text-lg font-bold text-[#EDEDED]">No tour packages yet</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted">
                Build your first package with a stay plan like Shimla 2N, Manali 3N and what it includes.
              </p>
              <div className="mt-6 flex justify-center">
                <Button href="/admin/tour-packages/new">
                  <Plus className="size-4" />
                  Build package
                </Button>
              </div>
            </div>
          ) : (
            <section className="mt-7 sm:mt-8">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-[12px] font-bold tracking-[0.16em] text-[#EDEDED] uppercase">
                  All packages
                </h2>
                <p className="text-xs font-medium text-[#9A9A9A]">{items.length} total</p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3 xl:gap-5">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="flex flex-col rounded-[22px] border border-white/[0.07] bg-[#111111] p-5 transition hover:border-white/15"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-[17px] font-extrabold tracking-tight text-[#EDEDED]">{item.name}</h3>
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#E20E17]/12 px-2.5 py-1 text-xs font-bold text-[#E20E17]">
                        <Moon className="size-3.5" />
                        {item.duration}
                      </span>
                    </div>

                    <p className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.14em] text-[#9A9A9A] uppercase">
                      <BedDouble className="size-3.5" />
                      Stay plan · {totalNights(item.stayPlan)}N
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.stayPlan.map((stop, index) => (
                        <span
                          key={`${stop.place}-${index}`}
                          className="rounded-lg border border-white/10 bg-black px-2.5 py-1.5 text-xs text-[#EDEDED]"
                        >
                          {stop.place} <strong className="text-[#E20E17]">{stop.nights}N</strong>
                        </span>
                      ))}
                    </div>

                    <p className="mt-4 text-[11px] font-semibold tracking-[0.14em] text-[#9A9A9A] uppercase">
                      Includes
                    </p>
                    <ul className="mt-2 grid flex-1 content-start gap-1.5 text-sm text-[#BDBDBD] sm:grid-cols-2">
                      {item.includes.map((label, index) => (
                        <li key={`${label}-${index}`} className="flex items-start gap-2">
                          <Check className="mt-0.5 size-3.5 shrink-0 text-[#E20E17]" />
                          {label}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/[0.07] pt-3.5">
                      <Link
                        href={`/admin/invoices/new?package=${item.id}`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#E20E17] px-3 py-1.5 text-xs font-semibold text-white transition hover:brightness-110"
                      >
                        <ReceiptText className="size-3.5" />
                        Create invoice
                      </Link>
                      <Link
                        href={`/admin/tour-packages/${item.id}/edit`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs font-semibold text-[#EDEDED] transition hover:border-[#E20E17]/45"
                      >
                        <Pencil className="size-3.5" />
                        Edit
                      </Link>
                      <span className="text-[11px] text-[#7A7A7A]">
                        {item.invoiceCount} invoice{item.invoiceCount === 1 ? "" : "s"}
                      </span>
                      <div className="ml-auto">
                        <ConfirmDeleteButton
                          action={deleteTourPackageAction.bind(null, item.id)}
                          confirmMessage={`Delete package “${item.name}”? Existing invoices keep their details.`}
                        />
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
