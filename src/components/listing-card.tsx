import Image from "next/image";
import Link from "next/link";
import type { ListingPreview } from "@/lib/listings";

const types = { APARTMENT: "Apartamento", HOUSE: "Casa", ROOM: "Habitación" };
const money = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

export function ListingCard({ listing, detailHref = `/vivienda/${listing.id}` }: { listing: ListingPreview; detailHref?: string }) {
  return <article className="overflow-hidden rounded-card bg-white shadow-soft">
    {listing.imageUrl ? <div className="relative aspect-[16/9]"><Image src={listing.imageUrl} alt="Fotografía de la vivienda" fill unoptimized className="object-cover" sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" /></div> : <div className="flex aspect-[16/9] items-center justify-center bg-surface-high text-sm text-ink-muted" role="img" aria-label="Vivienda sin fotografía disponible"><span className="text-center"><b className="block text-3xl">⌂</b>Imagen no disponible</span></div>}
    <div className="p-6"><span className="chip">{types[listing.property_type]}</span><h3 className="mt-4 font-heading text-xl font-semibold"><Link className="rounded-sm hover:text-primary" href={detailHref}>{listing.neighborhood}<span className="sr-only">, {listing.city_name}: ver vivienda</span></Link></h3><p className="mt-1 text-ink-muted">{listing.city_name}</p><div className="mt-4 flex gap-2 text-sm"><span className="chip-neutral">{listing.bedrooms} hab.</span><span className="chip-neutral">{listing.bathrooms} baños</span></div><div className="mt-5 border-t border-surface-high pt-4">{listing.monthly_price === 0 ? <><p className="text-sm font-semibold text-secondary">ALOJAMIENTO GRATUITO</p><p className="text-xl font-bold">$0</p></> : <p className="text-xl font-bold">{money.format(listing.monthly_price)} <span className="text-base font-normal">/ mes</span></p>}</div></div>
  </article>;
}
