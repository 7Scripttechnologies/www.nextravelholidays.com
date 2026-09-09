"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toggleReviewActiveAction } from "@/app/admin/actions";
import StatusToggle from "@/components/admin/StatusToggle";

interface ToggleReviewActiveButtonProps {
  id: number;
  active: boolean;
  name: string;
}

export default function ToggleReviewActiveButton({
  id,
  active,
  name,
}: ToggleReviewActiveButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <StatusToggle
      active={active}
      pending={pending}
      title={active ? `Hide ${name}` : `Show ${name}`}
      onClick={() => {
        startTransition(async () => {
          await toggleReviewActiveAction(id, !active);
          router.refresh();
        });
      }}
    />
  );
}
