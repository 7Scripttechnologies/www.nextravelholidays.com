"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps {
  children: React.ReactNode;
  variant?: Variant;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-[#E20E17] text-[#EDEDED] shadow-[0_10px_24px_rgba(226,14,23,0.32)] hover:brightness-110 hover:scale-[1.02]",
  secondary:
    "bg-transparent text-[#EDEDED] border border-[#EDEDED]/25 hover:border-[#E20E17]/60 hover:bg-white/5",
  ghost: "bg-transparent text-[#EDEDED] hover:text-brand",
};

export default function Button({
  children,
  variant = "primary",
  href,
  onClick,
  type = "button",
  className,
  ariaLabel,
  disabled,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-60",
    variants[variant],
    className,
  );

  if (href) {
    const isExternal = href.startsWith("http://") || href.startsWith("https://");

    if (isExternal) {
      return (
        <a
          href={href}
          className={classes}
          aria-label={ariaLabel}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
