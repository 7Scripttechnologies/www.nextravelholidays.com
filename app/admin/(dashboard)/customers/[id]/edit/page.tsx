import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { updateCustomerAction } from "@/app/admin/billing-actions";
import AdminShell from "@/components/admin/AdminShell";
import CustomerForm from "@/components/admin/CustomerForm";
import { getCustomerById } from "@/lib/customers-db";

export const metadata: Metadata = {
  title: "Edit customer — Admin",
  robots: { index: false, follow: false },
};

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customerId = Number(id);
  if (!Number.isInteger(customerId) || customerId < 1) notFound();

  const record = await getCustomerById(customerId);
  if (!record) notFound();

  return (
    <AdminShell
      title="Edit customer"
      description="Updates are used on new invoices. Existing invoices keep the details they were created with."
      activeNav="customers"
    >
      <CustomerForm mode="edit" initial={record} action={updateCustomerAction.bind(null, record.id)} />
    </AdminShell>
  );
}
