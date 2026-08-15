import Link from "next/link";
import { Container } from "@/components/container";

export function Footer() {
  return (
    <footer className="border-t border-outline-soft bg-surface-container">
      <Container className="flex flex-col gap-3 py-8 sm:flex-row sm:items-start sm:justify-between">
        <Link
          href="/"
          className="font-heading text-lg font-semibold text-ink hover:text-primary"
        >
          Colombia Abriga
        </Link>
        <p className="max-w-2xl text-sm text-ink-muted sm:text-right">
          Colombia Abriga facilita el contacto entre anunciantes y personas
          interesadas y no participa en pagos, contratos ni transacciones. ©{" "}
          {new Date().getFullYear()}
        </p>
      </Container>
    </footer>
  );
}
