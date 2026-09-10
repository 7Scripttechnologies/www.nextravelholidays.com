"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  imageClassName?: string;
  onClick?: () => void;
}

export default function Logo({ className, imageClassName, onClick }: LogoProps) {
  const pathname = usePathname();

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex shrink-0 items-center bg-transparent focus-visible:rounded-md",
        className,
      )}
      aria-label="NexTravel holidays home"
      onClick={(event) => {
        onClick?.();

        if (pathname !== "/") return;

        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      suppressHydrationWarning
    >
      <Image
        src="/images/logo-nav.png"
        alt="NexTravel holidays.com"
        width={1024}
        height={218}
        unoptimized
        className={cn(
          "h-9 w-auto bg-transparent object-contain mix-blend-screen sm:h-10",
          imageClassName,
        )}
        priority
      />
    </Link>
  );
}
