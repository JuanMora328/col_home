import Link from "next/link";
import { Container } from "@/components/container";

export function Footer() {
  return (
    <footer className="border-t border-outline-soft bg-surface-container">
      <Container className="flex flex-col gap-3 py-8 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="font-heading text-lg font-semibold text-ink hover:text-primary"
        >
          Colombia Abriga
        </Link>
        <p className="text-sm text-ink-muted">
          Una iniciativa ciudadana para la vivienda solidaria.
        </p>
      </Container>
    </footer>
  );
}
