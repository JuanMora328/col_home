-- Read-only checks for Phase 1. Run in the Supabase SQL Editor after migration.
select table_schema, table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in ('listings', 'listing_images')
order by table_name;

select relname as table_name, relrowsecurity as rls_enabled
from pg_class
where oid in ('public.listings'::regclass, 'public.listing_images'::regclass)
order by relname;

select schemaname, tablename, policyname, roles, cmd, qual
from pg_policies
where schemaname = 'public'
  and tablename in ('listings', 'listing_images')
order by tablename, policyname;

select id, name, public, file_size_limit, allowed_mime_types
from storage.buckets
where id = 'listing-images';

select tablename, indexname, indexdef
from pg_indexes
where schemaname = 'public'
  and tablename in ('listings', 'listing_images')
order by tablename, indexname;
