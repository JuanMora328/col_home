import Link from "next/link";
import { Container } from "@/components/container";

export default function Home() {
  return (
    <Container className="py-20 sm:py-28 lg:py-36">
      <section className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <p className="mb-5 text-sm font-semibold tracking-[0.14em] text-secondary uppercase">
          Vivienda solidaria en Colombia
        </p>
        <h1 className="max-w-3xl font-heading text-[2rem] leading-[1.2] font-bold tracking-[0.02em] text-ink sm:text-5xl">
          Encuentra un hogar cerca de ti
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-muted">
          Una forma sencilla de conectar personas que necesitan vivienda con
          quienes tienen un espacio disponible.
        </p>

        <div className="mt-10 flex w-full max-w-xl flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/encontrar"
            className="inline-flex min-h-12 flex-1 items-center justify-center rounded-control bg-primary px-6 py-3 text-sm font-semibold tracking-wide text-white shadow-soft transition-colors hover:bg-primary-hover"
          >
            Encontrar vivienda
          </Link>
          <Link
            href="/publicar"
            className="inline-flex min-h-12 flex-1 items-center justify-center rounded-control border-2 border-secondary px-6 py-3 text-sm font-semibold tracking-wide text-ink transition-colors hover:bg-secondary-soft"
          >
            Publicar vivienda
          </Link>
        </div>

        <p className="mt-12 font-heading text-sm font-semibold tracking-[0.12em] text-ink-muted uppercase">
          Publicar <span aria-hidden="true">→</span> Encontrar{" "}
          <span aria-hidden="true">→</span> Contactar
        </p>
      </section>
    </Container>
  );
}
