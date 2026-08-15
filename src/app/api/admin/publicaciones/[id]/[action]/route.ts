import { revalidatePath } from "next/cache";
import { hasAdminSession } from "@/lib/admin-auth";
import { createPrivilegedSupabaseClient } from "@/lib/supabase/server";
import type { ListingStatus } from "@/types/data";

const operations = {
  publicar: { allowed: ["PENDING"], next: "PUBLISHED", message: "published" },
  desactivar: { allowed: ["PENDING", "PUBLISHED"], next: "INACTIVE", message: "inactive" },
} as const satisfies Record<string, { allowed: readonly ListingStatus[]; next: ListingStatus; message: string }>;

export async function POST(_request: Request, { params }: { params: Promise<{ id: string; action: string }> }) {
  if (!await hasAdminSession()) return redirect("/admin/login");
  const { id, action } = await params;
  const operation = operations[action as keyof typeof operations];
  if (!operation) return redirect(`/admin/publicaciones/${id}?message=invalid`);

  const admin = createPrivilegedSupabaseClient();
  const { data } = await admin.from("listings").select("status").eq("id", id).maybeSingle();
  const current = data?.status as ListingStatus | undefined;
  if (!current || !(operation.allowed as readonly ListingStatus[]).includes(current)) return redirect(`/admin/publicaciones/${id}?message=invalid`);

  const { error } = await admin.from("listings").update({ status: operation.next }).eq("id", id).eq("status", current);
  if (error) return redirect(`/admin/publicaciones/${id}?message=error`);

  revalidatePath("/");
  revalidatePath("/buscar");
  revalidatePath(`/vivienda/${id}`);
  revalidatePath("/admin");
  revalidatePath(`/admin/publicaciones/${id}`);
  return redirect(`/admin?message=${operation.message}`);
}

function redirect(location: string): Response {
  return new Response(null, { status: 303, headers: { location } });
}
