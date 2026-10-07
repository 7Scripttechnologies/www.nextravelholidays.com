import type { CustomerInput } from "@/lib/customers-db";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateCustomer(
  raw: CustomerInput,
): { ok: true; data: CustomerInput } | { ok: false; error: string } {
  const name = raw.name.trim();
  const mobile = raw.mobile.trim();
  const email = raw.email.trim().toLowerCase();
  const city = raw.city.trim();
  const digits = mobile.replace(/\D/g, "");

  if (!name) return { ok: false, error: "Customer name is required." };
  if (name.length > 255) return { ok: false, error: "Customer name is too long." };
  if (!mobile) return { ok: false, error: "Mobile number is required." };
  if (!/^[+\d\s()-]+$/.test(mobile) || digits.length < 10 || digits.length > 15) {
    return { ok: false, error: "Enter a valid mobile number (10–15 digits)." };
  }
  if (email && (!EMAIL_PATTERN.test(email) || email.length > 255)) {
    return { ok: false, error: "Enter a valid email address." };
  }
  if (city.length > 128) return { ok: false, error: "City name is too long." };

  return { ok: true, data: { name, mobile, email, city } };
}

export function parseCustomerForm(formData: FormData) {
  return validateCustomer({
    name: String(formData.get("name") ?? ""),
    mobile: String(formData.get("mobile") ?? ""),
    email: String(formData.get("email") ?? ""),
    city: String(formData.get("city") ?? ""),
  });
}
