# CONTEXTO DEL PROYECTO

Vamos a desarrollar una página web provisionalmente llamada **Colombia Abriga**.

El nombre debe estar centralizado para poder cambiarlo fácilmente posteriormente.

La plataforma nace como una iniciativa solidaria para facilitar que personas en Colombia que necesitan encontrar vivienda rápidamente puedan conectarse con personas que tienen apartamentos, casas o habitaciones disponibles.

## Objetivo principal

La plataforma debe hacer exclusivamente tres cosas:

**PUBLICAR → ENCONTRAR → CONTACTAR**

No debemos convertir este producto en un portal inmobiliario complejo.

La simplicidad, velocidad de desarrollo, facilidad de uso y seguridad son las prioridades principales.

---

# MENSAJE PRINCIPAL

Título:

**Encuentra un hogar cerca de ti**

Descripción:

**Una forma sencilla de conectar personas que necesitan vivienda con quienes tienen un espacio disponible.**

---

# TIPO DE PRODUCTO

Debe ser una página web.

NO es:

* aplicación móvil;
* PWA;
* aplicación instalable.

Debe funcionar correctamente desde navegadores desktop, tablets y teléfonos mediante responsive web design.

La experiencia debe ser especialmente sencilla de utilizar.

---

# STACK

Utilizar:

* Next.js con App Router;
* TypeScript;
* Tailwind CSS;
* Supabase PostgreSQL;
* Supabase Storage;
* Vercel para deployment.

Frontend y lógica server-side deben permanecer dentro del mismo proyecto Next.js.

NO crear un backend NestJS.

NO crear microservicios.

---

# ALCANCE ESTRICTO

El MVP solamente necesita permitir:

1. Publicar una vivienda.
2. Buscar viviendas.
3. Filtrar viviendas.
4. Visualizar una vivienda.
5. Contactar al anunciante mediante WhatsApp.

NO implementar:

* registro;
* login;
* perfiles;
* cuentas;
* panel de usuario;
* chat;
* pagos;
* reservas;
* contratos;
* mapas;
* geolocalización;
* favoritos;
* reviews;
* comentarios;
* notificaciones;
* analytics avanzados;
* recomendaciones;
* IA;
* inmobiliarias;
* CMS;
* aplicación móvil;
* PWA.

No agregar ninguna funcionalidad que no sea necesaria para:

PUBLICAR → ENCONTRAR → CONTACTAR.

---

# PUBLICACIÓN DE VIVIENDA

El formulario debe solicitar:

* tipo de inmueble;
* tipo de disponibilidad;
* departamento;
* ciudad;
* barrio;
* precio mensual;
* número de habitaciones;
* número de baños;
* descripción;
* nombre de contacto;
* WhatsApp;
* fotografías.

Tipos de inmueble:

* APARTMENT
* HOUSE
* ROOM

Tipos de disponibilidad:

* RENT
* FREE_TEMPORARY

No solicitar dirección exacta.

No solicitar:

* número de identificación;
* información bancaria;
* documentos;
* información sensible innecesaria.

---

# PRECIO $0

El sistema debe permitir precio mensual igual a $0.

Si el tipo de disponibilidad es RENT y el usuario escribe $0, antes de enviar el formulario debe aparecer una confirmación explícita.

Mensaje:

**¿Confirmas que el valor del arriendo es $0?**

Texto:

**Recuerda que al indicar un valor de $0 estás informando que no cobrarás por esta vivienda. Es importante ingresar el valor real para evitar reprocesos y permitir que las personas encuentren rápidamente una vivienda que se ajuste a sus necesidades y posibilidades actuales.**

Opciones:

* Volver y corregir.
* Sí, confirmo que el valor es $0.

El formulario NO puede enviarse con:

RENT + $0

sin esta confirmación.

Si availability_type es FREE_TEMPORARY:

* monthly_price debe ser 0;
* mostrar claramente al usuario que el alojamiento será publicado como gratuito.

