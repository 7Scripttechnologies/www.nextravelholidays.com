import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import SiteImagesForm from "@/components/admin/SiteImagesForm";
import { saveSiteImagesAction } from "@/app/admin/actions";
import { pingMysql } from "@/lib/packages-db";
import { getSiteImages } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "7script — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPhotosPage() {
  let dbError = "";
  let siteImages = await getSiteImages();

  try {
    await pingMysql();
    siteImages = await getSiteImages();
  } catch (error) {
    dbError =
      error instanceof Error
        ? error.message
        : "Could not connect to MySQL. Start the database and try again.";
  }

  return (
    <AdminShell
      title="7script"
      description="Change homepage, about, destinations, gallery and contact photos in one place."
      activeNav="7script"
    >
      {dbError ? (
        <div className="rounded-[24px] border border-[#E20E17]/40 bg-[#E20E17]/10 p-6 text-sm leading-7 text-[#EDEDED]">
          <p className="font-semibold">MySQL is not connected.</p>
          <p className="mt-2 text-muted">{dbError}</p>
          <p className="mt-3 text-muted">
            7script needs MySQL. Start XAMPP MySQL, then refresh this page.
          </p>
        </div>
      ) : (
        <SiteImagesForm initial={siteImages} action={saveSiteImagesAction} />
      )}
    </AdminShell>
  );
}
