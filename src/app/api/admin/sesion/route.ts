import { createAdminSession, deleteAdminSession, isAdminPassword } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  const action = formData?.get("action");

  if (action === "logout") {
    await deleteAdminSession();
    return redirect("/admin/login");
  }

  const candidate = formData?.get("password");
  if (action !== "login" || typeof candidate !== "string" || !isAdminPassword(candidate)) {
    return redirect("/admin/login?error=1");
  }

  await createAdminSession();
  return redirect("/admin");
}

function redirect(location: string): Response {
  return new Response(null, { status: 303, headers: { location } });
}
