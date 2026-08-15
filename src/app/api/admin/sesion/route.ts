import { createAdminSession, deleteAdminSession, isAdminPassword } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  const action = formData?.get("action");

  if (action === "logout") {
    await deleteAdminSession();
    return Response.redirect(new URL("/admin/login", request.url), 303);
  }

  const candidate = formData?.get("password");
  if (action !== "login" || typeof candidate !== "string" || !isAdminPassword(candidate)) {
    return Response.redirect(new URL("/admin/login?error=1", request.url), 303);
  }

  await createAdminSession();
  return Response.redirect(new URL("/admin", request.url), 303);
}
