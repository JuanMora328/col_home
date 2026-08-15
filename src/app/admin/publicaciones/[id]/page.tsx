import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ConfirmAction } from "@/components/confirm-action";
import { Container } from "@/components/container";
import { ListingGallery } from "@/components/listing-gallery";
import { hasAdminSession } from "@/lib/admin-auth";
import { getAdminListing } from "@/lib/admin-listings";
import { getCityDisplayName } from "@/lib/city-display";
import { formatCOP } from "@/lib/currency";

export const metadata: Metadata = { title: "Revisar publicación | Colombia Abriga", robots: { index: false, follow: false } };
const propertyLabels = { APARTMENT: "Apartamento", HOUSE: "Casa", ROOM: "Habitación" } as const;
const availabilityLabels = { RENT: "Arriendo", FREE_TEMPORARY: "Alojamiento temporal gratuito" } as const;
const statusLabels = { PENDING: "Pendiente", PUBLISHED: "Publicada", INACTIVE: "Inactiva" } as const;

export default async function AdminListingPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ message?: string }> }) {
  if (!await hasAdminSession()) redirect("/admin/login");
  const { id } = await params;
  const listing = await getAdminListing(id);
  if (!listing) notFound();
  const message = (await searchParams).message;
  const feedback = message === "published" ? "Vivienda publicada correctamente." : message === "inactive" ? "Vivienda desactivada correctamente." : message ? "No fue posible completar esa acción porque el estado cambió o ocurrió un error." : "";
  const cityName = getCityDisplayName(listing.city_code, listing.city_name);

  return <Container className="py-10 sm:py-14"><Link className="button-secondary" href="/admin">← Volver al panel de moderación</Link>{feedback && <p className="mt-5 rounded-control bg-yellow-soft p-4 font-semibold text-blue" role="status">{feedback}</p>}<article className="mt-6"><header className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><div className="flex flex-wrap items-center gap-3"><p className="eyebrow">Revisión administrativa</p><span className={`status status-${listing.status.toLowerCase()}`}>{statusLabels[listing.status]}</span></div><h1 className="mt-3 font-heading text-3xl font-bold text-blue sm:text-4xl">{propertyLabels[listing.property_type]} en {listing.neighborhood}</h1><p className="mt-2 text-lg text-ink-muted">{cityName}, {listing.department_name}</p></div><p className="font-heading text-2xl font-bold text-primary">{formatCOP(listing.monthly_price)}</p></header><ListingGallery images={listing.images} alt={`${propertyLabels[listing.property_type]} en ${listing.neighborhood}`} /><div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]"><section className="rounded-card bg-white p-6 shadow-soft sm:p-8" aria-labelledby="listing-information"><h2 className="font-heading text-2xl font-semibold" id="listing-information">Información de la vivienda</h2><dl className="mt-6 grid gap-5 sm:grid-cols-2"><Info label="Tipo de inmueble" value={propertyLabels[listing.property_type]} /><Info label="Disponibilidad" value={availabilityLabels[listing.availability_type]} /><Info label="Departamento" value={listing.department_name} /><Info label="Ciudad" value={cityName} /><Info label="Barrio / Vereda" value={listing.neighborhood} /><Info label="Precio mensual" value={formatCOP(listing.monthly_price)} /><Info label="Habitaciones" value={String(listing.bedrooms)} /><Info label="Baños" value={String(listing.bathrooms)} /><Info label="Fecha de creación" value={new Intl.DateTimeFormat("es-CO", { dateStyle: "long", timeStyle: "short" }).format(new Date(listing.created_at))} /></dl><div className="mt-8 border-t border-outline-soft pt-6"><h2 className="font-heading text-xl font-semibold">Descripción completa</h2><p className="mt-3 whitespace-pre-wrap text-ink-muted">{listing.description}</p></div></section><aside className="h-fit rounded-card bg-surface-low p-6 sm:p-8"><h2 className="font-heading text-xl font-semibold">Contacto para revisión</h2><dl className="mt-5 space-y-4"><Info label="Nombre" value={listing.contact_name} /><Info label="WhatsApp" value={listing.contact_phone} /></dl><div className="mt-7 flex flex-col gap-3 border-t border-outline-soft pt-6">{listing.status === "PENDING" && <ConfirmAction action={`/api/admin/publicaciones/${id}/publicar`} triggerLabel="Publicar vivienda" title="¿Publicar esta vivienda?" description="La vivienda quedará visible públicamente y podrá aparecer en las búsquedas de Colombia Abriga." confirmLabel="Sí, publicar vivienda" />}{listing.status !== "INACTIVE" && <ConfirmAction action={`/api/admin/publicaciones/${id}/desactivar`} triggerLabel={listing.status === "PENDING" ? "Rechazar" : "Desactivar"} title="¿Desactivar esta vivienda?" description="La vivienda dejará de estar disponible públicamente en Colombia Abriga." confirmLabel="Sí, desactivar" destructive />}</div></aside></div></article></Container>;
}

function Info({ label, value }: { label: string; value: string }) { return <div><dt className="text-xs font-bold uppercase tracking-wide text-ink-muted">{label}</dt><dd className="mt-1 break-words font-semibold">{value}</dd></div>; }
