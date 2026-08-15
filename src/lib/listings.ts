import "server-only";

import { cache } from "react";
import { createPrivilegedSupabaseClient } from "@/lib/supabase/server";
import type { Listing, ListingImage } from "@/types/data";

export type ListingPreview = Pick<
  Listing,
  | "id"
  | "property_type"
  | "availability_type"
  | "city_code"
  | "city_name"
  | "neighborhood"
  | "monthly_price"
  | "bedrooms"
  | "bathrooms"
> & { imageUrl?: string };
export type ListingDetail = Pick<
  Listing,
  | "id"
  | "property_type"
  | "availability_type"
  | "department_name"
  | "city_code"
  | "city_name"
  | "neighborhood"
  | "monthly_price"
  | "bedrooms"
  | "bathrooms"
  | "description"
  | "contact_name"
  | "contact_phone"
> & {
  images: { url: string; sortOrder: number }[];
};

export interface ListingFilters {
  department?: string;
  city?: string;
  maxPrice?: number;
  propertyType?: string;
  minBedrooms?: number;
  availabilityType?: string;
  page: number;
}

const PAGE_SIZE = 9;

async function addSignedImages(
  rows: (ListingPreview & {
    listing_images?: Pick<ListingImage, "storage_path">[];
  })[],
) {
  let admin;
  try {
    admin = createPrivilegedSupabaseClient();
  } catch {
    return rows.map((row) => {
      const copy = { ...row };
      delete copy.listing_images;
      return copy;
    });
  }
  return Promise.all(
    rows.map(async ({ listing_images, ...row }) => {
      const path = listing_images?.[0]?.storage_path;
      if (!path) return row;
      const { data, error } = await admin.storage
        .from("listing-images")
        .createSignedUrl(path, 60 * 30);
      if (error) console.error("No fue posible firmar una imagen de vivienda.");
      return { ...row, imageUrl: data?.signedUrl };
    }),
  );
}

const previewSelection =
  "id,property_type,availability_type,city_code,city_name,neighborhood,monthly_price,bedrooms,bathrooms";

async function addPreviewImages(
  rows: ListingPreview[],
): Promise<ListingPreview[]> {
  if (!rows.length) return rows;

  const { data, error } = await createPrivilegedSupabaseClient()
    .from("listing_images")
    .select("listing_id,storage_path,sort_order")
    .in(
      "listing_id",
      rows.map(({ id }) => id),
    )
    .order("sort_order", { ascending: true });

  // Un error en las fotos opcionales no debe ocultar viviendas válidas.
  if (error) return rows;
  const firstImageByListing = new Map<
    string,
    Pick<ListingImage, "storage_path">
  >();
  for (const image of (data ?? []) as Pick<
    ListingImage,
    "listing_id" | "storage_path"
  >[]) {
    if (!firstImageByListing.has(image.listing_id)) {
      firstImageByListing.set(image.listing_id, {
        storage_path: image.storage_path,
      });
    }
  }

  return addSignedImages(
    rows.map((row) => ({
      ...row,
      listing_images: firstImageByListing.has(row.id)
        ? [firstImageByListing.get(row.id)!]
        : [],
    })),
  );
}

export async function getRecentListings(limit = 3): Promise<ListingPreview[]> {
  try {
    const { data, error } = await createPrivilegedSupabaseClient()
      .from("listings")
      .select(previewSelection)
      .eq("status", "PUBLISHED")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return addPreviewImages((data ?? []) as ListingPreview[]);
  } catch {
    console.error("No fue posible consultar las viviendas recientes.");
    return [];
  }
}

export async function searchListings(filters: ListingFilters) {
  try {
    let query = createPrivilegedSupabaseClient()
      .from("listings")
      .select(previewSelection, { count: "exact" })
      .eq("status", "PUBLISHED");
    if (filters.department)
      query = query.eq("department_code", filters.department);
    if (filters.city) query = query.eq("city_code", filters.city);
    if (filters.maxPrice !== undefined)
      query = query.lte("monthly_price", filters.maxPrice);
    if (filters.propertyType)
      query = query.eq("property_type", filters.propertyType);
    if (filters.minBedrooms !== undefined)
      query = query.gte("bedrooms", filters.minBedrooms);
    if (filters.availabilityType)
      query = query.eq("availability_type", filters.availabilityType);
    const start = (filters.page - 1) * PAGE_SIZE;
    const { data, count, error } = await query
      .order("created_at", { ascending: false })
      .range(start, start + PAGE_SIZE - 1);
    if (error) throw error;
    return {
      listings: await addPreviewImages((data ?? []) as ListingPreview[]),
      count: count ?? 0,
      pageSize: PAGE_SIZE,
      error: false,
    };
  } catch {
    console.error("No fue posible consultar las viviendas.");
    return { listings: [], count: 0, pageSize: PAGE_SIZE, error: true };
  }
}

const detailSelection =
  "id,property_type,availability_type,department_name,city_code,city_name,neighborhood,monthly_price,bedrooms,bathrooms,description,contact_name,contact_phone,listing_images(storage_path,sort_order)";

export const getPublishedListing = cache(
  async (id: string): Promise<ListingDetail | null> => {
    try {
      const { data, error } = await createPrivilegedSupabaseClient()
        .from("listings")
        .select(detailSelection)
        .eq("id", id)
        .eq("status", "PUBLISHED")
        .maybeSingle();

      if (error || !data) return null;
      const row = data as unknown as Omit<ListingDetail, "images"> & {
        listing_images?: Pick<ListingImage, "storage_path" | "sort_order">[];
      };
      const admin = createPrivilegedSupabaseClient();
      const orderedImages = [...(row.listing_images ?? [])].sort(
        (left, right) => left.sort_order - right.sort_order,
      );
      const signedImages = await Promise.all(
        orderedImages.map(async (image) => {
          const { data: signed, error: signError } = await admin.storage
            .from("listing-images")
            .createSignedUrl(image.storage_path, 60 * 30);
          if (signError || !signed?.signedUrl) return null;
          return { url: signed.signedUrl, sortOrder: image.sort_order };
        }),
      );
      const { listing_images: _privateImages, ...listing } = row;
      void _privateImages;
      return {
        ...listing,
        images: signedImages.filter(
          (image): image is NonNullable<typeof image> => image !== null,
        ),
      };
    } catch {
      return null;
    }
  },
);
