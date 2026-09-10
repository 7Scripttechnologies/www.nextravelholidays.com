import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { isAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin login — NexTravel",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <main className="flex min-h-full flex-1 items-center justify-center px-6 py-16">
      <AdminLoginForm />
    </main>
  );
}