Nunca permitir precios negativos.

La validación debe existir tanto en frontend como server-side.

---

# COLOMBIA

La plataforma funciona exclusivamente para Colombia.

Los selectores deben funcionar:

Departamento
→
Ciudad

Utilizar códigos oficiales DIVIPOLA.

NO inventar departamentos.

NO inventar municipios.

NO generar manualmente códigos geográficos.

Los datos deben almacenarse localmente en el proyecto en una estructura apropiada como:

`src/data/colombia.json`

La fuente debe documentarse.

Los códigos oficiales deben utilizarse como identificadores.

---

# BÚSQUEDA

La búsqueda principal debe permitir:

* departamento;
* ciudad;
* presupuesto máximo.

Filtros adicionales:

* tipo de inmueble;
* mínimo de habitaciones;
* tipo de disponibilidad.

El filtro debe realizarse en servidor/base de datos.

NO traer todas las viviendas al navegador para filtrarlas en JavaScript.

Solo mostrar publicaciones:

`status = PUBLISHED`

Orden inicial:

más recientes primero.

Debe existir paginación si la cantidad de resultados lo requiere.

---

# LISTADO

Cada card debe mostrar únicamente información importante:

* fotografía principal;
* tipo de inmueble;
* barrio;
* ciudad;
* habitaciones;
* baños;
* precio.

Si monthly_price es mayor que 0:

mostrar precio colombiano formateado.

Ejemplo:

`$1.200.000 / mes`

Si monthly_price es 0:

mostrar claramente:

`ALOJAMIENTO GRATUITO`

y:

`$0`

No esconder que el precio es cero.

---

# DETALLE

Ruta conceptual:

`/vivienda/[id]`

Mostrar:

* fotografías;
* tipo;
* tipo de disponibilidad;
* barrio;
* ciudad;
* departamento;
* precio;
* habitaciones;
* baños;
* descripción;
* nombre del contacto.

No mostrar dirección exacta.

Botón principal:

**Contactar por WhatsApp**

El enlace debe generar un mensaje similar a:

**Hola, vi tu vivienda publicada en Colombia Abriga. Estoy interesado en la vivienda ubicada en [BARRIO], [CIUDAD]. ¿Sigue disponible?**

El teléfono debe normalizarse correctamente.

No construir chat interno.

---

# MODERACIÓN DEL MVP

No desarrollar panel administrativo inicialmente.

Toda publicación nueva debe guardarse obligatoriamente como:

`PENDING`

Una publicación solamente aparece públicamente cuando:

`status = PUBLISHED`

Durante el MVP inicial, el administrador podrá aprobar manualmente publicaciones desde Supabase.

Nunca aceptar `status` proveniente del formulario público.

El servidor debe forzar siempre:

`status = PENDING`

al crear una publicación.

---

# MODELO DE DATOS

Mantenerlo deliberadamente sencillo.

## listings

Debe contener aproximadamente:

* id UUID;
* property_type;
* availability_type;
* department_code;
* department_name;
* city_code;
* city_name;
* neighborhood;
* monthly_price;
* bedrooms;
* bathrooms;
* description;
* contact_name;
* contact_phone;
* status;
* created_at;
* updated_at.

Estados mínimos:

* PENDING
* PUBLISHED
* INACTIVE

Agregar únicamente campos adicionales que sean realmente necesarios técnicamente.

No sobrearquitecturar el modelo.

---

## listing_images

* id UUID;
* listing_id UUID;
* storage_path;
* sort_order;
* created_at.

Relacionar correctamente con listings.

---

# IMÁGENES

Utilizar Supabase Storage.

Crear bucket apropiado para fotografías de viviendas.

Definir límites.

Inicialmente:

* máximo 5 fotografías;
* solo formatos seguros de imagen;
* validar MIME type;
* definir tamaño máximo razonable;
* generar nombres únicos;
* nunca confiar en el nombre original del archivo.

