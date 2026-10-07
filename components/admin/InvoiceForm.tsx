"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Eye, Plus, Trash2 } from "lucide-react";
import type { ActionState } from "@/app/admin/actions";
import {
  FormSection,
  IncludesEditor,
  SmallButton,
  StayPlanEditor,
  compactFieldClass,
  fieldClass,
  fromIncludeDrafts,
  fromStayDrafts,
  newRowKey,
  toIncludeDrafts,
  toStayDrafts,
} from "@/components/admin/billing-fields";
import InvoiceDocument from "@/components/admin/InvoiceDocument";
import ScaledPreview from "@/components/admin/ScaledPreview";
import SearchSelect, { type SearchSelectOption } from "@/components/admin/SearchSelect";
import Button from "@/components/Button";
import type { CustomerRecord } from "@/lib/customers-db";
import {
  chargesTotal,
  destinationsFromStayPlan,
  durationFromStayPlan,
  formatINR,
  invoiceNoBase,
  isIsoDate,
  lineAmount,
  toAmount,
  type ChargeLine,
  type InvoiceData,
} from "@/lib/invoice";
import type { TourPackageRecord } from "@/lib/tour-packages-db";
import { cn } from "@/lib/utils";

export type InvoiceFormInitial = InvoiceData & {
  customerId: number | null;
  tourPackageId: number | null;
};

export type CustomerOption = Pick<CustomerRecord, "id" | "name" | "mobile" | "email" | "city">;
export type PackageOption = Pick<TourPackageRecord, "id" | "name" | "duration" | "stayPlan" | "includes">;

type ChargeDraft = { key: string; description: string; qty: string; rate: string };
type ClientFields = { name: string; mobile: string; email: string; city: string };

interface InvoiceFormProps {
  mode: "create" | "edit";
  initial: InvoiceFormInitial;
  customers: CustomerOption[];
  packages: PackageOption[];
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  cancelHref: string;
  /** Invoice-number prefix from Settings, used to preview numbers for other months. */
  invoicePrefix: string;
}

function toChargeDrafts(charges: ChargeLine[]): ChargeDraft[] {
  if (charges.length === 0) {
    return [{ key: newRowKey(), description: "Tour package - Adult", qty: "1", rate: "" }];
  }
  return charges.map((line) => ({
    key: newRowKey(),
    description: line.description,
    qty: String(line.qty),
    rate: String(line.rate),
  }));
}

function fromChargeDrafts(rows: ChargeDraft[]): ChargeLine[] {
  return rows
    .map((row) => ({
      description: row.description.trim(),
      qty: Math.max(0, toAmount(row.qty)),
      rate: Math.max(0, toAmount(row.rate)),
    }))
    .filter((line) => line.description);
}

function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="rounded-2xl border border-[#E20E17]/40 bg-[#E20E17]/10 px-4 py-3 text-sm text-[#EDEDED]">
      {message}
    </p>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="flex items-center justify-between gap-2 text-sm font-medium text-[#EDEDED]">{label}</span>
      {children}
    </label>
  );
}

function AutoBadge({ onReset, active }: { onReset: () => void; active: boolean }) {
  if (active) {
    return <span className="text-[11px] font-semibold text-emerald-400">Auto</span>;
  }
  return (
    <button type="button" onClick={onReset} className="text-[11px] font-semibold text-[#E20E17] hover:underline">
      Reset to auto
    </button>
  );
}

