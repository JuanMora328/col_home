export const PROPERTY_TYPES = ["APARTMENT", "HOUSE", "ROOM"] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const AVAILABILITY_TYPES = ["RENT", "FREE_TEMPORARY"] as const;
export type AvailabilityType = (typeof AVAILABILITY_TYPES)[number];

export const LISTING_STATUSES = ["PENDING", "PUBLISHED", "INACTIVE"] as const;
export type ListingStatus = (typeof LISTING_STATUSES)[number];

export interface Listing {
  id: string;
  property_type: PropertyType;
  availability_type: AvailabilityType;
  department_code: string;
  department_name: string;
  city_code: string;
  city_name: string;
  neighborhood: string;
  monthly_price: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
  contact_name: string;
  contact_phone: string;
  status: ListingStatus;
  created_at: string;
  updated_at: string;
}

export interface ListingImage {
  id: string;
  listing_id: string;
  storage_path: string;
  sort_order: number;
  created_at: string;
}

export interface ColombiaCity {
  code: string;
  name: string;
}

export interface ColombiaDepartment {
  code: string;
  name: string;
  cities: ColombiaCity[];
}
