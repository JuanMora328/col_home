import "server-only";

import { createClient } from "@supabase/supabase-js";

function requireServerEnvironmentVariable(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Falta la variable de entorno ${name}.`);
  return value;
}

export function createPrivilegedSupabaseClient() {
  const url = requireServerEnvironmentVariable("NEXT_PUBLIC_SUPABASE_URL");
  const secretKey = requireServerEnvironmentVariable("SUPABASE_SECRET_KEY");

  return createClient(url, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