export default function InvoiceForm({
  mode,
  initial,
  customers,
  packages,
  action,
  cancelHref,
  invoicePrefix,
}: InvoiceFormProps) {
  const [state, formAction, pending] = useActionState(action, null);

  const [invoiceDate, setInvoiceDate] = useState(initial.invoiceDate);

  const [customerId, setCustomerId] = useState<number | null>(initial.customerId);
  const [client, setClient] = useState<ClientFields>({
    name: initial.clientName,
    mobile: initial.clientMobile,
    email: initial.clientEmail,
    city: initial.clientCity,
  });
  const [saveCustomer, setSaveCustomer] = useState(false);

  const [tourPackageId, setTourPackageId] = useState<number | null>(initial.tourPackageId);
  const [packageName, setPackageName] = useState(initial.packageName);
  const [stayRows, setStayRows] = useState(() => toStayDrafts(initial.stayPlan));
  const [includeRows, setIncludeRows] = useState(() => toIncludeDrafts(initial.includes));
  const [durationOverride, setDurationOverride] = useState<string | null>(() =>
    initial.duration && initial.duration !== durationFromStayPlan(initial.stayPlan) ? initial.duration : null,
  );
  const [destinationsOverride, setDestinationsOverride] = useState<string | null>(() =>
    initial.destinations && initial.destinations !== destinationsFromStayPlan(initial.stayPlan)
      ? initial.destinations
      : null,
  );

  const [travellers, setTravellers] = useState(initial.travellers);
  const [rooms, setRooms] = useState(initial.rooms);
  const [hotel, setHotel] = useState(initial.hotel);

  const [chargeRows, setChargeRows] = useState(() => toChargeDrafts(initial.charges));
  const [advance, setAdvance] = useState(initial.advanceReceived ? String(initial.advanceReceived) : "");
  const stayPlan = fromStayDrafts(stayRows);
  const autoDuration = durationFromStayPlan(stayPlan);
  const autoDestinations = destinationsFromStayPlan(stayPlan);

  // New invoices get their number on save; the preview shows the next free number for that month.
  const sameMonthAsSuggestion = invoiceDate.slice(0, 7) === initial.invoiceDate.slice(0, 7);
  const invoiceNo =
    mode === "edit" || sameMonthAsSuggestion || !isIsoDate(invoiceDate)
      ? initial.invoiceNo
      : `${invoiceNoBase(invoicePrefix, invoiceDate)}/###`;

  const data: InvoiceData = {
    invoiceNo,
    invoiceDate,
    clientName: client.name.trim(),
    clientMobile: client.mobile.trim(),
    clientEmail: client.email.trim(),
    clientCity: client.city.trim(),
    packageName: packageName.trim(),
    duration: (durationOverride ?? autoDuration).trim(),
    destinations: (destinationsOverride ?? autoDestinations).trim(),
    travellers: travellers.trim(),
    rooms: rooms.trim(),
    hotel: hotel.trim(),
    stayPlan,
    includes: fromIncludeDrafts(includeRows),
    charges: fromChargeDrafts(chargeRows),
    advanceReceived: Math.max(0, toAmount(advance)),
    paymentsReceived: initial.paymentsReceived ?? 0,
    payments: initial.payments,
    paymentDetails: initial.paymentDetails,
  };

  const paidLater = data.paymentsReceived ?? 0;
  const total = chargesTotal(data.charges);
  const outstanding = total - data.advanceReceived - paidLater;
  const advanceTooHigh = data.advanceReceived + paidLater > total;

  const payload = JSON.stringify({
    ...data,
    customerId,
    tourPackageId,
    saveCustomer: customerId == null && saveCustomer,
  });

  const customerOptions: SearchSelectOption[] = customers.map((customer) => ({
    value: customer.id,
    label: customer.name,
    hint: [customer.mobile, customer.city].filter(Boolean).join(" · "),
    keywords: customer.email,
  }));

  const selectCustomer = (id: number | null) => {
    const customer = customers.find((item) => item.id === id);
    if (!customer) {
      setCustomerId(null);
      return;
    }
    setCustomerId(customer.id);
    setSaveCustomer(false);
    setClient({ name: customer.name, mobile: customer.mobile, email: customer.email, city: customer.city });
  };

  const selectPackage = (value: string) => {
    const id = Number(value);
    const pkg = packages.find((item) => item.id === id);
    if (!pkg) {
      setTourPackageId(null);
      return;
    }
    setTourPackageId(pkg.id);
    setPackageName(pkg.name);
    setStayRows(toStayDrafts(pkg.stayPlan));
    setIncludeRows(toIncludeDrafts(pkg.includes));
    setDurationOverride(pkg.duration !== durationFromStayPlan(pkg.stayPlan) ? pkg.duration : null);
    setDestinationsOverride(null);
  };

  const updateClient = (patch: Partial<ClientFields>) => setClient((current) => ({ ...current, ...patch }));

  const updateCharge = (key: string, patch: Partial<ChargeDraft>) =>
    setChargeRows((rows) => rows.map((row) => (row.key === key ? { ...row, ...patch } : row)));

  return (
    <div className="grid gap-8 2xl:h-[calc(100svh-200px)] 2xl:min-h-[640px] 2xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <form
        action={formAction}
        className="min-w-0 space-y-6 2xl:overflow-y-auto 2xl:overscroll-contain 2xl:pr-3 2xl:pb-6"
      >
        <input type="hidden" name="payload" value={payload} />

        <ErrorMessage message={state?.error} />

        <a
          href="#invoice-preview"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E20E17] hover:underline 2xl:hidden"
        >
          <Eye className="size-3.5" />
          Jump to live preview
        </a>

        <FormSection title="Invoice">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <span className="text-sm font-medium text-[#EDEDED]">Invoice no.</span>
              <p className="mt-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 font-mono text-sm font-bold text-[#EDEDED]">
                {invoiceNo}
              </p>
              <p className="mt-1.5 text-xs text-muted">
                {mode === "edit" ? (
                  "Invoice numbers don't change after saving."
                ) : (
                  <>
                    Assigned automatically when you save.{" "}
                    <Link href="/admin/settings/invoice" className="text-[#E20E17] hover:underline">
                      Change format
                    </Link>
                  </>
                )}
              </p>
            </div>
            <Field label="Invoice date">
              <input
                type="date"
                value={invoiceDate}
                onChange={(event) => setInvoiceDate(event.target.value)}
                required
                className={cn(fieldClass, "[color-scheme:dark]")}
              />
            </Field>
          </div>
        </FormSection>

        <FormSection
          title="Client details"
          description="Pick a saved customer to fill these in, or type new details."
          aside={
            <Link href="/admin/customers/new" className="text-xs font-semibold text-[#E20E17] hover:underline">
              + New customer
            </Link>
          }
        >
          <div>
            <span className="text-sm font-medium text-[#EDEDED]">Saved customer</span>
            <SearchSelect
              options={customerOptions}
              value={customerId}
              onChange={selectCustomer}
              placeholder={
                customers.length ? "Search name, number or city — or pick from the list" : "No saved customers yet"
              }
              emptyText="No customers found"
              clearLabel="Unlink customer"
            />
            <p className="mt-1.5 text-xs text-muted">
              {customerId == null
                ? "Not linked — type the details below, or pick a saved customer."
                : "Linked to a saved customer. Clear it to type someone else."}
            </p>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Client name">
              <input
                value={client.name}
                onChange={(event) => updateClient({ name: event.target.value })}
                required
                maxLength={255}
                placeholder="Full name"
                className={fieldClass}
              />
            </Field>
            <Field label="Number">
              <input
                type="tel"
                value={client.mobile}
                onChange={(event) => updateClient({ mobile: event.target.value })}
                maxLength={32}
                placeholder="+91 98765 43210"
                className={fieldClass}
              />
            </Field>
            <Field label="City">
              <input
                value={client.city}
                onChange={(event) => updateClient({ city: event.target.value })}
                maxLength={128}
                placeholder="Ahmedabad"
                className={fieldClass}
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                value={client.email}
                onChange={(event) => updateClient({ email: event.target.value })}
                maxLength={255}
                placeholder="name@example.com"
                className={fieldClass}
              />
            </Field>
          </div>

          {customerId == null ? (
            <label className="mt-4 flex items-center gap-3">
              <input
                type="checkbox"
                checked={saveCustomer}
                onChange={(event) => setSaveCustomer(event.target.checked)}
                className="size-4 rounded border-line accent-[#E20E17]"
              />
              <span className="text-sm font-medium text-[#EDEDED]">Save as new customer</span>
            </label>
          ) : null}
        </FormSection>

        <FormSection
          title="Package"
          description="Pick a tour package to fill in the stay plan and inclusions. Everything stays editable."
          aside={
            <Link href="/admin/tour-packages/new" className="text-xs font-semibold text-[#E20E17] hover:underline">
              + Build package
            </Link>
          }
        >
          <Field label="Tour package">
            <select
              value={tourPackageId ?? ""}
              onChange={(event) => selectPackage(event.target.value)}
              className={fieldClass}
            >
              <option value="">— Custom (fill details below) —</option>
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name} · {pkg.duration}
                </option>
              ))}
            </select>
          </Field>

          <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_200px]">
            <Field label="Package name">
              <input
                value={packageName}
                onChange={(event) => setPackageName(event.target.value)}
                required
                maxLength={255}
                placeholder="Himachal & Amritsar"
                className={fieldClass}
              />
            </Field>
            <Field
              label={
                <>
                  Duration
                  <AutoBadge active={durationOverride == null} onReset={() => setDurationOverride(null)} />
                </>
              }
            >
              <input
                value={durationOverride ?? autoDuration}
                onChange={(event) => setDurationOverride(event.target.value)}
                maxLength={128}
                placeholder="8 Nights"
                className={fieldClass}
              />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Trip details">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              className="sm:col-span-2"
              label={
                <>
                  Destinations
                  <AutoBadge
                    active={destinationsOverride == null}
                    onReset={() => setDestinationsOverride(null)}
                  />
                </>
              }
            >
              <input
                value={destinationsOverride ?? autoDestinations}
                onChange={(event) => setDestinationsOverride(event.target.value)}
                maxLength={500}
                placeholder="Shimla, Manali, Kullu, Dalhousie, Amritsar"
                className={fieldClass}
              />
            </Field>
            <Field label="Travellers">
              <input
                value={travellers}
                onChange={(event) => setTravellers(event.target.value)}
                maxLength={255}
                placeholder="8 Adults + 1 Kid (7 yrs)"
                className={fieldClass}
              />
            </Field>
            <Field label="Rooms">
              <input
                value={rooms}
                onChange={(event) => setRooms(event.target.value)}
                maxLength={128}
                placeholder="4 Rooms"
                className={fieldClass}
              />
            </Field>
            <Field label="Hotel" className="sm:col-span-2">
              <input
                value={hotel}
                onChange={(event) => setHotel(event.target.value)}
                maxLength={128}
                placeholder="3 Star Stay"
                className={fieldClass}
              />
            </Field>
          </div>
        </FormSection>

        <FormSection
          title="Stay plan"
          description="Duration and destinations update automatically from this list."
        >
          <StayPlanEditor rows={stayRows} onChange={setStayRows} />
        </FormSection>

        <FormSection title="Package includes">
          <IncludesEditor rows={includeRows} onChange={setIncludeRows} />
        </FormSection>

        <FormSection title="Charges" description="Amounts and totals are calculated automatically.">
          <div className="space-y-2.5">
            <div className="hidden grid-cols-[minmax(0,1fr)_80px_120px_120px_40px] gap-2.5 px-1 text-[11px] font-semibold tracking-[0.14em] text-muted uppercase md:grid">
              <span>Description</span>
              <span>Qty</span>
              <span>Rate (₹)</span>
              <span className="text-right">Amount (₹)</span>
              <span />
            </div>
            {chargeRows.map((row, index) => (
              <div
                key={row.key}
                className="grid grid-cols-[minmax(0,1fr)_40px] gap-2.5 rounded-2xl border border-white/[0.06] p-3 md:grid-cols-[minmax(0,1fr)_80px_120px_120px_40px] md:items-center md:border-0 md:p-0"
              >
                <input
                  value={row.description}
                  onChange={(event) => updateCharge(row.key, { description: event.target.value })}
                  placeholder="Tour package - Adult"
                  aria-label={`Charge ${index + 1} description`}
                  className={cn(compactFieldClass, "md:col-auto")}
                />
                <div className="contents md:hidden">
                  <SmallButton
                    tone="danger"
                    ariaLabel={`Remove charge ${index + 1}`}
                    disabled={chargeRows.length === 1}
                    onClick={() => setChargeRows((rows) => rows.filter((item) => item.key !== row.key))}
                  >
                    <Trash2 className="size-3.5" />
                  </SmallButton>
                </div>
                <div className="col-span-2 grid grid-cols-3 gap-2.5 md:contents">
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="any"
                    value={row.qty}
                    onChange={(event) => updateCharge(row.key, { qty: event.target.value })}
                    placeholder="Qty"
                    aria-label={`Charge ${index + 1} quantity`}
                    className={compactFieldClass}
                  />
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="any"
                    value={row.rate}
                    onChange={(event) => updateCharge(row.key, { rate: event.target.value })}
                    placeholder="Rate"
                    aria-label={`Charge ${index + 1} rate`}
                    className={compactFieldClass}
                  />
                  <p className="flex items-center justify-end rounded-xl bg-white/[0.03] px-3 py-2.5 text-sm font-bold text-[#EDEDED] tabular-nums">
                    {formatINR(
                      lineAmount({ description: row.description, qty: toAmount(row.qty), rate: toAmount(row.rate) }),
                    )}
                  </p>
                </div>
                <div className="hidden md:block">
                  <SmallButton
                    tone="danger"
                    ariaLabel={`Remove charge ${index + 1}`}
                    disabled={chargeRows.length === 1}
                    onClick={() => setChargeRows((rows) => rows.filter((item) => item.key !== row.key))}
                  >
                    <Trash2 className="size-3.5" />
                  </SmallButton>
                </div>
              </div>
            ))}
            <div className="flex flex-wrap gap-2">
              <SmallButton
                onClick={() =>
                  setChargeRows((rows) => [...rows, { key: newRowKey(), description: "", qty: "1", rate: "" }])
                }
              >
                <Plus className="size-3.5" />
                Add charge
              </SmallButton>
              {!chargeRows.some((row) => /kid|child/i.test(row.description)) ? (
                <button
                  type="button"
                  onClick={() =>
                    setChargeRows((rows) => [
                      ...rows,
                      { key: newRowKey(), description: "Tour package - Kid", qty: "1", rate: "" },
                    ])
                  }
                  className="rounded-full border border-dashed border-white/15 px-3 py-1.5 text-xs text-muted transition hover:border-[#E20E17]/50 hover:text-[#EDEDED]"
                >
                  + Kid charge
                </button>
              ) : null}
            </div>
          </div>

          <div className="mt-6 ml-auto max-w-sm space-y-2 rounded-2xl border border-white/[0.07] bg-black p-4 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold text-[#EDEDED]">Total amount</span>
              <span className="font-bold text-[#EDEDED] tabular-nums">₹ {formatINR(total)}</span>
            </div>
            <label className="flex items-center justify-between gap-3">
              <span className="font-semibold text-[#EDEDED]">Advance received</span>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                value={advance}
                onChange={(event) => setAdvance(event.target.value)}
                placeholder="0"
                className={cn(compactFieldClass, "w-36 text-right", advanceTooHigh && "border-[#E20E17]")}
              />
            </label>
            {paidLater > 0 ? (
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-[#EDEDED]">Payments recorded</span>
                <span className="font-bold text-emerald-400 tabular-nums">₹ {formatINR(paidLater)}</span>
              </div>
            ) : null}
            <div className="flex items-center justify-between gap-3 rounded-xl bg-[#E20E17] px-3 py-2.5 text-white">
              <span className="font-bold">Outstanding</span>
              <span className="font-extrabold tabular-nums">₹ {formatINR(Math.max(0, outstanding))}</span>
            </div>
            {advanceTooHigh ? (
              <p className="text-xs text-[#FF5A61]">
                {paidLater > 0
                  ? "Advance + recorded payments is more than the total amount."
                  : "Advance is more than the total amount."}
              </p>
            ) : null}
            {mode === "create" ? (
              <p className="text-xs text-muted">Later part-payments can be recorded on the invoice page after saving.</p>
            ) : null}
          </div>
        </FormSection>

        <ErrorMessage message={state?.error} />

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={pending || advanceTooHigh}>
            {pending ? "Saving..." : mode === "create" ? "Save invoice" : "Save changes"}
          </Button>
          <Button href={cancelHref} variant="secondary">
            Cancel
          </Button>
        </div>
      </form>

      <aside
        id="invoice-preview"
        className="min-w-0 scroll-mt-24 2xl:overflow-y-auto 2xl:overscroll-contain 2xl:pr-1 2xl:pb-6"
      >
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-[12px] font-bold tracking-[0.16em] text-[#EDEDED] uppercase">Live preview</h2>
            <span className="text-xs text-muted">Updates as you type</span>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
            <ScaledPreview>
              <InvoiceDocument data={data} />
            </ScaledPreview>
          </div>
        </div>
      </aside>
    </div>
  );
}
