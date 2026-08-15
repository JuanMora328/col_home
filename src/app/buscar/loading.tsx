import { Container } from "@/components/container";
export default function Loading() {
  return (
    <Container className="py-20">
      <p role="status" className="text-lg">
        Cargando viviendas…
      </p>
    </Container>
  );
}
