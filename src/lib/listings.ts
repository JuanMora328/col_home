import "server-only";

import { createPrivilegedSupabaseClient } from "@/lib/supabase/server";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import type { Listing, ListingImage } from "@/types/data";

export type ListingPreview = Pick<Listing, "id" | "property_type" | "availability_type" | "city_name" | "neighborhood" | "monthly_price" | "bedrooms" | "bathrooms"> & { imageUrl?: string };

export interface ListingFilters {
  department?: string; city?: string; maxPrice?: number; propertyType?: string;
  minBedrooms?: number; availabilityType?: string; page: number;
}

const PAGE_SIZE = 9;

async function addSignedImages(rows: (ListingPreview & { listing_images?: Pick<ListingImage, "storage_path">[] })[]) {
  let admin;
  try { admin = createPrivilegedSupabaseClient(); } catch { return rows.map((row) => { const copy = { ...row }; delete copy.listing_images; return copy; }); }
  return Promise.all(rows.map(async ({ listing_images, ...row }) => {
    const path = listing_images?.[0]?.storage_path;
    if (!path) return row;
    const { data, error } = await admin.storage.from("listing-images").createSignedUrl(path, 60 * 30);
    if (error) console.error("No fue posible firmar una imagen de vivienda.");
    return { ...row, imageUrl: data?.signedUrl };
  }));
}

const selection = "id,property_type,availability_type,city_name,neighborhood,monthly_price,bedrooms,bathrooms,listing_images(storage_path,sort_order)";

export async function getRecentListings(limit = 3): Promise<ListingPreview[]> {
  try {
    const { data, error } = await createPublicSupabaseClient().from("listings").select(selection).eq("status", "PUBLISHED").order("created_at", { ascending: false }).order("sort_order", { referencedTable: "listing_images", ascending: true }).limit(limit);
    if (error) throw error;
    return addSignedImages((data ?? []) as unknown as (ListingPreview & { listing_images: Pick<ListingImage, "storage_path">[] })[]);
  } catch { console.error("No fue posible consultar las viviendas recientes."); return []; }
}

export async function searchListings(filters: ListingFilters) {
  try {
    let query = createPublicSupabaseClient().from("listings").select(selection, { count: "exact" }).eq("status", "PUBLISHED");
    if (filters.department) query = query.eq("department_code", filters.department);
    if (filters.city) query = query.eq("city_code", filters.city);
    if (filters.maxPrice !== undefined) query = query.lte("monthly_price", filters.maxPrice);
    if (filters.propertyType) query = query.eq("property_type", filters.propertyType);
    if (filters.minBedrooms !== undefined) query = query.gte("bedrooms", filters.minBedrooms);
    if (filters.availabilityType) query = query.eq("availability_type", filters.availabilityType);
    const start = (filters.page - 1) * PAGE_SIZE;
    const { data, count, error } = await query.order("created_at", { ascending: false }).order("sort_order", { referencedTable: "listing_images", ascending: true }).range(start, start + PAGE_SIZE - 1);
    if (error) throw error;
    return { listings: await addSignedImages((data ?? []) as unknown as (ListingPreview & { listing_images: Pick<ListingImage, "storage_path">[] })[]), count: count ?? 0, pageSize: PAGE_SIZE, error: false };
  } catch { console.error("No fue posible consultar las viviendas."); return { listings: [], count: 0, pageSize: PAGE_SIZE, error: true }; }
}
