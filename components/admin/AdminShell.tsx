"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ExternalLink,
  FileText,
  Globe2,
  Images,
  KeyRound,
  LayoutDashboard,
  Link2,
  LogOut,
  Menu,
  MessageSquareQuote,
  ReceiptText,
  Settings,
  Sparkles,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { logoutAdmin } from "@/app/admin/actions";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";

type AdminNavId =
  | "dashboard"
  | "packages"
  | "gallery"
  | "reviews"
  | "legal"
  | "7script"
  | "optimise"
  | "settings"
  | "links"
  | "invoices"
  | "tour-packages"
  | "customers";

interface AdminShellProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  activeNav?: AdminNavId;
}

interface NavLinkItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface NavItem extends NavLinkItem {
  id: AdminNavId;
  children?: NavLinkItem[];
}

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard, id: "dashboard" as const }],
  },
  {
    label: "Billing",
    items: [
      { href: "/admin/invoices", label: "Invoices", icon: ReceiptText, id: "invoices" as const },
      { href: "/admin/customers", label: "Customers", icon: Users, id: "customers" as const },
    ],
  },

  {
    label: "Website",
    items: [
      { href: "/admin/packages", label: "Packages", icon: Globe2, id: "packages" as const },
      { href: "/admin/gallery", label: "Gallery", icon: Images, id: "gallery" as const },
      { href: "/admin/reviews", label: "Reviews", icon: MessageSquareQuote, id: "reviews" as const },
      { href: "/admin/legal", label: "Legal", icon: FileText, id: "legal" as const },
      { href: "/admin/optimise", label: "AI - Optimise img", icon: Sparkles, id: "optimise" as const },
      { href: "/admin/links", label: "Links", icon: Link2, id: "links" as const },
    ],
  },
  {
    label: "Account",
    items: [
      {
        href: "/admin/settings",
        label: "Settings",
        icon: Settings,
        id: "settings" as const,
        children: [
          { href: "/admin/settings", label: "Admin login", icon: KeyRound },
          { href: "/admin/settings/invoice", label: "Invoice settings", icon: ReceiptText },
        ],
      },
    ],
  },
];

const navItemClass = (active: boolean) =>
  cn(
    "relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
    active ? "bg-[#E20E17]/12 text-[#EDEDED]" : "text-[#9A9A9A] hover:bg-white/[0.04] hover:text-[#EDEDED]",
  );

function ActiveBar() {
  return <span className="absolute top-1/2 left-0 h-6 w-[3px] -translate-y-1/2 rounded-full bg-[#E20E17]" />;
}

