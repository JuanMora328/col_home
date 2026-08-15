import Link from "next/link";
import { Container } from "@/components/container";

export default function NotFound() {
  return (
    <Container className="py-20 sm:py-28">
      <section className="empty-state mx-auto max-w-2xl">
        <p className="font-heading text-lg font-semibold text-primary">404</p>
        <h1 className="mt-2 font-heading text-3xl font-bold">
          No encontramos esta vivienda
        </h1>
        <p className="mx-auto mt-4 max-w-lg">
          La página no existe o la vivienda no está disponible públicamente.
        </p>
        <Link href="/buscar" className="button-primary mt-7">
          Buscar viviendas
        </Link>
      </section>
    </Container>
  );
}
