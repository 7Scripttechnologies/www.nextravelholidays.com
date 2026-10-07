import { paymentStatusLabels, type PaymentStatus } from "@/lib/invoice";
import { cn } from "@/lib/utils";

const statusClasses: Record<PaymentStatus, string> = {
  unpaid: "bg-[#E20E17]/12 text-[#FF5A61] ring-[#E20E17]/25",
  partial: "bg-amber-500/12 text-amber-300 ring-amber-500/25",
  paid: "bg-emerald-500/12 text-emerald-400 ring-emerald-500/25",
};

const dotClasses: Record<PaymentStatus, string> = {
  unpaid: "bg-[#FF5A61]",
  partial: "bg-amber-300",
  paid: "bg-emerald-400",
};

export default function PaymentStatusBadge({
  status,
  className,
}: {
  status: PaymentStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap ring-1 ring-inset",
        statusClasses[status],
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", dotClasses[status])} aria-hidden="true" />
      {paymentStatusLabels[status]}
    </span>
  );
}
