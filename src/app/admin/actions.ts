"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminSession, deleteAdminSession, hasAdminSession, isAdminPassword } from "@/lib/admin-auth";
import { createPrivilegedSupabaseClient } from "@/lib/supabase/server";
import type { ListingStatus } from "@/types/data";

export async function login(formData: FormData) {
  const candidate = formData.get("password");
  if (typeof candidate !== "string" || !isAdminPassword(candidate)) redirect("/admin/login?error=1");
  await createAdminSession();
  redirect("/admin");
}

export async function logout() {
  await deleteAdminSession();
  redirect("/admin/login");
}

async function changeStatus(id: string, allowedCurrent: readonly ListingStatus[], next: ListingStatus) {
  if (!await hasAdminSession()) redirect("/admin/login");
  const admin = createPrivilegedSupabaseClient();
  const { data } = await admin.from("listings").select("status").eq("id", id).maybeSingle();
  const current = data?.status as ListingStatus | undefined;
  if (!current || !allowedCurrent.includes(current)) redirect(`/admin/publicaciones/${id}?message=invalid`);
  const { error } = await admin.from("listings").update({ status: next }).eq("id", id).eq("status", current);
  if (error) redirect(`/admin/publicaciones/${id}?message=error`);
  revalidatePath("/");
  revalidatePath("/buscar");
  revalidatePath(`/vivienda/${id}`);
  revalidatePath("/admin");
  revalidatePath(`/admin/publicaciones/${id}`);
  redirect(`/admin/publicaciones/${id}?message=${next === "PUBLISHED" ? "published" : "inactive"}`);
}

export async function publishListing(id: string) {
  await changeStatus(id, ["PENDING"], "PUBLISHED");
}

export async function deactivateListing(id: string) {
  await changeStatus(id, ["PENDING", "PUBLISHED"], "INACTIVE");
}
