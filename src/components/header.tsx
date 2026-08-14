import Link from "next/link";
import { Container } from "@/components/container";

export function Header() {
  return (
    <header className="border-b border-outline-soft/60 bg-surface">
      <Container className="flex min-h-24 flex-col justify-center gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="font-heading text-2xl font-bold tracking-[0.02em] text-primary sm:text-3xl"
        >
          Colombia Abriga
        </Link>
        <nav aria-label="Navegación principal">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-semibold">
            <li>
              <Link
                href="/encontrar"
                className="text-ink-muted transition-colors hover:text-primary"
              >
                Encontrar vivienda
              </Link>
            </li>
            <li>
              <Link
                href="/publicar"
                className="inline-flex min-h-11 items-center justify-center rounded-control bg-primary px-5 py-2 text-white shadow-soft transition-colors hover:bg-primary-hover"
              >
                Publicar vivienda
              </Link>
            </li>
          </ul>
        </nav>
      </Container>
    </header>
  );
}
