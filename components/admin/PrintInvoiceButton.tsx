"use client";

import { Printer } from "lucide-react";
import Button from "@/components/Button";

export default function PrintInvoiceButton() {
  return (
    <Button onClick={() => window.print()} variant="secondary" className="px-5">
      <Printer className="size-4" />
      Print
    </Button>
  );
}
