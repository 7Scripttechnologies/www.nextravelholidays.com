import nodemailer, { type Transporter } from "nodemailer";
import type Mail from "nodemailer/lib/mailer";

let transporter: Transporter | null = null;

function smtpConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS ?? "";
  if (!host || !user || !pass) {
    throw new Error("Email is not set up. Add SMTP_HOST, SMTP_USER and SMTP_PASS to .env.local.");
  }
  const port = Number(process.env.SMTP_PORT ?? 465) || 465;
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465;
  return { host, port, secure, user, pass };
}

function getTransporter() {
  if (transporter) return transporter;
  const { host, port, secure, user, pass } = smtpConfig();
  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 30_000,
  });
  return transporter;
}

export function mailFrom() {
  const { user } = smtpConfig();
  const name = process.env.SMTP_FROM_NAME?.trim() || "NexTravel Holidays";
  return { name, address: user };
}

export async function sendMail(message: Omit<Mail.Options, "from">) {
  return getTransporter().sendMail({ from: mailFrom(), replyTo: mailFrom(), ...message });
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
