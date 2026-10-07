import { chargesTotal, formatINR, formatInvoiceDate, toAmount, type InvoiceData } from "@/lib/invoice";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function amounts(data: InvoiceData) {
  const total = chargesTotal(data.charges);
  const received = toAmount(data.advanceReceived + (data.paymentsReceived ?? 0));
  return { total, received, outstanding: Math.max(0, toAmount(total - received)) };
}

function tripRows(data: InvoiceData): Array<[string, string]> {
  const rows: Array<[string, string]> = [
    ["Invoice no.", data.invoiceNo],
    ["Invoice date", formatInvoiceDate(data.invoiceDate)],
    ["Package", data.packageName],
    ["Duration", data.duration],
    ["Destinations", data.destinations],
    ["Travellers", data.travellers],
    ["Rooms", data.rooms],
    ["Hotel", data.hotel],
  ];
  return rows.filter(([, value]) => value.trim());
}

export function invoiceEmailSubject(data: InvoiceData) {
  return `Invoice ${data.invoiceNo}${data.packageName ? ` · ${data.packageName}` : ""} — NexTravel Holidays`;
}

export function invoiceEmailText(data: InvoiceData, pdfUrl: string | null) {
  const { total, received, outstanding } = amounts(data);
  const contact = data.paymentDetails;
  return [
    `Hello ${data.clientName},`,
    "",
    `Thank you for booking with NexTravel Holidays. Your invoice ${data.invoiceNo} is attached as a PDF.`,
    "",
    ...tripRows(data).map(([label, value]) => `${label}: ${value}`),
    "",
    `Total amount: ₹${formatINR(total)}`,
    `Amount received: ₹${formatINR(received)}`,
    `Outstanding: ₹${formatINR(outstanding)}`,
    ...(pdfUrl ? ["", `View / download your invoice: ${pdfUrl}`] : []),
    "",
    "Questions? Just reply to this email.",
    contact.contactName,
    [contact.contactPhone, contact.contactEmail].filter(Boolean).join(" · "),
    "",
    "NexTravel Holidays — wishing you a safe and memorable journey.",
  ].join("\n");
}

function detailTable(rows: Array<[string, string]>) {
  return rows
    .map(
      ([label, value]) => `<tr>
  <td style="padding:7px 12px;border-bottom:1px solid #eeeeee;color:#666666;font-size:13px;width:38%;">${escapeHtml(label)}</td>
  <td style="padding:7px 12px;border-bottom:1px solid #eeeeee;color:#111111;font-size:13px;font-weight:600;">${escapeHtml(value)}</td>
</tr>`,
    )
    .join("");
}

export function invoiceEmailHtml(data: InvoiceData, pdfUrl: string | null) {
  const { total, received, outstanding } = amounts(data);
  const contact = data.paymentDetails;
  const settled = outstanding <= 0 && total > 0;

  return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#f2f2f2;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f2f2;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;">
  <tr>
    <td style="background:#111111;padding:20px 24px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="color:#ffffff;font-size:20px;font-weight:800;">NexTravel <span style="color:#E20E17;">Holidays</span></td>
        <td align="right" style="color:#ffffff;font-size:12px;">
          <div style="font-size:18px;font-weight:800;letter-spacing:1px;">INVOICE</div>
          <div style="color:#bbbbbb;">${escapeHtml(data.invoiceNo)}</div>
        </td>
      </tr></table>
    </td>
  </tr>
  <tr><td style="height:4px;background:#C62828;font-size:0;line-height:0;">&nbsp;</td></tr>
  <tr>
    <td style="padding:24px;">
      <p style="margin:0 0 12px;color:#111111;font-size:16px;font-weight:700;">Hello ${escapeHtml(data.clientName)},</p>
      <p style="margin:0 0 20px;color:#444444;font-size:14px;line-height:21px;">
        Thank you for booking with NexTravel Holidays. Your invoice is attached to this email as a PDF.
      </p>

      <p style="margin:0 0 8px;color:#C62828;font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;">Trip details</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eeeeee;border-radius:8px;border-collapse:separate;margin-bottom:20px;">
        ${detailTable(tripRows(data))}
      </table>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;border-collapse:collapse;">
        <tr>
          <td style="padding:9px 12px;background:#f5f5f5;font-size:14px;color:#111111;font-weight:700;">Total amount</td>
          <td align="right" style="padding:9px 12px;background:#f5f5f5;font-size:14px;color:#111111;font-weight:700;">₹ ${formatINR(total)}/-</td>
        </tr>
        <tr>
          <td style="padding:9px 12px;font-size:14px;color:#111111;border-bottom:1px solid #eeeeee;">Amount received</td>
          <td align="right" style="padding:9px 12px;font-size:14px;color:#2E7D32;font-weight:700;border-bottom:1px solid #eeeeee;">₹ ${formatINR(received)}/-</td>
        </tr>
        <tr>
          <td style="padding:10px 12px;background:${settled ? "#2E7D32" : "#C62828"};font-size:15px;color:#ffffff;font-weight:700;">${settled ? "Fully paid" : "Outstanding payment"}</td>
          <td align="right" style="padding:10px 12px;background:${settled ? "#2E7D32" : "#C62828"};font-size:15px;color:#ffffff;font-weight:700;">₹ ${formatINR(outstanding)}/-</td>
        </tr>
      </table>

      ${
        pdfUrl
          ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:4px 0 20px;"><tr>
        <td style="background:#E20E17;border-radius:999px;">
          <a href="${escapeHtml(pdfUrl)}" style="display:inline-block;padding:12px 24px;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;">View / download invoice</a>
        </td>
      </tr></table>`
          : `<p style="margin:0 0 20px;color:#444444;font-size:13px;">📎 Your invoice PDF is attached below.</p>`
      }

      <p style="margin:0;color:#444444;font-size:13px;line-height:20px;">
        Questions? Just reply to this email${contact.contactPhone ? ` or call ${escapeHtml(contact.contactPhone)}` : ""}.<br>
        ${contact.contactName ? `<strong style="color:#111111;">${escapeHtml(contact.contactName)}</strong><br>` : ""}
        NexTravel Holidays
      </p>
    </td>
  </tr>
  <tr>
    <td style="background:#111111;border-top:4px solid #C62828;padding:14px 24px;text-align:center;">
      <p style="margin:0;color:#ffffff;font-size:14px;font-weight:700;">Thank you for choosing NexTravel Holidays</p>
      <p style="margin:4px 0 0;color:#bbbbbb;font-size:12px;">Wishing you a safe and memorable journey.</p>
    </td>
  </tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}
