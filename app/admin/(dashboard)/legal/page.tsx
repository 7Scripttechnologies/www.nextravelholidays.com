import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Pencil, Shield } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { getLegalPage } from "@/lib/legal";
import { pingMysql } from "@/lib/packages-db";

export const metadata: Metadata = {
  title: "Legal — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLegalPage() {
  let dbError = "";
  let termsTitle = "Terms & Conditions";
  let privacyTitle = "Privacy Policy";
  let termsUpdated = "";
  let privacyUpdated = "";

  try {
    await pingMysql();
    const [terms, privacy] = await Promise.all([getLegalPage("terms"), getLegalPage("privacy")]);
    termsTitle = terms.title;
    privacyTitle = privacy.title;
    termsUpdated = terms.lastUpdated;
    privacyUpdated = privacy.lastUpdated;
  } catch (error) {
    dbError =
      error instanceof Error
        ? error.message
        : "Could not connect to MySQL. Start the database and try again.";
  }

  const cards = [
    {
      href: "/admin/legal/terms",
      title: termsTitle,
      updated: termsUpdated,
      icon: FileText,
      publicHref: "/terms",
    },
    {
      href: "/admin/legal/privacy",
      title: privacyTitle,
      updated: privacyUpdated,
      icon: Shield,
      publicHref: "/privacy",
    },
  ];

  return (
    <AdminShell
      title="Legal"
      description="Edit Terms & Conditions and Privacy Policy shown on the website."
      activeNav="legal"
    >
      {dbError ? (
        <div className="rounded-[24px] border border-[#E20E17]/40 bg-[#E20E17]/10 p-6 text-sm leading-7 text-[#EDEDED]">
          <p className="font-semibold">MySQL is not connected.</p>
          <p className="mt-2 text-muted">{dbError}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:gap-5">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <article
                key={card.href}
                className="flex flex-col rounded-[22px] border border-white/[0.07] bg-[#111111] p-5 sm:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-[#E20E17]/15 text-[#E20E17]">
                    <Icon className="size-5" />
                  </span>
                  <Link
                    href={card.publicHref}
                    target="_blank"
                    className="text-xs font-semibold text-[#9A9A9A] transition hover:text-[#EDEDED]"
                  >
                    View page
                  </Link>
                </div>
                <h2 className="mt-4 text-lg font-bold text-[#EDEDED]">{card.title}</h2>
                <p className="mt-1 text-sm text-muted">
                  {card.updated ? `Last updated: ${card.updated}` : "Ready to edit"}
                </p>
                <div className="mt-5">
                  <Link
                    href={card.href}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs font-semibold text-[#EDEDED] transition hover:border-[#E20E17]/45"
                  >
                    <Pencil className="size-3.5" />
                    Edit
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}
