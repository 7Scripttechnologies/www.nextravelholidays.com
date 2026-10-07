import { durationFromStayPlan, sanitizeIncludes, sanitizeStayPlan } from "@/lib/invoice";
import type { TourPackageInput } from "@/lib/tour-packages-db";

function jsonField(formData: FormData, key: string): unknown {
  try {
    return JSON.parse(String(formData.get(key) ?? "[]"));
  } catch {
    return [];
  }
}

export function parseTourPackageForm(
  formData: FormData,
): { ok: true; data: TourPackageInput } | { ok: false; error: string } {
  const name = String(formData.get("name") ?? "").trim();
  const stayPlan = sanitizeStayPlan(jsonField(formData, "stayPlan"));
  const includes = sanitizeIncludes(jsonField(formData, "includes"));
  const duration = String(formData.get("duration") ?? "").trim() || durationFromStayPlan(stayPlan);

  if (!name) return { ok: false, error: "Package name is required." };
  if (name.length > 255) return { ok: false, error: "Package name is too long." };
  if (stayPlan.length === 0) {
    return { ok: false, error: "Add at least one stay (place and number of nights)." };
  }
  if (!duration) return { ok: false, error: "Duration is required." };
  if (duration.length > 128) return { ok: false, error: "Duration is too long." };
  if (includes.length === 0) return { ok: false, error: "Add at least one item the package includes." };

  return { ok: true, data: { name, duration, stayPlan, includes } };
}
