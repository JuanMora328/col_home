import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PublicationForm } from "@/components/publication-form";
import { getDepartments } from "@/lib/colombia";
export const metadata: Metadata = {
  title: "Publicar vivienda | Colombia Abriga",
  description: "Publica una vivienda disponible para conectar con personas que buscan un hogar en Colombia.",
};
export default function PublishPage() { return <Container className="py-12 sm:py-16"><div className="mx-auto max-w-3xl"><h1 className="font-heading text-3xl font-bold sm:text-5xl">Publica una vivienda disponible</h1><p className="mt-4 text-lg text-ink-muted">Comparte tu espacio para ayudar a construir comunidad. Proporciona detalles precisos para facilitar el encuentro.</p><div className="mt-10"><PublicationForm departments={getDepartments()} /></div></div></Container>; }