function NavDropdown({
  item,
  active,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const [toggled, setToggled] = useState<boolean | null>(null);
  const open = toggled ?? active;
  const Icon = item.icon;
  const children = item.children ?? [];
  const menuId = `admin-nav-${item.id}`;

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setToggled(!open)}
        className={navItemClass(active && !open)}
      >
        {active && !open ? <ActiveBar /> : null}
        <Icon className={cn("size-[18px]", active ? "text-[#E20E17]" : "")} />
        <span className="flex-1 text-left">{item.label}</span>
        <ChevronDown className={cn("size-4 transition-transform duration-200", open && "rotate-180")} />
      </button>
      <div
        id={menuId}
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="mt-1 ml-[21px] flex flex-col gap-1 border-l border-white/10 pl-3">
            {children.map((child) => {
              const ChildIcon = child.icon;
              const childActive = pathname === child.href;
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={onNavigate}
                  tabIndex={open ? undefined : -1}
                  aria-current={childActive ? "page" : undefined}
                  className={cn(navItemClass(childActive), "py-2 text-[13px]")}
                >
                  {childActive ? <ActiveBar /> : null}
                  <ChildIcon className={cn("size-4", childActive ? "text-[#E20E17]" : "")} />
                  {child.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const TOPBAR_H = "h-[88px]";

function AdminNav({
  activeNav,
  onNavigate,
}: {
  activeNav: AdminNavId;
  onNavigate?: () => void;
}) {
  return (
    <nav className="mt-4 flex flex-1 flex-col gap-1 overflow-y-auto px-3 pb-3" aria-label="Admin">
      {navGroups.map((group, groupIndex) => (
        <div key={group.label} className={cn("flex flex-col gap-1", groupIndex > 0 && "mt-4")}>
          <p className="px-3 pb-1 text-[10px] font-bold tracking-[0.2em] text-[#5F5F5F] uppercase">
            {group.label}
          </p>
          {group.items.map((item) => {
            const Icon = item.icon;
            const active = activeNav === item.id;
            if (item.children?.length) {
              return <NavDropdown key={item.id} item={item} active={active} onNavigate={onNavigate} />;
            }
            return (
              <Link key={item.href} href={item.href} onClick={onNavigate} className={navItemClass(active)}>
                {active ? <ActiveBar /> : null}
                <Icon className={cn("size-[18px]", active ? "text-[#E20E17]" : "")} />
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

function AdminSidebarFooter({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="mt-auto space-y-0.5 border-t border-white/[0.07] px-3 py-4">
      <Link
        href="/"
        target="_blank"
        onClick={onNavigate}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#9A9A9A] transition hover:bg-white/[0.04] hover:text-[#EDEDED]"
      >
        <ExternalLink className="size-[18px]" />
        View site
      </Link>
      <form action={logoutAdmin}>
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#9A9A9A] transition hover:bg-white/[0.04] hover:text-[#E20E17]"
        >
          <LogOut className="size-[18px]" />
          Log out
        </button>
      </form>
    </div>
  );
}

export default function AdminShell({
  children,
  title,
  description,
  actions,
  activeNav = "packages",
}: AdminShellProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <div className="min-h-svh bg-black print:min-h-0 print:bg-white">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col border-r border-white/[0.07] bg-[#0B0B0B] lg:flex print:!hidden">
        <div
          className={cn(
            "flex shrink-0 items-center gap-3 border-b border-white/[0.07] px-5",
            TOPBAR_H,
          )}
        >
          <Logo imageClassName="h-9" />
        </div>
        <AdminNav activeNav={activeNav} />
        <AdminSidebarFooter />
      </aside>

      {/* Mobile drawer backdrop */}
      <button
        type="button"
        aria-label="Close menu"
        className={cn(
          "fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity lg:hidden print:hidden",
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile drawer */}
      <aside
        id="admin-mobile-menu"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[min(288px,88vw)] flex-col border-r border-white/[0.07] bg-[#0B0B0B] shadow-[20px_0_50px_rgba(0,0,0,0.45)] transition-transform duration-300 ease-out lg:hidden print:hidden",
          menuOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-hidden={!menuOpen}
      >
        <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-white/[0.07] px-4 sm:h-16">
          <div className="flex min-w-0 items-center gap-2">
            <Logo imageClassName="h-7 max-w-[132px]" className="min-w-0" />
          </div>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="inline-flex size-9 items-center justify-center rounded-full border border-white/15 text-[#EDEDED] transition hover:border-[#E20E17]/50 hover:text-[#E20E17]"
          >
            <X className="size-5" />
          </button>
        </div>
        <AdminNav activeNav={activeNav} onNavigate={() => setMenuOpen(false)} />
        <AdminSidebarFooter onNavigate={() => setMenuOpen(false)} />
      </aside>

      {/* Mobile topbar */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/[0.07] bg-black/95 backdrop-blur-md lg:hidden print:hidden">
        <div className="flex h-14 items-center justify-between gap-2 px-3 sm:h-16 sm:gap-3 sm:px-4">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="admin-mobile-menu"
              onClick={() => setMenuOpen((open) => !open)}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-[#EDEDED] transition hover:border-[#E20E17]/50 hover:text-[#E20E17]"
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
            <Logo
              imageClassName="h-7 max-w-[120px] sm:h-8 sm:max-w-[150px]"
              className="min-w-0"
            />
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <Link
              href="/"
              aria-label="View site"
              className="inline-flex size-9 items-center justify-center rounded-full text-[#9A9A9A] transition hover:bg-white/[0.04] hover:text-[#EDEDED] sm:h-auto sm:w-auto sm:gap-1.5 sm:px-2.5 sm:py-1.5"
            >
              <ExternalLink className="size-4" />
              <span className="hidden text-xs font-semibold sm:inline">Site</span>
            </Link>
            <form action={logoutAdmin}>
              <button
                type="submit"
                aria-label="Log out"
                className="inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-white/15 px-2.5 text-xs font-semibold text-[#EDEDED] transition hover:border-[#E20E17]/50 sm:px-3"
              >
                <LogOut className="size-3.5 shrink-0" />
                <span className="hidden min-[380px]:inline">Log out</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="min-w-0 lg:pl-[260px] print:!pl-0">
        <header
          className={cn(
            "fixed top-0 right-0 z-30 hidden border-b border-white/[0.07] bg-black/95 backdrop-blur-md lg:block lg:left-[260px] print:!hidden",
            TOPBAR_H,
          )}
        >
          <div className="flex h-full items-center justify-between gap-4 px-8 xl:px-10">
            <div className="flex min-w-0 items-center gap-4">
              <span className="hidden h-8 w-px bg-white/15 xl:block" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-[11px] font-semibold tracking-[0.2em] text-[#E20E17] uppercase">
                  Dashboard
                </p>
                <h1 className="mt-0.5 truncate text-[24px] leading-tight font-extrabold tracking-tight text-[#EDEDED]">
                  {title}
                </h1>
              </div>
            </div>
            {actions ? (
              <div className="flex shrink-0 flex-wrap items-center justify-end gap-2.5">{actions}</div>
            ) : null}
          </div>
        </header>

        <main className="px-3 pt-16 pb-8 sm:px-6 sm:pt-[72px] lg:px-8 lg:pt-[112px] lg:pb-10 xl:px-10 print:!p-0">
          <div className="mb-6 flex flex-col gap-3 sm:mb-8 lg:hidden print:hidden">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold tracking-[0.2em] text-[#E20E17] uppercase">
                Dashboard
              </p>
              <h1 className="mt-1 text-[22px] leading-tight font-extrabold tracking-tight text-[#EDEDED] sm:text-[28px]">
                {title}
              </h1>
              {description ? (
                <p className="mt-2 max-w-xl text-sm leading-6 text-[#9A9A9A]">{description}</p>
              ) : null}
            </div>
            {actions ? (
              <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center [&_a]:w-full [&_a]:justify-center sm:[&_a]:w-auto [&_button]:w-full [&_button]:justify-center sm:[&_button]:w-auto [&_form]:w-full sm:[&_form]:w-auto">
                {actions}
              </div>
            ) : null}
          </div>

          {description ? (
            <p className="mb-6 hidden max-w-2xl text-sm leading-6 text-[#9A9A9A] lg:block print:!hidden">
              {description}
            </p>
          ) : null}

          {children}
        </main>
      </div>
    </div>
  );
}
