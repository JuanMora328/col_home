import Link from "next/link";
import { Container } from "@/components/container";
import { ListingCard } from "@/components/listing-card";
import { LocationFields } from "@/components/location-fields";
import { getDepartments, isCityInDepartment } from "@/lib/colombia";
import { searchListings } from "@/lib/listings";
import { AVAILABILITY_TYPES, PROPERTY_TYPES } from "@/types/data";

type Params = Record<string, string | string[] | undefined>;
const one = (value: string | string[] | undefined) => typeof value === "string" ? value : "";
const integer = (value: string) => /^\d+$/.test(value) ? Number(value) : undefined;

export default async function SearchPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const department = one(params.department); const requestedCity = one(params.city);
  const city = department && isCityInDepartment(department, requestedCity) ? requestedCity : "";
  const propertyType = PROPERTY_TYPES.includes(one(params.propertyType) as never) ? one(params.propertyType) : "";
  const availabilityType = AVAILABILITY_TYPES.includes(one(params.availabilityType) as never) ? one(params.availabilityType) : "";
  const page = Math.max(1, integer(one(params.page)) ?? 1);
  const filters = { department: getDepartments().some((d) => d.code === department) ? department : "", city, maxPrice: integer(one(params.maxPrice)), propertyType, minBedrooms: integer(one(params.minBedrooms)), availabilityType, page };
  const result = await searchListings(filters);
  const makePage = (nextPage: number) => { const next = new URLSearchParams(); Object.entries(params).forEach(([key, value]) => { if (typeof value === "string" && key !== "page" && value) next.set(key, value); }); next.set("page", String(nextPage)); return `/buscar?${next}`; };
  const pages = Math.ceil(result.count / result.pageSize);
  return <Container className="py-12 sm:py-16"><Link href="/" className="font-semibold text-primary">← Volver al inicio</Link><h1 className="mt-5 font-heading text-3xl font-semibold sm:text-4xl">Viviendas disponibles</h1><p className="mt-2 text-lg text-ink-muted">{result.count} {result.count === 1 ? "hogar encontrado" : "hogares encontrados"}</p>
    <form className="mt-10 grid gap-4 rounded-card border-2 border-outline-soft bg-surface-container p-5 md:grid-cols-3 lg:grid-cols-6" action="/buscar"><LocationFields departments={getDepartments()} initialDepartment={filters.department} initialCity={filters.city} compact /><label className="field"><span>Presupuesto máximo</span><input className="control" name="maxPrice" type="number" min="0" defaultValue={filters.maxPrice} /></label><label className="field"><span>Tipo de vivienda</span><select className="control" name="propertyType" defaultValue={propertyType}><option value="">Todos</option><option value="APARTMENT">Apartamento</option><option value="HOUSE">Casa</option><option value="ROOM">Habitación</option></select></label><label className="field"><span>Habitaciones mínimas</span><input className="control" name="minBedrooms" type="number" min="0" defaultValue={filters.minBedrooms} /></label><label className="field"><span>Disponibilidad</span><select className="control" name="availabilityType" defaultValue={availabilityType}><option value="">Todas</option><option value="RENT">Arriendo</option><option value="FREE_TEMPORARY">Alojamiento gratuito</option></select></label><button className="button-primary md:col-span-3 lg:col-span-6" type="submit">Filtrar viviendas</button></form>
    {result.error ? <div className="empty-state mt-10"><p className="font-semibold">No pudimos cargar las viviendas en este momento.</p><p>Inténtalo de nuevo más tarde.</p></div> : result.listings.length ? <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{result.listings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}</div> : <div className="empty-state mt-10"><p className="font-semibold">No encontramos viviendas con estos filtros.</p><p>Prueba ampliando tu presupuesto o cambiando alguno de los filtros.</p></div>}
    {pages > 1 && <nav aria-label="Paginación" className="mt-10 flex items-center justify-center gap-4">{page > 1 && <Link className="button-secondary" href={makePage(page - 1)}>Anterior</Link>}<span>Página {page} de {pages}</span>{page < pages && <Link className="button-secondary" href={makePage(page + 1)}>Siguiente</Link>}</nav>}
  </Container>;
}
