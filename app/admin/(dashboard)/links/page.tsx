import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import SiteLinksForm from "@/components/admin/SiteLinksForm";
import { saveSiteContactAction } from "@/app/admin/actions";
import { pingMysql } from "@/lib/packages-db";
import { getSiteContact } from "@/lib/site-contact-get";

export const metadata: Metadata = {
  title: "Links — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLinksPage() {
  let dbError = "";
  let contact = await getSiteContact();

  try {
    await pingMysql();
    contact = await getSiteContact();
  } catch (error) {
    dbError =
      error instanceof Error
        ? error.message
        : "Could not connect to MySQL. Start the database and try again.";
  }

  return (
    <AdminShell
      title="Links"
      description="Change social media URLs, the contact phone number, and the service area shown in the footer."
      activeNav="links"
    >
      {dbError ? (
        <div className="rounded-[24px] border border-[#E20E17]/40 bg-[#E20E17]/10 p-6 text-sm leading-7 text-[#EDEDED]">
          <p className="font-semibold">MySQL is not connected.</p>
          <p className="mt-2 text-muted">{dbError}</p>
        </div>
      ) : (
        <SiteLinksForm initial={contact} action={saveSiteContactAction} />
      )}
    </AdminShell>
  );
}
