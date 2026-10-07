import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import DbErrorNotice, { dbErrorMessage } from "@/components/admin/DbErrorNotice";
import InvoiceSettingsForm from "@/components/admin/InvoiceSettingsForm";
import { todayIso } from "@/lib/invoice";
import { getInvoiceSettings, type InvoiceSettings } from "@/lib/invoice-settings-db";

export const metadata: Metadata = {
  title: "Invoice settings — Settings",
  robots: { index: false, follow: false },
};

export default async function InvoiceSettingsPage() {
  let settings: InvoiceSettings | null = null;
  let loadError = "";
  try {
    settings = await getInvoiceSettings();
  } catch (error) {
    loadError = dbErrorMessage(error);
  }

  return (
    <AdminShell
      title="Invoice settings"
      description="Invoice numbering and the payment & contact details printed on every invoice."
      activeNav="settings"
    >
      {settings ? (
        <InvoiceSettingsForm
          prefix={settings.prefix}
          paymentDetails={settings.paymentDetails}
          today={todayIso()}
        />
      ) : (
        <DbErrorNotice message={loadError} />
      )}
    </AdminShell>
  );
}
