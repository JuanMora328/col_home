import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/container";
import { hasAdminSession } from "@/lib/admin-auth";
import { login } from "../actions";

export const metadata: Metadata = { title: "Acceso de moderación | Colombia Abriga", robots: { index: false, follow: false } };

export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await hasAdminSession()) redirect("/admin");
  const error = (await searchParams).error;
  return <Container className="py-16 sm:py-24"><section className="mx-auto max-w-md rounded-card border border-outline-soft bg-white p-7 shadow-soft sm:p-10"><p className="eyebrow">Entorno privado</p><h1 className="mt-2 font-heading text-3xl font-bold text-blue">Moderación</h1><p className="mt-3 text-ink-muted">Ingresa la contraseña administrativa para revisar publicaciones.</p><form action={login} className="mt-8 space-y-5"><label className="field"><span>Contraseña administrativa</span><input className="control" name="password" type="password" autoComplete="current-password" required autoFocus /></label>{error && <p className="error-message" role="alert">La contraseña no es correcta.</p>}<button className="button-primary w-full" type="submit">Ingresar</button></form></section></Container>;
}
