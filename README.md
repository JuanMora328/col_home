# Colombia Abriga

Colombia Abriga es un sitio web solidario para Colombia que conecta a personas que necesitan vivienda con quienes tienen una casa, apartamento o habitación disponible. Su alcance es deliberadamente pequeño: **PUBLICAR → ENCONTRAR → CONTACTAR por WhatsApp**.

## Stack

- Next.js 16 (App Router), React 19 y TypeScript estricto.
- Tailwind CSS 4 y ESLint.
- Supabase PostgreSQL y un bucket privado de Storage.
- Vercel como plataforma de despliegue recomendada.

## Instalación y desarrollo local

Requiere una versión de Node.js compatible con Next.js 16 y npm.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Abre `http://localhost:3000`. Configura estos valores en `.env.local` (nunca versiones credenciales reales):

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SECRET_KEY=your-secret-key
ADMIN_PASSWORD=una-contraseña-larga-y-única
```

- `NEXT_PUBLIC_SUPABASE_URL`: URL del proyecto Supabase.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: clave pública; sus lecturas están limitadas por RLS.
- `SUPABASE_SECRET_KEY`: clave privilegiada usada solo por módulos protegidos con `server-only`. No debe exponerse al navegador.
- `ADMIN_PASSWORD`: contraseña única, larga y privada para la moderación. Se valida exclusivamente en el servidor y nunca debe usar el prefijo `NEXT_PUBLIC_`.

## Scripts

| Comando | Uso |
| --- | --- |
| `npm run dev` | Servidor local de desarrollo. |
| `npm run lint` | Auditoría ESLint. |
| `npm run typecheck` | Comprobación TypeScript sin emitir archivos. |
| `npm run build` | Build optimizado de producción. |
| `npm run start` | Sirve localmente el build de producción. |

## Supabase, migration y verificación

1. Crea un proyecto Supabase y configura las cuatro variables anteriores.
2. Vincula Supabase CLI y ejecuta `supabase db push`, o ejecuta en SQL Editor `supabase/migrations/20260814000000_phase_1_data_infrastructure.sql`.
3. Ejecuta `supabase/verify_phase_1.sql` en SQL Editor. Es una comprobación de solo lectura de tablas, constraints, RLS, policies, índices y Storage.

La migration crea `listings` y `listing_images`, habilita RLS y permite al rol anónimo leer exclusivamente publicaciones `PUBLISHED`. Cada alta se impone como `PENDING` desde el servidor.

### DIVIPOLA

`src/data/colombia.json` contiene departamentos y municipios oficiales usados tanto por el navegador como por la validación server-side. Para regenerarlo desde los endpoints DIVIPOLA del DANE:

```bash
node scripts/update-colombia-data.mjs
```

Revisa y versiona el diff del dataset. En redes con proxy y Node.js 24 puede ser necesario `NODE_USE_ENV_PROXY=1`.

### Storage

El bucket `listing-images` debe permanecer **privado**, admitir JPEG, PNG y WebP y limitar cada objeto a 6 MiB. El servidor genera paths opacos y URLs firmadas temporales para subida y lectura; las URLs firmadas nunca se guardan en base de datos.

Si una pestaña se cierra después de preparar una publicación y antes de finalizarla o cancelarla, puede quedar un registro `PENDING` y, si ya hubo subidas, objetos huérfanos. El flujo limpia errores recuperables, pero cerrar el navegador no permite una limpieza garantizada. Para el MVP se debe revisar y eliminar periódicamente publicaciones `PENDING` antiguas y sus objetos; una tarea programada con umbral de antigüedad sería la evolución futura sencilla.

## Moderación privada mínima

El flujo habitual de moderación ya no requiere editar tablas directamente:

1. Abre `/admin/login` e ingresa `ADMIN_PASSWORD`.
2. En **Pendientes**, revisa fotos, descripción, precio, ubicación y contacto.
3. **Aprobar y publicar** cambia `PENDING` a `PUBLISHED`; la vivienda pasa a ser visible en Home, búsqueda y detalle.
4. **Rechazar** cambia una pendiente a `INACTIVE`. **Desactivar** hace lo mismo con una publicada. Una inactiva puede volver a publicarse.
5. Usa **Cerrar sesión** en la cabecera del panel al terminar.

La sesión dura ocho horas y se guarda en una cookie firmada, `HttpOnly`, `SameSite=Lax` y `Secure` en producción. La contraseña no se guarda en la cookie ni se envía a componentes cliente. Cada acción vuelve a comprobar la sesión y aplica únicamente transiciones permitidas mediante el cliente privilegiado de Supabase.

Solo los registros `PUBLISHED` se consultan desde Home, `/buscar` y `/vivienda/[id]`; `PENDING` e `INACTIVE` se comportan públicamente como inexistentes. Supabase Table Editor queda únicamente como fallback técnico para una intervención excepcional.

### Una publicación no aparece en la búsqueda

Crear el registro no basta para hacerlo público: `/buscar` exige explícitamente
`status = 'PUBLISHED'`. Para diagnosticar un caso como departamento `76` y
municipio `76001`, ejecuta en Supabase SQL Editor:

```sql
select id, department_code, city_code, status
from public.listings
where department_code = '76'
  and city_code = '76001';
```

Si el registro está `PENDING`, completa la revisión desde `/admin` y aprueba la publicación. Si ya está `PUBLISHED`, confirma que Vercel apunta al mismo
proyecto Supabase donde consultaste el registro y vuelve a desplegar después de
corregir las variables. No cambies RLS ni la consulta para hacer públicos
registros `PENDING` o `INACTIVE`.

## Deploy en Vercel

No se necesita Docker ni servidor propio. Las páginas dinámicas y Route Handlers se ejecutan en el runtime serverless de Next.js.

1. Sube este repositorio a un proveedor Git.
2. En Vercel, selecciona **Add New → Project** e importa el repositorio.
3. Conserva el preset **Next.js**, el comando de instalación `npm ci` y el build `npm run build`.
4. En **Settings → Environment Variables**, agrega para Production (y Preview si se probará allí):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SECRET_KEY`
   - `ADMIN_PASSWORD`
5. Confirma previamente que la migration y `supabase/verify_phase_1.sql` se ejecutaron en el proyecto Supabase de producción.
6. Despliega y completa `docs/SMOKE_TEST.md` contra la URL resultante.

No imprimas ni copies la Secret Key a logs, variables públicas o configuración del cliente. Para rotarla, actualiza Supabase y el valor de Vercel y vuelve a desplegar.
