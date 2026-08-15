import { createPrivilegedSupabaseClient } from "@/lib/supabase/server";
import { verifyFlow } from "@/lib/publication";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    listingId?: string;
    flowToken?: string;
  } | null;
  const listingId = verifyFlow(body?.flowToken);
  if (!listingId || listingId !== body?.listingId)
    return Response.json({ ok: false }, { status: 400 });
  const admin = createPrivilegedSupabaseClient();
  const { data } = await admin.storage
    .from("listing-images")
    .list(`listings/${listingId}`, { limit: 6 });
  const paths = data?.map((file) => `listings/${listingId}/${file.name}`) ?? [];
  if (paths.length) await admin.storage.from("listing-images").remove(paths);
  await admin
    .from("listings")
    .delete()
    .eq("id", listingId)
    .eq("status", "PENDING");
  return Response.json({ ok: true });
}
