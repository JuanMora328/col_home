import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { ListingGallery } from "@/components/listing-gallery";
import { getPublishedListing } from "@/lib/listings";
import { formatCOP } from "@/lib/currency";

const propertyLabels = { APARTMENT: "Apartamento", HOUSE: "Casa", ROOM: "Habitación" } as const;
const availabilityLabels = { RENT: "Arriendo", FREE_TEMPORARY: "Alojamiento temporal gratuito" } as const;

type PageProps = { params: Promise<{ id: string }>; searchParams: Promise<{ from?: string | string[] }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const listing = await getPublishedListing((await params).id);
  if (!listing) return { title: "Vivienda no encontrada | Colombia Abriga", robots: { index: false, follow: false } };
  const title = `${propertyLabels[listing.property_type]} en ${listing.neighborhood}, ${listing.city_name} | Colombia Abriga`;
  const description = `${propertyLabels[listing.property_type]} en ${listing.neighborhood}, ${listing.city_name}, ${listing.department_name}. ${listing.bedrooms} habitaciones y ${listing.bathrooms} baños.`;
  return { title, description, openGraph: { title, description, type: "website" } };
}

export default async function ListingPage({ params, searchParams }: PageProps) {
  const listing = await getPublishedListing((await params).id);
  if (!listing) notFound();
  const requestedFrom = (await searchParams).from;
  const backHref = typeof requestedFrom === "string" && requestedFrom.startsWith("/buscar") && !requestedFrom.startsWith("//") ? requestedFrom : "/buscar";
  const message = `Hola, vi tu vivienda publicada en Colombia Abriga. Estoy interesado en la vivienda ubicada en ${listing.neighborhood}, ${listing.city_name}. ¿Sigue disponible?`;
  const whatsappHref = `https://wa.me/${listing.contact_phone}?text=${encodeURIComponent(message)}`;
  const imageAlt = `${propertyLabels[listing.property_type]} en ${listing.neighborhood}, ${listing.city_name}`;

  return <Container className="py-10 sm:py-14">
    <Link href={backHref} className="inline-flex min-h-11 items-center font-semibold text-primary hover:text-primary-hover">← Volver a resultados</Link>
    <article className="mt-6">
      <header className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div><p className="mb-2 text-sm font-semibold uppercase tracking-wider text-secondary">{availabilityLabels[listing.availability_type]}</p><h1 className="font-heading text-3xl font-semibold sm:text-4xl">{propertyLabels[listing.property_type]} en {listing.neighborhood}</h1><p className="mt-2 text-lg text-ink-muted">{listing.neighborhood}, {listing.city_name}, {listing.department_name}</p></div>
        <div className="shrink-0 md:text-right">{listing.monthly_price === 0 ? <><p className="text-sm font-bold text-secondary">ALOJAMIENTO GRATUITO</p><p className="font-heading text-3xl font-bold">$0</p></> : <p className="font-heading text-2xl font-bold text-primary sm:text-3xl">{formatCOP(listing.monthly_price)} <span className="text-base font-normal text-ink">/ mes</span></p>}</div>
      </header>
      <ListingGallery images={listing.images} alt={imageAlt} />
      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(17rem,1fr)]">
        <div><div className="flex flex-wrap gap-3 border-b border-outline-soft pb-6"><span className="chip-neutral">{propertyLabels[listing.property_type]}</span><span className="chip-neutral">{listing.bedrooms} {listing.bedrooms === 1 ? "habitación" : "habitaciones"}</span><span className="chip-neutral">{listing.bathrooms} {listing.bathrooms === 1 ? "baño" : "baños"}</span></div><section className="mt-8"><h2 className="font-heading text-2xl font-semibold">Sobre esta vivienda</h2><p className="mt-4 whitespace-pre-wrap text-lg text-ink-muted">{listing.description}</p></section></div>
        <aside className="h-fit rounded-card bg-white p-6 shadow-soft sm:p-8"><h2 className="font-heading text-xl font-semibold">Contacta a {listing.contact_name}</h2><p className="mt-3 text-ink-muted">Pregunta directamente si la vivienda sigue disponible.</p><a className="button-primary mt-6 w-full text-center" href={whatsappHref} target="_blank" rel="noopener noreferrer">Contactar por WhatsApp<span className="sr-only"> (abre en una pestaña nueva)</span></a><p className="mt-6 border-t border-outline-soft pt-5 text-sm text-ink-muted"><strong className="text-ink">Tu seguridad es importante.</strong><br />Verifica personalmente la vivienda y la identidad del anunciante antes de realizar pagos o transferencias.</p></aside>
      </div>
    </article>
  </Container>;
}
