import Image from "next/image";
import {
  chargesTotal,
  formatINR,
  formatInvoiceDate,
  lineAmount,
  paymentStatus,
  toAmount,
  type InvoiceData,
} from "@/lib/invoice";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-3 mb-1.5 flex items-center gap-3 text-[13px] leading-[18px] font-extrabold tracking-[0.3em] text-[#111111] uppercase">
      <span className="h-[18px] w-[4px] shrink-0 bg-[#C62828]" aria-hidden="true" />
      {children}
    </h2>
  );
}

function DetailTable({ rows }: { rows: Array<[string, string, string, string]> }) {
  return (
    <table className="w-full table-fixed border-collapse text-[12.5px]">
      <colgroup>
        <col className="w-[18%]" />
        <col className="w-[32%]" />
        <col className="w-[17%]" />
        <col className="w-[33%]" />
      </colgroup>
      <tbody>
        {rows.map(([labelA, valueA, labelB, valueB]) => (
          <tr key={labelA}>
            <th className="border border-[#D9D9D9] bg-[#111111] px-2.5 py-[3px] text-left leading-[16px] font-bold text-white">
              {labelA}
            </th>
            <td className="border border-[#D9D9D9] px-2.5 py-[3px] leading-[16px] break-words text-[#222222]">{valueA}</td>
            <th className="border border-[#D9D9D9] bg-[#111111] px-2.5 py-[3px] text-left leading-[16px] font-bold text-white">
              {labelB}
            </th>
            <td className="border border-[#D9D9D9] px-2.5 py-[3px] leading-[16px] break-words text-[#222222]">{valueB}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <p className="text-[12.5px] leading-[19px] text-[#555555]">
      {label}: <strong className="font-bold text-[#111111]">{value}</strong>
    </p>
  );
}

function PaymentStamp({ status }: { status: "paid" | "partial" }) {
  const color = status === "paid" ? "#2E7D32" : "#D97F00";
  // Static ids are fine: identical arcs, and a page only renders one stamp of each kind.
  const topArc = `stamp-top-${status}`;
  const bottomArc = `stamp-bottom-${status}`;
  const ringText = { fontSize: 7.8, fontWeight: 800, letterSpacing: 1, fill: color } as const;

  return (
    <svg
      viewBox="0 0 120 120"
      className="absolute top-1/2 left-[28px] size-[100px] -translate-y-1/2 -rotate-[14deg] opacity-90"
      role="img"
      aria-label={status === "paid" ? "Paid" : "Partially paid"}
    >
      <defs>
        <path id={topArc} d="M 12 60 A 48 48 0 0 1 108 60" />
        <path id={bottomArc} d="M 6 60 A 54 54 0 0 0 114 60" />
      </defs>

      <circle cx="60" cy="60" r="57" fill="none" stroke={color} strokeWidth="3" />
      <circle cx="60" cy="60" r="44.5" fill="none" stroke={color} strokeWidth="1.3" />

      <text {...ringText}>
        <textPath href={`#${topArc}`} startOffset="50%" textAnchor="middle">
          NEXTRAVEL HOLIDAYS
        </textPath>
      </text>
      <text {...ringText}>
        <textPath href={`#${bottomArc}`} startOffset="50%" textAnchor="middle">
          THANK YOU
        </textPath>
      </text>
      <text x="9.5" y="63" fontSize="8" fill={color} textAnchor="middle">★</text>
      <text x="110.5" y="63" fontSize="8" fill={color} textAnchor="middle">★</text>

      {status === "paid" ? (
        <>
          <line x1="22" y1="45" x2="98" y2="45" stroke={color} strokeWidth="1.5" />
          <line x1="22" y1="75" x2="98" y2="75" stroke={color} strokeWidth="1.5" />
          <text x="60" y="68.5" fontSize="24" fontWeight="900" letterSpacing="2" fill={color} textAnchor="middle">
            PAID
          </text>
        </>
      ) : (
        <>
          <line x1="26" y1="41" x2="94" y2="41" stroke={color} strokeWidth="1.5" />
          <line x1="26" y1="81" x2="94" y2="81" stroke={color} strokeWidth="1.5" />
          <text x="60" y="56" fontSize="10.5" fontWeight="900" letterSpacing="1.2" fill={color} textAnchor="middle">
            PARTIALLY
          </text>
          <text x="60" y="76" fontSize="20" fontWeight="900" letterSpacing="2" fill={color} textAnchor="middle">
            PAID
          </text>
        </>
      )}
    </svg>
  );
}

type HistoryRow = { date: string; details: string; amount: number };

function paymentHistory(data: InvoiceData, paymentsReceived: number): HistoryRow[] {
  const rows: HistoryRow[] = [];
  const advance = toAmount(data.advanceReceived);
  if (advance > 0) rows.push({ date: data.invoiceDate, details: "Advance", amount: advance });

  if (data.payments) {
    for (const item of data.payments) {
      const details = [item.method, item.note].map((part) => part.trim()).filter(Boolean).join(" · ");
      rows.push({ date: item.paidOn, details: details || "Payment", amount: toAmount(item.amount) });
    }
  } else if (paymentsReceived > 0) {
    // Callers without the individual payments (e.g. the edit form preview) still get a correct total.
    rows.push({ date: "", details: "Payments recorded after invoicing", amount: paymentsReceived });
  }
  return rows;
}

function PaymentHistoryTable({ rows, received }: { rows: HistoryRow[]; received: number }) {
  const cell = "border-b border-[#E3E3E3] px-2.5 py-[4px] leading-[16px]";
  return (
    <table className="w-full border-collapse text-[12.5px]">
      <thead>
        <tr className="bg-[#111111] text-[11.5px] font-extrabold text-white uppercase">
          <th className="w-[56px] px-2.5 py-[5px] text-center leading-[16px]">No.</th>
          <th className="w-[150px] px-2.5 py-[5px] text-left leading-[16px]">Date</th>
          <th className="px-2.5 py-[5px] text-left leading-[16px]">Details</th>
          <th className="w-[140px] px-2.5 py-[5px] text-right leading-[16px]">Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index} className={index % 2 === 1 ? "bg-[#F5F5F5]" : "bg-white"}>
            <td className={`${cell} text-center tabular-nums`}>{index + 1}</td>
            <td className={`${cell} tabular-nums`}>{row.date ? formatInvoiceDate(row.date) : "—"}</td>
            <td className={`${cell} break-words`}>{row.details}</td>
            <td className={`${cell} text-right font-bold text-[#111111] tabular-nums`}>{formatINR(row.amount)}</td>
          </tr>
        ))}
        <tr className="bg-[#F2F2F2]">
          <th colSpan={3} className="px-2.5 py-[4px] text-right leading-[17px] font-bold text-[#111111]">
            Total received ({rows.length} payment{rows.length === 1 ? "" : "s"})
          </th>
          <td className="px-2.5 py-[4px] text-right leading-[17px] font-extrabold text-[#2E7D32] tabular-nums">
            ₹ {formatINR(received)}/-
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default function InvoiceDocument({ data }: { data: InvoiceData }) {
  const charges = data.charges.filter((line) => line.description.trim());
  const total = chargesTotal(charges);
  const paymentsReceived = toAmount(data.paymentsReceived ?? 0);
  const received = toAmount(data.advanceReceived + paymentsReceived);
  const outstanding = Math.max(0, toAmount(total - received));
  const status = paymentStatus(total, received);
  const payment = data.paymentDetails;
  const history = paymentHistory(data, paymentsReceived);

  return (
    <article className="flex min-h-[295mm] w-[210mm] flex-col bg-white px-[52px] pt-[32px] pb-[28px] font-sans text-[#222222] antialiased [color-scheme:light]">
      <header className="flex items-stretch">
        <div className="flex flex-1 items-center bg-[#111111] px-[18px] py-[12px]">
          <Image
            src="/images/logo-nav.png"
            alt="NexTravel Holidays"
            width={1024}
            height={218}
            unoptimized
            priority
            className="h-[50px] w-auto object-contain mix-blend-screen"
          />
        </div>
        <div className="flex w-[245px] flex-col items-end justify-center bg-[#C62828] px-[18px] py-[13px] text-white">
          <p className="text-[31px] leading-none font-extrabold tracking-tight">INVOICE</p>
          <p className="mt-2 text-[13px] leading-none font-semibold">{data.invoiceNo}</p>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-4 border-b border-[#E3E3E3] px-[10px] pt-[9px] pb-[8px]">
        {[
          ["Invoice date", formatInvoiceDate(data.invoiceDate)],
          ["Package", data.packageName],
          ["Duration", data.duration],
        ].map(([label, value]) => (
          <div key={label} className="min-w-0">
            <p className="text-[10px] leading-[14px] font-extrabold tracking-[0.04em] text-[#C62828] uppercase">{label}</p>
            <p className="mt-0.5 text-[13px] leading-[18px] font-bold break-words text-[#111111]">{value}</p>
          </div>
        ))}
      </div>

      <section className="break-inside-avoid">
        <SectionTitle>Client details</SectionTitle>
        <DetailTable
          rows={[
            ["Client Name", data.clientName, "Number", data.clientMobile],
            ["City", data.clientCity, "Email", data.clientEmail],
          ]}
        />
      </section>

      <section className="break-inside-avoid">
        <SectionTitle>Trip details</SectionTitle>
        <DetailTable
          rows={[
            ["Destinations", data.destinations, "Travellers", data.travellers],
            ["Rooms", data.rooms, "Hotel", data.hotel],
          ]}
        />
      </section>

      {data.stayPlan.length > 0 ? (
        <section className="break-inside-avoid">
          <SectionTitle>Stay plan</SectionTitle>
          <table className="w-full table-fixed border-collapse text-center">
            <tbody>
              <tr>
                {data.stayPlan.map((stop, index) => (
                  <td
                    key={`${stop.place}-${index}`}
                    className="border border-[#DCDCDC] bg-[#F2F2F2] px-2 py-[3px] text-[12px] leading-[16px] font-semibold break-words text-[#666666]"
                  >
                    {stop.place}
                  </td>
                ))}
              </tr>
              <tr>
                {data.stayPlan.map((stop, index) => (
                  <td
                    key={`${stop.place}-${index}`}
                    className="border border-[#DCDCDC] px-2 py-[5px] text-[19px] leading-[22px] font-extrabold text-[#C62828]"
                  >
                    {stop.nights}N
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </section>
      ) : null}

      {data.includes.length > 0 ? (
        <section className="break-inside-avoid">
          <SectionTitle>Package includes</SectionTitle>
          <ul className="grid grid-cols-2 gap-x-10 gap-y-1 px-[10px] text-[12.5px] leading-[18px] text-[#222222]">
            {data.includes.map((label, index) => (
              <li key={`${label}-${index}`} className="flex items-center gap-2">
                <span className="size-[5px] shrink-0 bg-[#C62828]" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="break-inside-avoid">
        <SectionTitle>Charges</SectionTitle>
        <table className="w-full border-collapse text-[12.5px]">
          <thead>
            <tr className="bg-[#111111] text-[11.5px] font-extrabold text-white uppercase">
              <th className="px-2.5 py-[5px] leading-[16px] text-left">Description</th>
              <th className="w-[80px] px-2.5 py-[5px] leading-[16px] text-center">Qty</th>
              <th className="w-[130px] px-2.5 py-[5px] leading-[16px] text-right">Rate (₹)</th>
              <th className="w-[140px] px-2.5 py-[5px] leading-[16px] text-right">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {charges.map((line, index) => (
              <tr key={index} className={index % 2 === 1 ? "bg-[#F5F5F5]" : "bg-white"}>
                <td className="border-b border-[#E3E3E3] px-2.5 py-[4px] leading-[16px] text-[#222222]">{line.description}</td>
                <td className="border-b border-[#E3E3E3] px-2.5 py-[4px] leading-[16px] text-center tabular-nums">
                  {formatINR(line.qty)}
                </td>
                <td className="border-b border-[#E3E3E3] px-2.5 py-[4px] leading-[16px] text-right tabular-nums">
                  {formatINR(line.rate)}
                </td>
                <td className="border-b border-[#E3E3E3] px-2.5 py-[4px] leading-[16px] text-right font-bold text-[#111111] tabular-nums">
                  {formatINR(lineAmount(line))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-3 flex items-center justify-between gap-6">
          {/* Absolutely positioned so the stamp never makes the page taller. */}
          <div className="relative flex-1 self-stretch">
            {total > 0 && status !== "unpaid" ? <PaymentStamp status={status} /> : null}
          </div>
          <table className="w-[342px] shrink-0 border-collapse text-[12.5px]">
            <tbody>
              <tr className="bg-[#F2F2F2]">
                <th className="border border-[#E3E3E3] px-2.5 py-[4px] leading-[17px] text-left font-bold text-[#111111]">
                  Total Amount
                </th>
                <td className="border border-[#E3E3E3] px-2.5 py-[4px] leading-[17px] text-right font-bold text-[#111111] tabular-nums">
                  ₹ {formatINR(total)}/-
                </td>
              </tr>
              {/* One row either way so the invoice still fits on a single A4 page. */}
              <tr>
                <th className="border border-[#E3E3E3] px-2.5 py-[4px] leading-[17px] text-left font-bold text-[#111111]">
                  {paymentsReceived > 0 ? "Amount Received" : "Advance Received"}
                </th>
                <td className="border border-[#E3E3E3] px-2.5 py-[4px] leading-[17px] text-right font-bold text-[#111111] tabular-nums">
                  ₹ {formatINR(received)}/-
                </td>
              </tr>
              <tr className="bg-[#C62828] text-white">
                <th className="border border-[#C62828] px-2.5 py-[5px] leading-[19px] text-left text-[14px] font-bold">
                  Outstanding Payment
                </th>
                <td className="border border-[#C62828] px-2.5 py-[5px] leading-[19px] text-right text-[14px] font-bold tabular-nums">
                  ₹ {formatINR(outstanding)}/-
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {history.length > 0 ? (
        <section className="break-inside-avoid">
          <SectionTitle>Payment history</SectionTitle>
          <PaymentHistoryTable rows={history} received={received} />
        </section>
      ) : null}

      <section className="break-inside-avoid">
        <SectionTitle>Payment &amp; contact</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          <div className="border border-t-[3px] border-[#DDDDDD] border-t-[#C62828] bg-[#F5F5F5] px-3.5 pt-2.5 pb-3">
            <h3 className="text-[12.5px] leading-[18px] font-extrabold tracking-[0.22em] text-[#C62828] uppercase">
              Payment information
            </h3>
            <p className="mt-1.5 text-[12.5px] leading-[19px] font-bold text-[#111111]">Bank Details</p>
            <InfoLine label="Bank Name" value={payment.bankName} />
            <InfoLine label="Account No." value={payment.accountNo} />
            <InfoLine label="Name" value={payment.accountName} />
            <InfoLine label="IFSC Code" value={payment.ifsc} />
            <InfoLine label="GPay No" value={payment.gpay} />
          </div>
          <div className="border border-t-[3px] border-[#DDDDDD] border-t-[#C62828] bg-[#F5F5F5] px-3.5 pt-2.5 pb-3">
            <h3 className="text-[12.5px] leading-[18px] font-extrabold tracking-[0.22em] text-[#C62828] uppercase">
              Contact details
            </h3>
            <div className="mt-1.5">
              <InfoLine label="Name" value={payment.contactName} />
              <InfoLine label="Contact No" value={payment.contactPhone} />
              <InfoLine label="Email" value={payment.contactEmail} />
              <InfoLine label="Website" value={payment.website} />
              <InfoLine label="Address" value={payment.address} />
            </div>
          </div>
        </div>
      </section>

      <div className="min-h-4 flex-1" aria-hidden="true" />
      <footer className="break-inside-avoid border-t-[4px] border-[#C62828] bg-[#111111] px-4 py-[10px] text-center">
        <p className="text-[16px] leading-[22px] font-bold text-white">Thank you for choosing NexTravel Holidays</p>
        <p className="mt-0.5 text-[11.5px] leading-[16px] text-[#BBBBBB]">Wishing you a safe and memorable journey.</p>
      </footer>
    </article>
  );
}
