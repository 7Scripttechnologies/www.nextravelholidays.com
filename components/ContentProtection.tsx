"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function isEditable(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || target.closest("input, textarea, select") !== null)
  );
}

export default function ContentProtection() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  useEffect(() => {
    if (isAdmin) return;

    // Form fields keep their menu so visitors can still paste into the contact/booking forms.
    const blockContextMenu = (event: MouseEvent) => {
      if (!isEditable(event.target)) event.preventDefault();
    };
    const blockImageDrag = (event: DragEvent) => {
      if (event.target instanceof HTMLImageElement) event.preventDefault();
    };

    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("dragstart", blockImageDrag);
    document.documentElement.classList.add("protect-images");

    return () => {
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("dragstart", blockImageDrag);
      document.documentElement.classList.remove("protect-images");
    };
  }, [isAdmin]);

  return null;
}
