import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/container";
import { formatCOP } from "@/lib/currency";
import { getCityDisplayName } from "@/lib/city-display";
import { hasAdminSession } from "@/lib/admin-auth";
import { getAdminListings, type AdminListing } from "@/lib/admin-listings";
import type { ListingStatus } from "@/types/data";

export const metadata: Metadata = { title: "Moderación | Colombia Abriga", robots: { index: false, follow: false } };
const statusLabels = { PENDING: "Pendiente", PUBLISHED: "Publicada", INACTIVE: "Inactiva" } as const;
const propertyLabels = { APARTMENT: "Apartamento", HOUSE: "Casa", ROOM: "Habitación" } as const;
const availabilityLabels = { RENT: "Arriendo", FREE_TEMPORARY: "Alojamiento temporal gratuito" } as const;

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  if (!await hasAdminSession()) redirect("/admin/login");
  const result = await getAdminListings();
  const listings = result.listings;
  const message = (await searchParams).message;
  const feedback = message === "published" ? "Vivienda publicada correctamente." : message === "inactive" ? "Vivienda desactivada correctamente." : message ? "No fue posible completar esa acción." : "";
  return <Container className="py-10 sm:py-14"><header className="flex flex-col gap-5 border-b border-outline-soft pb-7 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Entorno privado</p><h1 className="font-heading text-3xl font-bold text-blue sm:text-4xl">Moderación de viviendas</h1><p className="mt-2 text-ink-muted">Revisa la información y las fotos antes de publicar.</p></div><form action="/api/admin/sesion" method="post"><input type="hidden" name="action" value="logout" /><button className="button-secondary" type="submit">Cerrar sesión</button></form></header>{feedback && <p className="mt-6 rounded-control bg-yellow-soft p-4 font-semibold text-blue" role="status">{feedback}</p>}{result.error ? <div className="empty-state mt-10" role="alert"><h2 className="font-heading text-xl font-semibold text-ink">No pudimos cargar las publicaciones</h2><p className="mt-2">Intenta recargar la página. Si el problema continúa, revisa la conexión y configuración de Supabase.</p></div> : (["PENDING", "PUBLISHED", "INACTIVE"] as ListingStatus[]).map((status) => { const rows = listings.filter((listing) => listing.status === status); return <section className="mt-12" key={status} aria-labelledby={`heading-${status}`}><div className="flex items-baseline gap-3"><h2 className="font-heading text-2xl font-semibold" id={`heading-${status}`}>{statusLabels[status]}</h2><span className="chip-neutral">{rows.length}</span></div>{rows.length ? <div className="mt-6 space-y-7">{rows.map((listing) => <AdminCard listing={listing} key={listing.id} />)}</div> : <p className="mt-4 rounded-card bg-surface-low p-6 text-ink-muted">No hay publicaciones en este estado.</p>}</section>; })}</Container>;
}

function AdminCard({ listing }: { listing: AdminListing }) {
  const primary = listing.images[0];
  const cityName = getCityDisplayName(listing.city_code, listing.city_name);
  return <article className="overflow-hidden rounded-card border border-outline-soft bg-white shadow-soft"><div className="grid lg:grid-cols-[20rem_1fr]">{primary ? <div className="relative min-h-64 bg-surface-high"><Image src={primary.url} alt={`Foto principal de vivienda en ${listing.neighborhood}`} fill unoptimized className="object-cover" sizes="(min-width: 1024px) 320px, 100vw" /></div> : <div className="housing-placeholder min-h-56"><span aria-hidden="true">⌂</span><b>Vivienda sin foto disponible</b></div>}<div className="p-6 sm:p-8"><div className="flex flex-wrap items-center justify-between gap-3"><span className={`status status-${listing.status.toLowerCase()}`}>{statusLabels[listing.status]}</span><time className="text-sm text-ink-muted" dateTime={listing.created_at}>{new Intl.DateTimeFormat("es-CO", { dateStyle: "long", timeStyle: "short" }).format(new Date(listing.created_at))}</time></div><h3 className="mt-4 font-heading text-2xl font-semibold">{propertyLabels[listing.property_type]} en {listing.neighborhood}</h3><p className="text-ink-muted">{cityName}, {listing.department_name}</p><dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4"><Info label="Precio" value={formatCOP(listing.monthly_price)} /><Info label="Habitaciones" value={String(listing.bedrooms)} /><Info label="Baños" value={String(listing.bathrooms)} /><Info label="Disponibilidad" value={availabilityLabels[listing.availability_type]} /></dl><p className="mt-5 line-clamp-3 whitespace-pre-wrap text-ink-muted">{listing.description}</p><div className="mt-7"><Link className="button-secondary" href={`/admin/publicaciones/${listing.id}`}>Ver detalle</Link></div></div></div></article>;
}
function Info({ label, value }: { label: string; value: string }) { return <div><dt className="text-xs font-bold uppercase tracking-wide text-ink-muted">{label}</dt><dd className="mt-1 font-semibold">{value}</dd></div>; }
