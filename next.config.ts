import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: supabaseUrl
      ? [new URL("/storage/v1/object/sign/**", supabaseUrl)]
      : [],
  },
};

export default nextConfig;
