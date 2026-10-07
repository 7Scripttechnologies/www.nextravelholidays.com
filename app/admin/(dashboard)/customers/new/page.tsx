import type { Metadata } from "next";
import { createCustomerAction } from "@/app/admin/billing-actions";
import AdminShell from "@/components/admin/AdminShell";
import CustomerForm from "@/components/admin/CustomerForm";

export const metadata: Metadata = {
  title: "Add customer — Admin",
  robots: { index: false, follow: false },
};

export default function NewCustomerPage() {
  return (
    <AdminShell title="Add customer" description="Save a customer to reuse on invoices." activeNav="customers">
      <CustomerForm mode="create" action={createCustomerAction} />
    </AdminShell>
  );
}
