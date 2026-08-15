"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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

const transitions: Record<ListingStatus, readonly ListingStatus[]> = {
  PENDING: ["PUBLISHED", "INACTIVE"],
  PUBLISHED: ["INACTIVE"],
  INACTIVE: ["PUBLISHED"],
};

export async function moderateListing(formData: FormData) {
  if (!await hasAdminSession()) redirect("/admin/login");
  const id = formData.get("id");
  const requested = formData.get("status");
  if (typeof id !== "string" || typeof requested !== "string" || !["PUBLISHED", "INACTIVE"].includes(requested)) redirect("/admin?message=invalid");
  const admin = createPrivilegedSupabaseClient();
  const { data } = await admin.from("listings").select("status").eq("id", id).maybeSingle();
  const current = data?.status as ListingStatus | undefined;
  if (!current || !transitions[current].includes(requested as ListingStatus)) redirect("/admin?message=invalid");
  const { error } = await admin.from("listings").update({ status: requested }).eq("id", id).eq("status", current);
  if (error) redirect("/admin?message=error");
  revalidatePath("/");
  revalidatePath("/buscar");
  revalidatePath(`/vivienda/${id}`);
  revalidatePath("/admin");
  redirect(`/admin?message=${requested === "PUBLISHED" ? "published" : "inactive"}`);
}
