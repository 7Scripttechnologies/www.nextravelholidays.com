import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CircleDollarSign,
  Globe2,
  HandCoins,
  Images,
  MessageSquareQuote,
  ReceiptText,
  UserPlus,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import DbErrorNotice, { dbErrorMessage } from "@/components/admin/DbErrorNotice";
import PaymentStatusBadge from "@/components/admin/PaymentStatusBadge";
import { listCustomers } from "@/lib/customers-db";
import { listGalleryItems } from "@/lib/gallery-db";
import { formatINR, formatInvoiceDate } from "@/lib/invoice";
import { listInvoices } from "@/lib/invoices-db";
import { listPackageSummaries } from "@/lib/packages-db";
import { listReviews } from "@/lib/reviews-db";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard — Admin",
  robots: { index: false, follow: false },
};

const TIME_ZONE = "Asia/Kolkata";

function loadDashboard() {
  return Promise.all([
    listInvoices(),
    listCustomers(),
    listPackageSummaries(),
    listGalleryItems({ includeInactive: true }),
    listReviews({ includeInactive: true }),
  ]);
}

function greeting(now: Date) {
  const hour = Number(
    new Intl.DateTimeFormat("en-IN", { hour: "numeric", hourCycle: "h23", timeZone: TIME_ZONE }).format(now),
  );
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const cardClass = "rounded-[20px] border border-white/[0.07] bg-[#111111] sm:rounded-[22px]";

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  valueClass,
  href,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  valueClass?: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={cn(cardClass, "group block p-4 transition hover:border-white/15 sm:p-5")}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-[#9A9A9A] uppercase">{label}</p>
        <span className="flex size-8 items-center justify-center rounded-lg bg-white/[0.04] text-[#9A9A9A] transition group-hover:text-[#E20E17]">
          <Icon className="size-4" />
        </span>
      </div>
      <p
        className={cn(
          "mt-4 truncate text-[24px] leading-none font-extrabold tracking-tight sm:text-[30px]",
          valueClass ?? "text-[#EDEDED]",
        )}
      >
        {value}
      </p>
      {hint ? <p className="mt-2 truncate text-xs text-[#7A7A7A]">{hint}</p> : null}
    </Link>
  );
}

function SectionHeader({ title, href, linkLabel }: { title: string; href: string; linkLabel: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-3.5 sm:px-5">
      <h2 className="text-[12px] font-bold tracking-[0.16em] text-[#EDEDED] uppercase">{title}</h2>
      <Link
        href={href}
        className="inline-flex items-center gap-1 text-xs font-semibold text-[#9A9A9A] transition hover:text-[#E20E17]"
      >
        {linkLabel}
        <ArrowRight className="size-3.5" />
      </Link>
    </div>
  );
}

