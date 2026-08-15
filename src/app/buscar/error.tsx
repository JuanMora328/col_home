"use client";
import { Container } from "@/components/container";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <Container className="py-20">
      <div className="empty-state">
        <h1 className="font-heading text-2xl font-semibold">
          No pudimos cargar las viviendas.
        </h1>
        <p>Inténtalo nuevamente.</p>
        <button className="button-primary mt-4" onClick={reset}>
          Reintentar
        </button>
      </div>
    </Container>
  );
}
