import Image from "next/image";
import Link from "next/link";
import type { ListingPreview } from "@/lib/listings";
import { formatCOP } from "@/lib/currency";
import { getCityDisplayName } from "@/lib/city-display";

const types = { APARTMENT: "Apartamento", HOUSE: "Casa", ROOM: "Habitación" };

function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (/^57\d{10}$/.test(digits)) {
    const local = digits.slice(2);
    return `+57 ${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;
  }

  return phone;
}

export function ListingCard({
  listing,
  detailHref = `/vivienda/${listing.id}`,
}: {
  listing: ListingPreview;
  detailHref?: string;
}) {
  const cityName = getCityDisplayName(listing.city_code, listing.city_name);
  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-card bg-white shadow-soft">
      {listing.imageUrl ? (
        <div className="relative aspect-[16/9]">
          <Image
            src={listing.imageUrl}
            alt="Fotografía de la vivienda"
            fill
            unoptimized
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
        </div>
      ) : (
        <div
          className="flex aspect-[16/9] items-center justify-center bg-surface-high text-sm text-ink-muted"
          role="img"
          aria-label="Vivienda sin fotografía disponible"
        >
          <span className="text-center">
            <b className="block text-3xl">⌂</b>Imagen no disponible
          </span>
        </div>
      )}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <span className="chip self-start">{types[listing.property_type]}</span>
        <h3 className="mt-3 font-heading text-xl leading-snug font-semibold">
          <Link className="rounded-sm hover:text-primary" href={detailHref}>
            {listing.neighborhood}
            <span className="sr-only">, {cityName}: ver vivienda</span>
          </Link>
        </h3>
        <p className="mt-1 text-ink-muted">{cityName}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <span className="chip-neutral">{listing.bedrooms} hab.</span>
          <span className="chip-neutral">{listing.bathrooms} baños</span>
        </div>
        <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-ink-muted sm:text-base">
          {listing.description}
        </p>
        <p className="mt-3 truncate text-sm text-ink-muted">
          <span className="font-semibold text-ink">WhatsApp:</span>{" "}
          {formatPhone(listing.contact_phone)}
        </p>
        <div className="mt-5 flex flex-1 flex-wrap items-end justify-between gap-4 border-t border-surface-high pt-4">
          <div>
            {listing.monthly_price === 0 ? (
              <>
                <p className="text-xs font-semibold tracking-wide text-secondary">
                  ALOJAMIENTO GRATUITO
                </p>
                <p className="text-xl font-bold">$0</p>
              </>
            ) : (
              <p className="text-xl leading-tight font-bold">
                {formatCOP(listing.monthly_price)}{" "}
                <span className="text-sm font-normal whitespace-nowrap">
                  / mes
                </span>
              </p>
            )}
          </div>
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-control border-2 border-blue px-4 text-sm font-bold text-blue transition-colors hover:bg-secondary-soft"
            href={detailHref}
          >
            Ver detalle
          </Link>
        </div>
      </div>
    </article>
  );
}
