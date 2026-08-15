import "server-only";

import { createPrivilegedSupabaseClient } from "@/lib/supabase/server";
import type { Listing, ListingImage } from "@/types/data";

type AdminImage = { url: string; sortOrder: number };
type ImageRow = Pick<
  ListingImage,
  "listing_id" | "storage_path" | "sort_order"
>;

export type AdminListing = Listing & { images: AdminImage[] };
export type AdminListingsResult = { listings: AdminListing[]; error: boolean };

async function signImages(
  rows: Listing[],
  images: ImageRow[],
): Promise<AdminListing[]> {
  const admin = createPrivilegedSupabaseClient();
  const imagesByListing = new Map<string, ImageRow[]>();
  for (const image of images) {
    const group = imagesByListing.get(image.listing_id) ?? [];
    group.push(image);
    imagesByListing.set(image.listing_id, group);
  }

  return Promise.all(
    rows.map(async (listing) => {
      const ordered = (imagesByListing.get(listing.id) ?? []).sort(
        (left, right) => left.sort_order - right.sort_order,
      );
      const signed = await Promise.all(
        ordered.map(async (image) => {
          const { data } = await admin.storage
            .from("listing-images")
            .createSignedUrl(image.storage_path, 30 * 60);
          return data?.signedUrl
            ? { url: data.signedUrl, sortOrder: image.sort_order }
            : null;
        }),
      );
      return {
        ...listing,
        images: signed.filter((image): image is AdminImage => image !== null),
      };
    }),
  );
}

export async function getAdminListings(): Promise<AdminListingsResult> {
  const admin = createPrivilegedSupabaseClient();
  const { data, error } = await admin
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error(
      "No fue posible consultar las publicaciones para moderación.",
    );
    return { listings: [], error: true };
  }

  const listings = (data ?? []) as Listing[];
  if (!listings.length) return { listings: [], error: false };
  const { data: imageData, error: imageError } = await admin
    .from("listing_images")
    .select("listing_id,storage_path,sort_order")
    .in(
      "listing_id",
      listings.map(({ id }) => id),
    )
    .order("sort_order");
  if (imageError)
    console.error("No fue posible consultar las imágenes para moderación.");
  return {
    listings: await signImages(listings, (imageData ?? []) as ImageRow[]),
    error: false,
  };
}

export async function getAdminListing(
  id: string,
): Promise<AdminListing | null> {
  const admin = createPrivilegedSupabaseClient();
  const { data, error } = await admin
    .from("listings")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  const { data: imageData } = await admin
    .from("listing_images")
    .select("listing_id,storage_path,sort_order")
    .eq("listing_id", id)
    .order("sort_order");
  return (
    await signImages([data as Listing], (imageData ?? []) as ImageRow[])
  )[0];
}
