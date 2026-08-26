"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE } from "@/lib/auth-constants";
import { createAdminToken, requireAdmin, validateAdminCredentials } from "@/lib/auth";
import { parsePackageForm } from "@/lib/package-form";
import {
  deletePackage,
  importSamplePackages,
  insertPackage,
  setPackageActive,
  slugExists,
  updatePackage,
} from "@/lib/packages-db";
import { saveUploadedImage } from "@/lib/uploads";

export type ActionState = { error?: string; success?: string } | null;

function revalidatePackages(slug?: string) {
  revalidatePath("/", "layout");
  revalidatePath("/destinations");
  revalidatePath("/admin");
  if (slug) revalidatePath(`/destinations/${slug}`);
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
  const result = validateAdminCredentials(email, password);
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
