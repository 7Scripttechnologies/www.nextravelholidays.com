"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { togglePackageActiveAction } from "@/app/admin/actions";
import StatusToggle from "@/components/admin/StatusToggle";

interface ToggleActiveButtonProps {
  id: number;
  active: boolean;
  name: string;
}

export default function ToggleActiveButton({ id, active, name }: ToggleActiveButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <StatusToggle
      active={active}
      pending={pending}
      title={active ? `Deactivate ${name}` : `Activate ${name}`}
      onClick={() => {
        startTransition(async () => {
          await togglePackageActiveAction(id, !active);
          router.refresh();
        });
      }}
    />
  );
}
