import { createPrivilegedSupabaseClient } from "@/lib/supabase/server";
import { verifyFlow } from "@/lib/publication";

export async function POST(request: Request) { const body = await request.json().catch(() => null) as { listingId?: string; flowToken?: string; paths?: string[] } | null; const listingId = verifyFlow(body?.flowToken); if (!listingId || listingId !== body?.listingId || !Array.isArray(body?.paths) || body.paths.length < 1 || body.paths.length > 5 || body.paths.some((path) => typeof path !== "string" || !path.startsWith(`listings/${listingId}/`))) return Response.json({ error: "El flujo de publicación expiró o no es válido." }, { status: 400 });
  const admin = createPrivilegedSupabaseClient();
  const { data: listing } = await admin.from("listings").select("id").eq("id", listingId).eq("status", "PENDING").maybeSingle();
  if (!listing) return Response.json({ error: "El flujo de publicación expiró o no es válido." }, { status: 400 });
  const { data: existing } = await admin.from("listing_images").select("storage_path,sort_order").eq("listing_id", listingId).order("sort_order");
  if (existing?.length) {
    const isSameUpload = existing.length === body.paths.length && existing.every((image, index) => image.storage_path === body.paths![index]);
    return isSameUpload ? Response.json({ ok: true }) : Response.json({ error: "No pudimos completar la publicación." }, { status: 409 });
  }
  const { data: files, error: listError } = await admin.storage.from("listing-images").list(`listings/${listingId}`, { limit: 6 }); const names = new Set(files?.map((file: { name: string }) => `listings/${listingId}/${file.name}`)); if (listError || body.paths.some((path) => !names.has(path))) { await cleanup(admin, listingId, body.paths); return Response.json({ error: "Una o más fotos no se subieron correctamente." }, { status: 400 }); }
  const { error } = await admin.from("listing_images").insert(body.paths.map((storage_path, sort_order) => ({ listing_id: listingId, storage_path, sort_order }))); if (error) { await cleanup(admin, listingId, body.paths); console.error("Falló el guardado de metadata de imágenes."); return Response.json({ error: "No pudimos completar la publicación." }, { status: 500 }); } return Response.json({ ok: true }); }

async function cleanup(admin: ReturnType<typeof createPrivilegedSupabaseClient>, listingId: string, paths: string[]) { await admin.storage.from("listing-images").remove(paths); await admin.from("listings").delete().eq("id", listingId); }