Optimizar su visualización en Next.js.

---

# SEGURIDAD

El usuario no necesita autenticarse para publicar durante este MVP.

Por lo tanto, las operaciones sensibles deben ejecutarse únicamente server-side.

Nunca exponer una clave privada/secret key de Supabase al navegador.

Nunca permitir que el cliente determine:

* status;
* IDs internos;
* rutas arbitrarias de Storage;
* campos administrativos.

Validar todos los datos server-side.

Configurar Row Level Security cuando corresponda.

Las consultas públicas solamente deben poder obtener publicaciones PUBLISHED.

Implementar protección básica contra envíos accidentales o malformados sin introducir servicios complejos innecesarios.

No implementar sistemas externos de seguridad salvo que exista una razón concreta.

---

# DISEÑO

El diseño debe transmitir:

* solidaridad;
* tranquilidad;
* confianza;
* claridad;
* Colombia;
* facilidad de uso.

Debe sentirse moderno pero sencillo.

No convertirlo en una landing page exageradamente comercial.

Evitar:

* exceso de animaciones;
* efectos innecesarios;
* glassmorphism excesivo;
* gradientes exagerados;
* interfaces recargadas.

Usar:

* espacios amplios;
* buena tipografía;
* cards limpias;
* botones claros;
* jerarquía visual fuerte.

La web debe funcionar correctamente aproximadamente desde 320px hasta pantallas desktop grandes.

---

# HOME

La página principal debe priorizar inmediatamente:

**Encuentra un hogar cerca de ti**

Debajo:

**Una forma sencilla de conectar personas que necesitan vivienda con quienes tienen un espacio disponible.**

Después:

* departamento;
* ciudad;
* presupuesto máximo;
* botón Buscar vivienda.

También:

**¿Tienes una vivienda disponible?**

Botón:

**Publicar vivienda**

Después se pueden mostrar algunas viviendas recientes.

No agregar secciones de marketing innecesarias.

---

# ARQUITECTURA

Preferir una estructura simple similar a:

src/
app/
components/
lib/
data/
types/
actions/

Evitar carpetas innecesarias.

Usar Server Components por defecto cuando tenga sentido.

Usar Client Components únicamente para interactividad real.

Mantener los componentes pequeños y comprensibles.

Evitar duplicación.

TypeScript estricto.

No utilizar `any` salvo caso extraordinariamente justificado.

---

# VARIABLES DE ENTORNO

Nunca versionar secretos.

Debe existir:

`.env.example`

y:

`.env.local`

debe quedar ignorado por Git.

Validar las variables necesarias.

Centralizar la configuración de Supabase.

---

# REGLAS DE TRABAJO PARA CODEX

Antes de modificar código en cada fase:

1. Leer `AGENTS.md`.
2. Leer `PROJECT.md`.
3. Inspeccionar el repositorio actual.
4. Revisar los cambios existentes.
5. Determinar qué archivos realmente necesitan modificarse.

Durante la implementación:

1. No implementar funcionalidades de fases posteriores.
2. No modificar código no relacionado.
3. No agregar dependencias sin necesidad.
4. No sobrearquitectar.
5. No generar abstracciones prematuras.
6. Mantener TypeScript estricto.
7. Implementar manejo de errores.
8. Validar entradas.
9. Mantener seguridad server-side.
10. Mantener el alcance PUBLICAR → ENCONTRAR → CONTACTAR.

Antes de finalizar cada fase:

1. Revisar los cambios realizados.
2. Ejecutar lint.
3. Ejecutar TypeScript typecheck.
4. Ejecutar tests existentes si aplica.
5. Ejecutar production build.
6. Corregir errores encontrados.
7. Revisar console.log.
8. Revisar imports sin utilizar.
9. Revisar código muerto.
10. Revisar dependencias innecesarias.

Finalmente entregar:

* resumen de lo realizado;
* archivos principales creados/modificados;
* comandos ejecutados;
* resultado de lint;
* resultado de typecheck;
* resultado de build;
* cualquier decisión que deba tomar el desarrollador.

