import { cn } from "@/lib/utils";

interface StatusToggleProps {
  active: boolean;
  pending?: boolean;
  title?: string;
  onClick?: () => void;
  className?: string;
}

/** Green ON / gray OFF switch used across admin list cards. */
export default function StatusToggle({
  active,
  pending = false,
  title,
  onClick,
  className,
}: StatusToggleProps) {
  return (
    <button
      type="button"
      disabled={pending}
      title={title}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "relative inline-flex h-7 w-[54px] shrink-0 items-center rounded-full px-1.5 transition disabled:opacity-60",
        active ? "bg-[#22C55E] justify-start" : "bg-[#6B7280] justify-end",
        className,
      )}
    >
      {pending ? (
        <span className="w-full text-center text-[10px] font-bold tracking-wide text-white">…</span>
      ) : (
        <>
          <span
            className={cn(
              "absolute text-[10px] font-bold tracking-wide text-white",
              active ? "left-2" : "right-2",
            )}
          >
            {active ? "ON" : "OFF"}
          </span>
          <span
            className={cn(
              "absolute top-1/2 size-[18px] -translate-y-1/2 rounded-full bg-white shadow-sm transition-all",
              active ? "right-1" : "left-1",
            )}
          />
        </>
      )}
    </button>
  );
}
