create extension if not exists pgcrypto;

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  property_type text not null constraint listings_property_type_check
    check (property_type in ('APARTMENT', 'HOUSE', 'ROOM')),
  availability_type text not null constraint listings_availability_type_check
    check (availability_type in ('RENT', 'FREE_TEMPORARY')),
  department_code text not null,
  department_name text not null,
  city_code text not null,
  city_name text not null,
  neighborhood text not null,
  monthly_price integer not null constraint listings_monthly_price_check
    check (monthly_price >= 0),
  bedrooms smallint not null constraint listings_bedrooms_check
    check (bedrooms >= 0),
  bathrooms smallint not null constraint listings_bathrooms_check
    check (bathrooms >= 1),
  description text not null,
  contact_name text not null,
  contact_phone text not null,
  status text not null default 'PENDING' constraint listings_status_check
    check (status in ('PENDING', 'PUBLISHED', 'INACTIVE')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  storage_path text not null unique,
  sort_order smallint not null constraint listing_images_sort_order_check
    check (sort_order between 0 and 4),
  created_at timestamptz not null default now(),
  constraint listing_images_listing_sort_order_key unique (listing_id, sort_order)
);

create or replace function public.set_listings_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_listings_updated_at on public.listings;
create trigger set_listings_updated_at
before update on public.listings
for each row execute function public.set_listings_updated_at();

-- status alone is the leading column of both composite indexes, so a separate
-- status index would duplicate their work.
create index if not exists listings_status_created_at_idx
  on public.listings (status, created_at desc);
create index if not exists listings_status_location_created_at_idx
  on public.listings (status, department_code, city_code, created_at desc);
create index if not exists listings_published_monthly_price_idx
  on public.listings (monthly_price) where status = 'PUBLISHED';
create index if not exists listings_published_property_type_idx
  on public.listings (property_type) where status = 'PUBLISHED';
create index if not exists listings_published_availability_type_idx
  on public.listings (availability_type) where status = 'PUBLISHED';
create index if not exists listings_published_bedrooms_idx
  on public.listings (bedrooms) where status = 'PUBLISHED';

alter table public.listings enable row level security;
alter table public.listing_images enable row level security;

drop policy if exists "Public can read published listings" on public.listings;
create policy "Public can read published listings"
on public.listings for select
to anon
using (status = 'PUBLISHED');

drop policy if exists "Public can read images of published listings" on public.listing_images;
create policy "Public can read images of published listings"
on public.listing_images for select
to anon
using (
  exists (
    select 1
    from public.listings
    where listings.id = listing_images.listing_id
      and listings.status = 'PUBLISHED'
  )
);

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'listing-images',
  'listing-images',
  false,
  6291456,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  name = excluded.name,
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- No storage.objects policies are intentional. Only privileged server code will
-- create signed upload/download URLs; the bucket itself remains private.
