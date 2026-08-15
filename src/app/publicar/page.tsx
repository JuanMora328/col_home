import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PublicationForm } from "@/components/publication-form";
import { getDepartments } from "@/lib/colombia";
export const metadata: Metadata = {
  title: "Publicar vivienda | Colombia Abriga",
  description:
    "Publica una vivienda disponible para conectar con personas que buscan un hogar en Colombia.",
};
export default function PublishPage() {
  return (
    <Container className="py-8 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <p className="eyebrow">Ofrece un espacio</p>
          <h1 className="mt-2 font-heading text-3xl leading-tight font-bold text-blue sm:text-4xl lg:text-[2.75rem]">
            Publica una vivienda disponible
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
            Comparte tu espacio para ayudar a construir comunidad. Proporciona
            detalles precisos para facilitar el encuentro.
          </p>
        </header>
        <div className="mt-7 sm:mt-9">
          <PublicationForm departments={getDepartments()} />
        </div>
      </div>
    </Container>
  );
}
