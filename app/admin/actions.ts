"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { updateAdminCredentials, getAdminCredentials, adminPasswordMatches } from "@/lib/admin-credentials";
import { ADMIN_COOKIE } from "@/lib/auth-constants";
import { createAdminToken, requireAdmin, validateAdminCredentials } from "@/lib/auth";
import { parseGalleryForm } from "@/lib/gallery-form";
import {
  deleteGalleryItem,
  importSampleGalleryItems,
  insertGalleryItem,
  setGalleryItemActive,
  updateGalleryItem,
} from "@/lib/gallery-db";
import { optimizePendingImages } from "@/lib/image-optimize";
import { parsePackageForm } from "@/lib/package-form";
import {
  deletePackage,
  importSamplePackages,
  insertPackage,
  setPackageActive,
  slugExists,
  updatePackage,
} from "@/lib/packages-db";
import { parseReviewForm } from "@/lib/reviews-form";
import {
  deleteReview,
  importSampleReviews,
  insertReview,
  setReviewActive,
  updateReview,
} from "@/lib/reviews-db";
import { parseLegalForm } from "@/lib/legal-form";
import { upsertLegalPage, type LegalSlug } from "@/lib/legal-db";
import { siteImageSlots } from "@/data/site-images";
import { upsertSiteImages } from "@/lib/site-images-db";
import { saveUploadedImage } from "@/lib/uploads";
import { formatBytes } from "@/lib/utils";

export type ActionState = { error?: string; success?: string } | null;

function revalidatePackages(slug?: string) {
  revalidatePath("/", "layout");
  revalidatePath("/destinations");
  revalidatePath("/admin");
  if (slug) revalidatePath(`/destinations/${slug}`);
}

function revalidateGallery() {
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

function revalidateReviews() {
  revalidatePath("/");
  revalidatePath("/destinations");
  revalidatePath("/admin/reviews");
}

function revalidateSiteImages() {
  revalidatePath("/", "layout");
  revalidatePath("/about");
  revalidatePath("/destinations");
  revalidatePath("/gallery");
  revalidatePath("/contact");
  revalidatePath("/admin/7script");
}

function revalidateLegal() {
  revalidatePath("/terms");
  revalidatePath("/privacy");
  revalidatePath("/admin/legal");
  revalidatePath("/admin/legal/terms");
  revalidatePath("/admin/legal/privacy");
}

function mysqlMessage(error: unknown) {
  if (error && typeof error === "object" && "code" in error && error.code === "ER_DUP_ENTRY") {
    return "A package with this URL slug already exists.";
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong. Check that MySQL is running.";
}

export async function loginAdmin(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const result = await validateAdminCredentials(email, password);
  if (!result.ok) return { error: result.error };

  const store = await cookies();
  store.set(ADMIN_COOKIE, createAdminToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production",
  });

  redirect("/admin");
}

export async function logoutAdmin() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

export async function uploadAdminImage(formData: FormData): Promise<{ url?: string; error?: string }> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose an image to upload." };
  }

  try {
    const url = await saveUploadedImage(file);
    return { url };
  } catch (error) {
    return { error: mysqlMessage(error) };
  }
}

export async function createPackageAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = parsePackageForm(formData);
  if (!parsed.ok) return { error: parsed.error };

  if (await slugExists(parsed.data.slug)) {
    return { error: "A package with this URL slug already exists." };
  }

  try {
    await insertPackage(parsed.data);
  } catch (error) {
    return { error: mysqlMessage(error) };
  }

  revalidatePackages(parsed.data.slug);
  redirect("/admin");
}

export async function updatePackageAction(
  id: number,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = parsePackageForm(formData);
  if (!parsed.ok) return { error: parsed.error };

  if (await slugExists(parsed.data.slug, id)) {
    return { error: "A package with this URL slug already exists." };
  }

  try {
    await updatePackage(id, parsed.data);
  } catch (error) {
    return { error: mysqlMessage(error) };
  }

  revalidatePackages(parsed.data.slug);
  redirect("/admin");
}

export async function deletePackageAction(id: number) {
  await requireAdmin();
  try {
    await deletePackage(id);
  } catch (error) {
    throw new Error(mysqlMessage(error));
  }
  revalidatePackages();
}

export async function togglePackageActiveAction(id: number, active: boolean) {
  await requireAdmin();
  try {
    await setPackageActive(id, active);
  } catch (error) {
    throw new Error(mysqlMessage(error));
  }
  revalidatePackages();
}

export async function importSamplePackagesAction(): Promise<ActionState> {
  await requireAdmin();
  try {
    const imported = await importSamplePackages();
    revalidatePackages();
    return {
      success:
        imported > 0
          ? `Imported ${imported} sample package${imported === 1 ? "" : "s"}.`
          : "Sample packages are already in the database.",
    };
  } catch (error) {
    return { error: mysqlMessage(error) };
  }
}

export async function createGalleryItemAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = parseGalleryForm(formData);
  if (!parsed.ok) return { error: parsed.error };

  try {
    await insertGalleryItem(parsed.data);
  } catch (error) {
    return { error: mysqlMessage(error) };
  }

  revalidateGallery();
  redirect("/admin/gallery");
}

export async function updateGalleryItemAction(
  id: number,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = parseGalleryForm(formData);
  if (!parsed.ok) return { error: parsed.error };

  try {
    await updateGalleryItem(id, parsed.data);
  } catch (error) {
    return { error: mysqlMessage(error) };
  }

  revalidateGallery();
  redirect("/admin/gallery");
}

