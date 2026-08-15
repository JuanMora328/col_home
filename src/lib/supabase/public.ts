import { createClient } from "@supabase/supabase-js";
import { getPublicSupabaseEnvironment } from "@/lib/supabase/env";

export function createPublicSupabaseClient() {
  const { url, publishableKey } = getPublicSupabaseEnvironment();
  return createClient(url, publishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
