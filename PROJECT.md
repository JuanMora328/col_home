# Colombia Abriga

## Propósito

Colombia Abriga es un sitio web solidario, exclusivo para Colombia, que conecta
a personas que necesitan vivienda con personas que tienen una casa, apartamento
o habitación disponible. No pretende ser un portal inmobiliario completo.

El producto se resume en un único recorrido:

1. **PUBLICAR:** una persona ofrece un espacio de forma sencilla.
2. **ENCONTRAR:** otra persona busca y filtra viviendas disponibles.
3. **CONTACTAR:** la persona interesada abre una conversación con el anunciante
   mediante WhatsApp.

Cada pantalla, dato y decisión técnica debe contribuir directamente a ese flujo.

## Fuentes de verdad

- **Visual:** `docs/design/DESIGN.md` define el lenguaje visual, la paleta, la
  tipografía, el espaciado, los contenedores, radios, controles, tarjetas,
  sombras y jerarquía. Las imágenes y exportaciones de Stitch en `docs/design/`
  complementan esa dirección y no deben copiarse ciegamente.
- **Funcional:** este documento y `prompt_master.md` definen el comportamiento
  del producto. Si una captura de Stitch contradice la especificación funcional,
  **la especificación funcional tiene prioridad**.

## Alcance funcional previsto

- Publicar una vivienda mediante un formulario único y sencillo.
- Buscar y filtrar viviendas por datos relevantes.
- Ver los datos públicos de una vivienda, sin dirección exacta.
- Contactar al anunciante mediante WhatsApp.
- Operar únicamente con departamentos y municipios oficiales de Colombia.
- Someter publicaciones nuevas a moderación manual antes de hacerlas públicas.

Las integraciones de datos, publicación, búsqueda y contacto pertenecen a fases
posteriores; la Fase 0 solo establece documentación, arquitectura y shell visual.

## Fuera de alcance

No se implementarán registro, inicio de sesión, cuentas, perfiles, panel de
usuario, favoritos, chat, pagos, reservas, contratos, mapas, geolocalización,
reseñas, comentarios, notificaciones, mensajería interna, recomendaciones,
inteligencia artificial, herramientas para inmobiliarias, analytics avanzados,
CMS, panel administrativo, aplicación móvil ni PWA.

Tampoco forman parte del producto: **Guardar borrador**, una sección funcional
de **Nuestra misión**, Wi-Fi, amoblado, servicios incluidos, parqueadero, baño
compartido, mascotas, amenities o **Disponibilidad inmediata** como modelo
funcional. La disponibilidad se modelará posteriormente como **Arriendo** o
**Alojamiento temporal gratuito**.

## Arquitectura

- Next.js con App Router, React, TypeScript estricto, Tailwind CSS y ESLint.
- Frontend y lógica server-side permanecen en el mismo proyecto.
- Server Components por defecto; Client Components solo para interacción real.
- Componentes compartidos pequeños en `src/components/` y rutas en `src/app/`.
- Sin backend separado, microservicios, patrones de repositorio ni capas de
  servicios artificiales.
- La Fase 1 incorpora Supabase PostgreSQL y Storage mediante una migration
  reproducible, clientes público/privilegiado separados y el dataset local
  oficial DIVIPOLA. La configuración, aplicación y comprobación están descritas
  en `docs/SUPABASE.md`.

## Dirección visual y accesibilidad

La interfaz debe sentirse cálida, humana, tranquila y confiable: superficies de
pergamino, terracota como color principal, verde natural como acento, carbón en
el texto, Montserrat en titulares e Inter en cuerpo. Se emplean contenedores de
hasta 1200 px, aire generoso, esquinas suaves y sombras mínimas.

El sitio será responsive desde 320 px hasta escritorio grande, mantendrá labels
visibles, estructura semántica, navegación por teclado, foco perceptible y
contraste suficiente. No se añadirán patrones de app nativa, glassmorphism,
efectos 3D, gradientes decorativos ni animaciones excesivas.
