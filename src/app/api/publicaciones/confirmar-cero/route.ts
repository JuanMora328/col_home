import { cookies } from "next/headers";
import { signFlow } from "@/lib/publication";
export async function POST() { const jar = await cookies(); jar.set("rent_zero_confirmation", signFlow(`confirmed:${Date.now() + 10 * 60_000}`), { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", maxAge: 600, path: "/api/publicaciones" }); return Response.json({ ok: true }); }
