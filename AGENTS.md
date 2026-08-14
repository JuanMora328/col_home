<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Colombia Abriga: reglas del proyecto

## Antes de implementar

- Lee `prompt_master.md`, `PROJECT.md` y `docs/design/DESIGN.md` completos.
- Inspecciona las referencias y exportaciones de `docs/design/`; sirven como guía,
  no como código para copiar.
- Consulta la documentación incluida en `node_modules/next/dist/docs/` antes de
  usar una API o convención de Next.js.
- Revisa el árbol de trabajo y conserva la configuración existente salvo que un
  cambio sea imprescindible.

## Prioridades y alcance

- El producto se limita al recorrido **PUBLICAR → ENCONTRAR → CONTACTAR**.
- `docs/design/DESIGN.md` es la fuente de verdad visual.
- `PROJECT.md` y la especificación funcional son la fuente de verdad funcional y
  prevalecen sobre Stitch cuando exista una contradicción.
- No agregues funciones porque aparezcan en una captura. En particular, no
  implementes guardar borrador, “Nuestra misión”, Wi-Fi, amoblado, servicios
  incluidos, amenities ni “Disponibilidad inmediata” como modelo funcional.
- Mantén una arquitectura pequeña, Server Components por defecto, TypeScript
  estricto y componentes cliente solo cuando haya interactividad real.
- No instales dependencias ni introduzcas capas de abstracción sin necesidad.

## Calidad

- Conserva labels visibles, semántica HTML, foco perceptible, contraste y soporte
  de teclado.
- La interfaz es un sitio web responsive, no una aplicación móvil ni una PWA.
- Antes de cerrar una fase ejecuta `npm run lint`, `npm run typecheck` y
  `npm run build`, y revisa el diff para detectar trabajo fuera de alcance.
