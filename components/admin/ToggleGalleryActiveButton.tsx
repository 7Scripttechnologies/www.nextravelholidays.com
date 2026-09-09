"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toggleGalleryItemActiveAction } from "@/app/admin/actions";
import StatusToggle from "@/components/admin/StatusToggle";

interface ToggleGalleryActiveButtonProps {
  id: number;
  active: boolean;
  name: string;
}

export default function ToggleGalleryActiveButton({
  id,
  active,
  name,
}: ToggleGalleryActiveButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <StatusToggle
      active={active}
      pending={pending}
      title={active ? `Hide ${name}` : `Show ${name}`}
      onClick={() => {
        startTransition(async () => {
          await toggleGalleryItemActiveAction(id, !active);
          router.refresh();
        });
      }}
    />
  );
}
