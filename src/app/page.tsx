import Link from "next/link";
import { Container } from "@/components/container";
import { ListingCard } from "@/components/listing-card";
import { SearchForm } from "@/components/search-form";
import { getRecentListings } from "@/lib/listings";

export default async function Home() {
  const listings = await getRecentListings();
  return <>
    <Container className="py-16 sm:py-24"><section className="mx-auto flex max-w-4xl flex-col items-center text-center"><h1 className="max-w-3xl font-heading text-[2rem] leading-[1.2] font-bold tracking-[.02em] sm:text-5xl">Encuentra un hogar<br className="hidden sm:block" /> cerca de ti</h1><p className="mt-6 max-w-2xl text-lg text-ink-muted">Una forma sencilla de conectar personas que necesitan vivienda con quienes tienen un espacio disponible.</p><div className="mt-8 w-full"><SearchForm /></div><div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-ink-muted"><span>¿Tienes una vivienda disponible?</span><Link href="/publicar" className="button-secondary">Publicar vivienda</Link></div></section></Container>
    <Container className="border-t border-surface-high py-16 sm:py-20"><h2 className="font-heading text-2xl font-semibold sm:text-3xl">Viviendas disponibles recientemente</h2>{listings.length ? <><div className="mt-10 grid gap-6 md:grid-cols-3">{listings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}</div><div className="mt-10 text-center"><Link className="button-secondary" href="/buscar">Ver más viviendas</Link></div></> : <div className="empty-state mt-8"><p className="font-semibold">Todavía no hay viviendas publicadas.</p><p>Vuelve pronto para conocer nuevos espacios disponibles.</p></div>}</Container>
  </>;
}
