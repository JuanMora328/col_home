import "server-only";

import { createPrivilegedSupabaseClient } from "@/lib/supabase/server";
import type { Listing, ListingImage } from "@/types/data";

export type AdminListing = Listing & { images: { url: string; sortOrder: number }[] };

async function addSignedImages(row: Listing & { listing_images?: Pick<ListingImage, "storage_path" | "sort_order">[] }): Promise<AdminListing> {
  const admin = createPrivilegedSupabaseClient();
  const signed = await Promise.all([...(row.listing_images ?? [])].sort((a, b) => a.sort_order - b.sort_order).map(async (image) => {
    const result = await admin.storage.from("listing-images").createSignedUrl(image.storage_path, 30 * 60);
    return result.data?.signedUrl ? { url: result.data.signedUrl, sortOrder: image.sort_order } : null;
  }));
  const { listing_images: _images, ...listing } = row;
  void _images;
  return { ...listing, images: signed.filter((image): image is NonNullable<typeof image> => image !== null) };
}

export async function getAdminListings(): Promise<AdminListing[]> {
  const admin = createPrivilegedSupabaseClient();
  const { data, error } = await admin.from("listings").select("*,listing_images(storage_path,sort_order)").order("created_at", { ascending: false });
  if (error) throw new Error("No fue posible cargar las publicaciones.");
  return Promise.all((data ?? []).map((item) => addSignedImages(item as Listing & { listing_images?: Pick<ListingImage, "storage_path" | "sort_order">[] })));
}

export async function getAdminListing(id: string): Promise<AdminListing | null> {
  const { data, error } = await createPrivilegedSupabaseClient().from("listings").select("*,listing_images(storage_path,sort_order)").eq("id", id).maybeSingle();
  if (error || !data) return null;
  return addSignedImages(data as Listing & { listing_images?: Pick<ListingImage, "storage_path" | "sort_order">[] });
}