export default async function AdminDashboardPage() {
  let data: Awaited<ReturnType<typeof loadDashboard>> | null = null;
  let dbError = "";

  try {
    data = await loadDashboard();
  } catch (error) {
    dbError = dbErrorMessage(error);
  }

  const now = new Date();
  const todayLabel = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TIME_ZONE,
  }).format(now);

  if (!data) {
    return (
      <AdminShell title="Dashboard" description={todayLabel} activeNav="dashboard">
        <DbErrorNotice message={dbError} />
      </AdminShell>
    );
  }

  const [invoices, customers, packages, gallery, reviews] = data;

  const monthPrefix = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(now).slice(0, 7);
  const thisMonth = invoices.filter((item) => item.invoiceDate.startsWith(monthPrefix));
  const monthBilled = thisMonth.reduce((sum, item) => sum + item.totalAmount, 0);

  const billed = invoices.reduce((sum, item) => sum + item.totalAmount, 0);
  const received = invoices.reduce((sum, item) => sum + item.amountReceived, 0);
  const outstanding = invoices.reduce((sum, item) => sum + Math.max(0, item.outstanding), 0);

  const pending = invoices
    .filter((item) => item.status !== "paid" && item.outstanding > 0)
    .sort((a, b) => b.outstanding - a.outstanding);
  const recent = invoices.slice(0, 5);

  const moneyStats = [
    {
      label: "Billed (₹)",
      value: formatINR(billed),
      hint: `${invoices.length} invoice${invoices.length === 1 ? "" : "s"} in total`,
      icon: CircleDollarSign,
      href: "/admin/invoices",
    },
    {
      label: "Received (₹)",
      value: formatINR(received),
      hint: billed > 0 ? `${Math.round((received / billed) * 100)}% collected` : "No payments yet",
      icon: HandCoins,
      valueClass: "text-emerald-400",
      href: "/admin/invoices",
    },
    {
      label: "Outstanding (₹)",
      value: formatINR(outstanding),
      hint: `${pending.length} invoice${pending.length === 1 ? "" : "s"} pending`,
      icon: Wallet,
      valueClass: "text-[#E20E17]",
      href: "/admin/invoices",
    },
    {
      label: "This month (₹)",
      value: formatINR(monthBilled),
      hint: `${thisMonth.length} invoice${thisMonth.length === 1 ? "" : "s"} this month`,
      icon: CalendarDays,
      href: "/admin/invoices",
    },
  ];

  const activePackages = packages.filter((item) => item.active).length;
  const activeGallery = gallery.filter((item) => item.active).length;
  const activeReviews = reviews.filter((item) => item.active).length;

  const contentStats = [
    { label: "Customers", value: customers.length, hint: "Saved clients", icon: Users, href: "/admin/customers" },
    {
      label: "Website packages",
      value: packages.length,
      hint: `${activePackages} live on site`,
      icon: Globe2,
      href: "/admin/packages",
    },
    {
      label: "Gallery",
      value: gallery.length,
      hint: `${activeGallery} visible`,
      icon: Images,
      href: "/admin/gallery",
    },
    {
      label: "Reviews",
      value: reviews.length,
      hint: `${activeReviews} visible`,
      icon: MessageSquareQuote,
      href: "/admin/reviews",
    },
  ];

  const quickActions = [
    { label: "New invoice", hint: "Create and send a bill", href: "/admin/invoices/new", icon: ReceiptText },
    { label: "New customer", hint: "Save client details", href: "/admin/customers/new", icon: UserPlus },
  ];

  return (
    <AdminShell
      title="Dashboard"
      description={`${greeting(now)}! Here's how NexTravel is doing today — ${todayLabel}.`}
      activeNav="dashboard"
    >
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-4">
        {moneyStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <section className="mt-6">
        <h2 className="mb-3 text-[12px] font-bold tracking-[0.16em] text-[#EDEDED] uppercase">Quick actions</h2>
        <div className="grid grid-cols-2 gap-3 xl:gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className={cn(
                  cardClass,
                  "group flex min-h-full flex-col items-start gap-3 p-3.5 transition hover:border-[#E20E17]/45 sm:flex-row sm:items-center sm:p-4",
                )}
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#E20E17]/12 text-[#E20E17]">
                  <Icon className="size-[18px]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm leading-snug font-semibold text-[#EDEDED] sm:text-[15px]">
                    {action.label}
                  </span>
                  <span className="mt-0.5 block text-xs leading-snug text-[#7A7A7A]">{action.hint}</span>
                </span>
                <ArrowRight className="hidden size-4 shrink-0 text-[#5F5F5F] transition group-hover:translate-x-0.5 group-hover:text-[#E20E17] sm:block" />
              </Link>
            );
          })}
        </div>
      </section>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-5 xl:gap-5">
        <section className={cn(cardClass, "overflow-hidden xl:col-span-3")}>
          <SectionHeader title="Recent invoices" href="/admin/invoices" linkLabel="View all" />
          {recent.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-[#9A9A9A]">
              No invoices yet.{" "}
              <Link href="/admin/invoices/new" className="font-semibold text-[#E20E17] hover:underline">
                Create your first invoice
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-white/[0.06]">
              {recent.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/admin/invoices/${item.id}`}
                    className="flex items-center gap-3 px-4 py-3 transition hover:bg-white/[0.03] sm:px-5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#EDEDED]">{item.clientName}</p>
                      <p className="mt-0.5 truncate text-xs text-[#7A7A7A]">
                        {item.invoiceNo} · {formatInvoiceDate(item.invoiceDate)}
                        {item.packageName ? ` · ${item.packageName}` : ""}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <p className="text-sm font-bold text-[#EDEDED] tabular-nums">₹{formatINR(item.totalAmount)}</p>
                      <PaymentStatusBadge status={item.status} className="px-2 py-0.5 text-[10px]" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={cn(cardClass, "overflow-hidden xl:col-span-2")}>
          <SectionHeader title="Pending payments" href="/admin/invoices" linkLabel="All invoices" />
          {pending.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-[#9A9A9A]">
              All caught up — no pending payments.
            </div>
          ) : (
            <ul className="divide-y divide-white/[0.06]">
              {pending.slice(0, 5).map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/admin/invoices/${item.id}`}
                    className="flex items-center gap-3 px-4 py-3 transition hover:bg-white/[0.03] sm:px-5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#EDEDED]">{item.clientName}</p>
                      <p className="mt-0.5 truncate text-xs text-[#7A7A7A]">{item.invoiceNo}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold text-[#FF5A61] tabular-nums">₹{formatINR(item.outstanding)}</p>
                      <p className="mt-0.5 text-[11px] text-[#7A7A7A] tabular-nums">
                        of ₹{formatINR(item.totalAmount)}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="mt-6">
        <h2 className="mb-3 text-[12px] font-bold tracking-[0.16em] text-[#EDEDED] uppercase">Business & website</h2>
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-4">
          {contentStats.map((stat) => (
            <StatCard key={stat.label} {...stat} value={String(stat.value)} />
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