---

# FASES DEL PROYECTO

## FASE 0 — Inicialización

Objetivo:

Preparar correctamente el proyecto y establecer las reglas.

Tareas:

* inicializar Next.js;
* App Router;
* TypeScript;
* Tailwind;
* ESLint;
* estructura básica;
* `.gitignore`;
* `.env.example`;
* `AGENTS.md`;
* `PROJECT.md`;
* layout;
* configuración del nombre de plataforma;
* home provisional.

NO integrar todavía Supabase.

NO crear todavía formularios funcionales.

NO implementar búsqueda.

Validar lint, typecheck y build.

---

## FASE 1 — Datos y Supabase

Objetivo:

Dejar completamente preparada la persistencia.

Implementar:

* cliente Supabase server-side;
* variables de entorno;
* migrations SQL;
* listings;
* listing_images;
* índices;
* RLS;
* Storage;
* bucket de imágenes;
* políticas de lectura;
* acceso público únicamente a publicaciones PUBLISHED;
* creación segura server-side;
* dataset colombiano basado en DIVIPOLA.

No implementar todavía UI completa.

Proporcionar instrucciones claras para cualquier acción manual necesaria en Supabase.

Validar todo antes de terminar.

---

## FASE 2 — Encontrar vivienda

Objetivo:

Completar todo el flujo:

ENCONTRAR.

Implementar:

* Home;
* departamento;
* ciudad;
* precio máximo;
* búsqueda;
* `/buscar`;
* filtros;
* cards;
* paginación;
* empty state;
* loading;
* errores;
* responsive web.

Solo consultar:

`PUBLISHED`

No implementar publicación todavía.

---

## FASE 3 — Publicar vivienda

Objetivo:

Completar todo el flujo:

PUBLICAR.

Implementar:

`/publicar`

Formulario completo.

Implementar:

* validaciones;
* departamento/ciudad;
* precio;
* confirmación $0;
* alojamiento gratuito;
* fotografías;
* Supabase Storage;
* creación server-side;
* status PENDING obligatorio;
* mensajes de error;
* mensaje de éxito.

No implementar autenticación.

No implementar dashboard.

No implementar edición.

No implementar administración.

---

## FASE 4 — Visualizar y contactar

Objetivo:

Completar:

CONTACTAR.

Implementar:

`/vivienda/[id]`

Mostrar todos los datos públicos necesarios.

Implementar galería.

Implementar WhatsApp.

Agregar aviso de seguridad:

**Verifica personalmente la vivienda y la identidad del anunciante antes de realizar pagos o transferencias.**

Agregar metadata básica para compartir enlaces.

Implementar 404 para viviendas inexistentes o no publicadas.

NO implementar chat.

---

## FASE 5 — Auditoría y producción

Objetivo:

No agregar funcionalidades.

Revisar exclusivamente:

* seguridad;
* validaciones;
* consultas;
* Storage;
* imágenes;
* responsive;
* accesibilidad;
* UX;
* errores;
* loading;
* performance;
* SEO básico;
* metadata;
* variables de entorno;
* código muerto;
* duplicación;
* TypeScript;
* lint;
* build.

Preparar deployment en Vercel.

Actualizar README con:

* instalación;
* Supabase;
* variables;
* migrations;
* desarrollo;
* build;
* deployment;
* proceso manual para aprobar publicaciones PENDING.

Realizar smoke testing final.

NO agregar nuevas funcionalidades.

---

# INSTRUCCIÓN IMPORTANTE

Este documento proporciona el contexto completo del proyecto, pero NO debes ejecutar automáticamente todas las fases.

Cuando recibas una instrucción como:

`Ejecuta FASE 0`

debes implementar exclusivamente esa fase.

Cuando finalices, detenerte.

No comenzar la fase siguiente hasta recibir una nueva instrucción explícita.
