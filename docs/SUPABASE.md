# Fase 1: Supabase y datos

## Configuración

La aplicación usa `@supabase/supabase-js`, sin Auth ni sesiones. Copia
`.env.example` a `.env.local` y configura:

- `NEXT_PUBLIC_SUPABASE_URL`: URL del proyecto.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: clave pública limitada por RLS.
- `SUPABASE_SECRET_KEY`: clave privilegiada, solo para código server-side.

El cliente público se crea bajo demanda en `src/lib/supabase/public.ts`. El
cliente privilegiado vive en `src/lib/supabase/server.ts` y está protegido por
`server-only`; jamás debe importarse en un Client Component, registrarse ni
serializarse. Las variables se validan al crear un cliente, no al importar el
módulo, para permitir builds sin credenciales.

## Aplicar y comprobar la migration

Esta entrega **no aplica** cambios a un proyecto remoto: el entorno no contiene
la Secret Key ni credenciales administrativas de base de datos.

1. Vincula el proyecto con Supabase CLI y ejecuta `supabase db push`, o abre el
   SQL Editor y ejecuta, una sola vez y en orden, el contenido de
   `supabase/migrations/20260814000000_phase_1_data_infrastructure.sql`.
2. Ejecuta `supabase/verify_phase_1.sql` en el SQL Editor. Las consultas son de
   solo lectura y comprueban tablas, RLS, policies, bucket e índices.

La migration crea `listings`, `listing_images`, sus constraints, el trigger de
`updated_at` y seis índices ajustados a búsquedas de publicaciones por fecha,
ubicación, precio, tipo, disponibilidad y habitaciones. No incluye seeds.

RLS permite al rol `anon` leer únicamente listings `PUBLISHED` y sus imágenes.
Al no existir policies de escritura, no hay INSERT, UPDATE ni DELETE públicos.
La Secret Key puede evadir RLS: toda escritura futura del servidor debe validar
la entrada y, en Fase 3, imponer `status = 'PENDING'` sin aceptar el status del
navegador.

## Storage privado

`listing-images` es privado, admite JPEG, PNG y WebP, y limita cada objeto a
6 MiB. No se crean policies sobre `storage.objects`. En Fase 3, el servidor
generará un path opaco `listings/{listingUuid}/{randomUuid}.{ext}` y una signed
upload URL; el navegador subirá directamente. Solo `storage_path` se guardará
en PostgreSQL. La lectura futura también empleará signed URLs server-side.
`createListingImageStoragePath` valida el UUID, elige la extensión desde un MIME
permitido y nunca incorpora nombres originales ni datos personales. El máximo
lógico de cinco imágenes se validará en Fase 3.

## DIVIPOLA

`src/data/colombia.json` fue generado desde los endpoints oficiales vigentes del
[Geovisor DIVIPOLA del DANE](https://geoportal.dane.gov.co/geovisores/territorio/consulta-divipola-division-politico-administrativa-de-colombia/):
`departamentos.php` y `municipios.php`. Contiene 33 departamentos y 1.103
municipios/distritos vigentes; excluye registros oficiales de tipo `ANM` e
`ISLA`, centros poblados, geometrías y coordenadas. Los códigos son strings, se
deduplican por código y los nombres se conservan como los entrega DANE.

Para regenerarlo desde la fuente oficial ejecuta:

```bash
node scripts/update-colombia-data.mjs
```

El script valida respuestas no vacías y ordena departamentos y municipios con
collation `es-CO`. En redes que exijan proxy con Node.js 24 puede requerirse
`NODE_USE_ENV_PROXY=1`.
