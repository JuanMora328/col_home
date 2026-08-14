import { cookies } from "next/headers";
import { createListingImageStoragePath, type ListingImageMimeType } from "@/lib/storage-path";
import { createPrivilegedSupabaseClient } from "@/lib/supabase/server";
import { signFlow, validatePublication, verifyFlow } from "@/lib/publication";

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") ?? 0) > 32_000) return Response.json({ error: "Solicitud demasiado grande." }, { status: 413 });
  const validated = validatePublication(await request.json().catch(() => null)); if (!validated.ok) return Response.json({ error: validated.message }, { status: 400 }); const input = validated.value;
  const jar = await cookies();
  if (input.availabilityType === "RENT" && input.monthlyPrice === 0 && verifyFlow(jar.get("rent_zero_confirmation")?.value) !== "confirmed") return Response.json({ error: "Confirma explícitamente el valor de arriendo $0." }, { status: 409 });
  jar.delete("rent_zero_confirmation"); const admin = createPrivilegedSupabaseClient(); const listingId = crypto.randomUUID();
  const { error } = await admin.from("listings").insert({ id: listingId, property_type: input.propertyType, availability_type: input.availabilityType, department_code: input.department, department_name: input.departmentName, city_code: input.city, city_name: input.cityName, neighborhood: input.neighborhood, monthly_price: input.monthlyPrice, bedrooms: input.bedrooms, bathrooms: input.bathrooms, description: input.description, contact_name: input.contactName, contact_phone: input.contactPhone, status: "PENDING" });
  if (error) { console.error("Falló la creación de una publicación pendiente."); return Response.json({ error: "No pudimos iniciar la publicación." }, { status: 500 }); }
  const uploads = []; for (const image of input.images) { const path = createListingImageStoragePath(listingId, image.type as ListingImageMimeType); const signed = await admin.storage.from("listing-images").createSignedUploadUrl(path); if (signed.error) { await admin.from("listings").delete().eq("id", listingId); console.error("Falló la preparación de imágenes."); return Response.json({ error: "No pudimos preparar las fotos." }, { status: 500 }); } uploads.push({ path, token: signed.data.token }); }
  return Response.json({ listingId, uploads, flowToken: signFlow(`${listingId}:${Date.now() + 15 * 60_000}`) });
}
