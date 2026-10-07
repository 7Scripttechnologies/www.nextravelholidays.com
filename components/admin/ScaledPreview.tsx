"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** 210mm at 96dpi — the invoice is laid out at real A4 width and zoomed to fit. */
const A4_WIDTH_PX = 794;

export default function ScaledPreview({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const update = () => setScale(Math.min(1, element.clientWidth / A4_WIDTH_PX));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn("w-full overflow-hidden print:overflow-visible", className)}>
      <div
        className={cn(
          "w-[210mm] [zoom:var(--preview-zoom)] print:[zoom:1]",
          scale == null && "invisible print:visible",
        )}
        style={{ "--preview-zoom": scale ?? 1 } as React.CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}