export async function deleteGalleryItemAction(id: number) {
  await requireAdmin();
  try {
    await deleteGalleryItem(id);
  } catch (error) {
    throw new Error(mysqlMessage(error));
  }
  revalidateGallery();
}

export async function toggleGalleryItemActiveAction(id: number, active: boolean) {
  await requireAdmin();
  try {
    await setGalleryItemActive(id, active);
  } catch (error) {
    throw new Error(mysqlMessage(error));
  }
  revalidateGallery();
}

export async function importSampleGalleryAction(): Promise<ActionState> {
  await requireAdmin();
  try {
    const imported = await importSampleGalleryItems();
    revalidateGallery();
    return {
      success:
        imported > 0
          ? `Imported ${imported} gallery photo${imported === 1 ? "" : "s"}.`
          : "Sample gallery photos are already in the database.",
    };
  } catch (error) {
    return { error: mysqlMessage(error) };
  }
}

export async function createReviewAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = parseReviewForm(formData);
  if (!parsed.ok) return { error: parsed.error };

  try {
    await insertReview(parsed.data);
  } catch (error) {
    return { error: mysqlMessage(error) };
  }

  revalidateReviews();
  redirect("/admin/reviews");
}

export async function updateReviewAction(
  id: number,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = parseReviewForm(formData);
  if (!parsed.ok) return { error: parsed.error };

  try {
    await updateReview(id, parsed.data);
  } catch (error) {
    return { error: mysqlMessage(error) };
  }

  revalidateReviews();
  redirect("/admin/reviews");
}

export async function deleteReviewAction(id: number) {
  await requireAdmin();
  try {
    await deleteReview(id);
  } catch (error) {
    throw new Error(mysqlMessage(error));
  }
  revalidateReviews();
}

export async function toggleReviewActiveAction(id: number, active: boolean) {
  await requireAdmin();
  try {
    await setReviewActive(id, active);
  } catch (error) {
    throw new Error(mysqlMessage(error));
  }
  revalidateReviews();
}

export async function importSampleReviewsAction(): Promise<ActionState> {
  await requireAdmin();
  try {
    const imported = await importSampleReviews();
    revalidateReviews();
    return {
      success:
        imported > 0
          ? `Imported ${imported} review${imported === 1 ? "" : "s"}.`
          : "Sample reviews are already in the database.",
    };
  } catch (error) {
    return { error: mysqlMessage(error) };
  }
}

export async function saveSiteImagesAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const values: Record<string, { src: string; caption: string }> = {};
  for (const slot of siteImageSlots) {
    const src = String(formData.get(`src__${slot.key}`) ?? "").trim();
    const caption = String(formData.get(`caption__${slot.key}`) ?? "").trim();
    if (!src) {
      return { error: `${slot.label} is required.` };
    }
    values[slot.key] = { src, caption };
  }

  try {
    await upsertSiteImages(values);
  } catch (error) {
    return { error: mysqlMessage(error) };
  }

  revalidateSiteImages();
  return { success: "7script saved. Changes are live on the website." };
}

export async function updateLegalPageAction(
  slug: LegalSlug,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  if (slug !== "terms" && slug !== "privacy") {
    return { error: "Invalid legal page." };
  }

  const parsed = parseLegalForm(formData);
  if (!parsed.ok) return { error: parsed.error };

  try {
    await upsertLegalPage(slug, parsed.data);
  } catch (error) {
    return { error: mysqlMessage(error) };
  }

  revalidateLegal();
  return { success: `${parsed.data.title} saved. Changes are live on the website.` };
}

export async function optimizeAdminImagesAction(): Promise<ActionState> {
  await requireAdmin();
  try {
    const result = await optimizePendingImages();
    revalidatePath("/", "layout");
    revalidatePath("/admin");
    revalidatePath("/admin/gallery");
    revalidatePath("/admin/7script");
    revalidatePath("/admin/optimise");
    revalidatePath("/gallery");
    revalidatePath("/destinations");

    if (result.scanned === 0) {
      return { success: "Nothing left to optimise — the list is clear." };
    }

    const saved = Math.max(0, result.bytesBefore - result.bytesAfter);
    if (result.failed > 0 && result.optimized === 0) {
      return {
        error: `Could not AI - Optimise images. ${result.errors[0] ?? "Check server logs."}`,
      };
    }

    return {
      success: `Done. Optimised ${result.optimized} image${result.optimized === 1 ? "" : "s"}${
        saved > 0 ? ` and saved ${formatBytes(saved)}` : ""
      }. They are removed from this list.${
        result.failed > 0 ? ` ${result.failed} failed.` : ""
      }`,
    };
  } catch (error) {
    return { error: mysqlMessage(error) };
  }
}

export async function updateAdminLoginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const email = String(formData.get("email") ?? "").trim();
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  const credentials = await getAdminCredentials();
  if (!credentials) {
    return { error: "Admin credentials are not configured." };
  }

  if (!(await adminPasswordMatches(currentPassword))) {
    return { error: "Current password is incorrect." };
  }

  if (!email) {
    return { error: "Email is required." };
  }

  const passwordToSave = newPassword || credentials.password;
  if (newPassword) {
    if (newPassword.length < 6) {
      return { error: "New password must be at least 6 characters." };
    }
    if (newPassword !== confirmPassword) {
      return { error: "New password and confirm password do not match." };
    }
  }

  try {
    await updateAdminCredentials(email, passwordToSave);
    revalidatePath("/admin/settings");
    return {
      success: newPassword
        ? "Login email and password updated. Use the new details next time you sign in."
        : "Login email updated.",
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not update login details." };
  }
}
