import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Globe2, MapPin, Package, Pencil, Plus, Sparkles } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import DeletePackageButton from "@/components/admin/DeletePackageButton";
import ToggleActiveButton from "@/components/admin/ToggleActiveButton";
import Button from "@/components/Button";
import { listPackageSummaries, pingMysql } from "@/lib/packages-db";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPackagesPage() {
  let packages: Awaited<ReturnType<typeof listPackageSummaries>> = [];
  let dbError = "";

  try {
    await pingMysql();
    packages = await listPackageSummaries();
  } catch (error) {
    dbError =
      error instanceof Error
        ? error.message
        : "Could not connect to MySQL. Start the database and try again.";
  }

  const total = packages.length;
  const activeCount = packages.filter((item) => item.active).length;
  const inactiveCount = total - activeCount;
  const featuredCount = packages.filter((item) => item.featured).length;

  const stats = [
    { label: "Total packages", value: total, icon: Globe2, valueClass: "text-[#EDEDED]" },
    { label: "Active", value: activeCount, icon: Sparkles, valueClass: "text-[#E20E17]" },
    { label: "Inactive", value: inactiveCount, icon: EyeOff, valueClass: "text-[#9A9A9A]" },
    { label: "Featured", value: featuredCount, icon: Eye, valueClass: "text-[#EDEDED]" },
  ];

  return (
    <AdminShell
      title="Tour packages"
      description="Manage destination cards and package pages shown on the website."
      actions={
        <Button
          href="/admin/packages/new"
          className="w-full shrink-0 shadow-[0_10px_28px_rgba(226,14,23,0.35)] sm:w-auto"
        >
          <Plus className="size-4" />
          New package
        </Button>
      }
    >
      {dbError ? (
        <div className="rounded-[24px] border border-[#E20E17]/40 bg-[#E20E17]/10 p-6 text-sm leading-7 text-[#EDEDED]">
          <p className="font-semibold">MySQL is not connected.</p>
          <p className="mt-2 text-muted">{dbError}</p>
          <p className="mt-3 text-muted">
            Start MySQL with <code className="text-[#EDEDED]">docker compose up -d</code>, then run{" "}
            <code className="text-[#EDEDED]">npm run db:seed</code>.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-4">
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

          {packages.length === 0 ? (
            <div className="mt-7 rounded-[24px] border border-dashed border-white/15 bg-[#111111] p-10 text-center sm:mt-8 sm:p-14">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#E20E17]/15 text-[#E20E17]">
                <Package className="size-6" />
              </div>
              <p className="mt-4 text-lg font-bold text-[#EDEDED]">No packages yet</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted">
                Import sample packages or create a new one to start building your catalog.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Button href="/admin/packages/new">
                  <Plus className="size-4" />
                  New package
                </Button>
              </div>
            </div>
          ) : (
            <section className="mt-7 sm:mt-8">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-[12px] font-bold tracking-[0.16em] text-[#EDEDED] uppercase">
                  All packages
                </h2>
                <p className="text-xs font-medium text-[#9A9A9A]">{total} total</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-5">
                {packages.map((item) => (
                  <article
                    key={item.id}
                    className={cn(
                      "group flex flex-col overflow-hidden rounded-[22px] border border-white/[0.07] bg-[#111111] transition duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:shadow-[0_18px_40px_rgba(0,0,0,0.35)]",
                      !item.active && "opacity-65",
                    )}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#0A0A0A]">
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover transition duration-700 group-hover:scale-[1.04]"
                        unoptimized={/^https?:\/\//i.test(item.image)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <ToggleActiveButton id={item.id} active={item.active} name={item.name} />
                        {item.featured ? (
                          <span className="rounded-full bg-white/18 px-2.5 py-1 text-[11px] font-bold tracking-wide text-white uppercase backdrop-blur-md">
                            Featured
                          </span>
                        ) : null}
                      </div>

                      <span className="absolute right-3 bottom-3 rounded-lg bg-black/65 px-2.5 py-1 text-sm font-bold text-white backdrop-blur-sm">
                        {item.price}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col px-4 pt-3.5 pb-4">
                      <h3 className="line-clamp-1 text-[15px] font-bold tracking-tight text-[#EDEDED]">
                        {item.name}
                      </h3>
                      <p className="mt-0.5 text-[12px] text-[#7A7A7A]">/{item.slug}</p>

                      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[#9A9A9A]">
                        <span className="inline-flex min-w-0 items-center gap-1">
                          <MapPin className="size-3 shrink-0 text-[#E20E17]" />
                          <span className="truncate">{item.location}</span>
                        </span>
                        <span className="shrink-0">{item.duration}</span>
                      </div>

                      <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-white/[0.07] pt-3.5 mt-4">
                        <Link
                          href={`/admin/packages/${item.id}/edit`}
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs font-semibold text-[#EDEDED] transition hover:border-[#E20E17]/45"
                        >
                          <Pencil className="size-3.5" />
                          Edit
                        </Link>
                        <Link
                          href={`/destinations/${item.slug}`}
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs font-semibold text-[#9A9A9A] transition hover:text-[#EDEDED]"
                        >
                          <Eye className="size-3.5" />
                          View
                        </Link>
                        <div className="ml-auto">
                          <DeletePackageButton id={item.id} name={item.name} />
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
