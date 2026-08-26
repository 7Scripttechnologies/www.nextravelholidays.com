import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <p
      className={cn(
        "text-[12px] font-semibold uppercase tracking-[0.2em] text-pink",
        className,
      )}
    >
      {children}
    </p>
  );
}
