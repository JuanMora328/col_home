Actúa como Software Engineer Senior especializado en Next.js, TypeScript,
arquitectura web, UI/UX implementation y seguridad.

Vas a trabajar sobre un proyecto Next.js YA EXISTENTE.

NO inicialices otro proyecto.
NO reemplaces la configuración actual innecesariamente.
NO migres a otro framework.
NO crees otro repositorio.

Antes de modificar cualquier archivo, inspecciona completamente el repositorio.

======================================================================
PROYECTO
======================================================================

Nombre provisional:

Colombia Abriga

Es una página web solidaria enfocada exclusivamente en Colombia que conecta
personas que necesitan encontrar vivienda con personas que tienen una casa,
apartamento o habitación disponible.

La plataforma tiene únicamente tres objetivos:

PUBLICAR → ENCONTRAR → CONTACTAR

Este principio define todo el alcance del proyecto.

NO queremos desarrollar un portal inmobiliario completo.

======================================================================
TIPO DE PRODUCTO
======================================================================

Es un SITIO WEB construido con Next.js.

NO es:

- aplicación móvil;
- PWA;
- aplicación instalable;
- aplicación nativa.

Debe funcionar correctamente en:

- desktop;
- laptop;
- tablet;
- teléfonos mediante responsive web design.

La referencia visual principal fue diseñada desktop-first.

======================================================================
STACK
======================================================================

Mantener:

- Next.js;
- App Router;
- TypeScript;
- Tailwind CSS;
- ESLint.

Posteriormente integraremos:

- Supabase PostgreSQL;
- Supabase Storage;
- Vercel.

Frontend y lógica server-side permanecerán dentro del mismo proyecto Next.js.

NO crear:

- NestJS;
- Express separado;
- microservicios;
- backend independiente.

======================================================================
FUENTES DE VERDAD
======================================================================

Existen referencias visuales provenientes de Google Stitch dentro de:

docs/design/

Debes inspeccionar COMPLETAMENTE:

docs/design/DESIGN.md

y:

docs/design/references/

También puedes inspeccionar otras carpetas/exportaciones de Stitch que existan
dentro de docs/design/.

IMPORTANTE:

El diseño de Stitch es la FUENTE DE VERDAD VISUAL.

Esto incluye:

- lenguaje visual;
- paleta;
- tipografía;
- tamaños;
- espacios;
- containers;
- border radius;
- botones;
- inputs;
- selects;
- cards;
- shadows;
- composición;
- jerarquía;
- estética general.

Sin embargo:

EL DISEÑO DE STITCH NO ES LA FUENTE DE VERDAD FUNCIONAL.

Si existe contradicción entre una captura de Stitch y esta especificación:

LA ESPECIFICACIÓN FUNCIONAL TIENE PRIORIDAD.

No agregues funcionalidades solamente porque aparezcan en una captura.

No copies código exportado por Stitch ciegamente.

Reimplementa correctamente el diseño utilizando la arquitectura,
componentes y patrones del proyecto Next.js.

======================================================================
DIRECCIÓN VISUAL
======================================================================

La interfaz debe conservar el estilo observado en las referencias Stitch.

Debe transmitir:

- solidaridad;
- calidez;
- confianza;
- humanidad;
- tranquilidad;
- Colombia;
- sencillez.

Mantener aproximadamente la dirección visual actual:

- fondo cálido/claro;
- identidad naranja/terracota;
- acentos verdes cuando corresponda;
- cards limpias;
- tipografía fuerte;
- mucho whitespace;
- forms claros;
- bordes y sombras discretas;
- fotografías con protagonismo.

No convertir el diseño en:

- SaaS;
- dashboard;
- fintech;
- página gubernamental;
- portal inmobiliario corporativo;
- landing comercial exagerada.

Evitar:

- glassmorphism;
- gradientes innecesarios;
- animaciones excesivas;
- efectos 3D;
- interfaces recargadas.

======================================================================
MENSAJE PRINCIPAL
======================================================================

Título:

Encuentra un hogar cerca de ti

Descripción:

Una forma sencilla de conectar personas que necesitan vivienda con quienes
tienen un espacio disponible.

======================================================================
NAVEGACIÓN
======================================================================

Mantener navegación extremadamente sencilla.

Principalmente:

- Encontrar vivienda
- Publicar vivienda

No necesitamos una navegación compleja.

Si las referencias Stitch contienen:

"Nuestra misión"

NO es obligatorio implementarlo.

Preferimos eliminarlo si no aporta al flujo:

PUBLICAR → ENCONTRAR → CONTACTAR.

======================================================================
ALCANCE ESTRICTO
======================================================================

La plataforma solamente debe permitir:

1. Publicar una vivienda.
2. Buscar viviendas.
3. Filtrar viviendas.
4. Ver información de una vivienda.
5. Contactar al anunciante mediante WhatsApp.

NO implementar:

- registro;
- login;
- perfiles;
- cuentas;
- panel de usuario;
- favoritos;
- chat;
- pagos;
- reservas;
- contratos;
- mapas;
- geolocalización;
- reviews;
- comentarios;
- notificaciones;
- sistema de mensajes;
- recomendaciones;
- inteligencia artificial;
- inmobiliarias;
- analytics avanzados;
- CMS;
- aplicación móvil;
- PWA.

NO implementar "Guardar borrador".

Aunque exista visualmente en alguna referencia Stitch:

ELIMINAR esa funcionalidad.

No tenemos cuentas de usuario y no necesitamos drafts.

======================================================================
HOME
======================================================================

La home debe seguir de cerca la referencia Stitch.

Debe priorizar:

Encuentra un hogar cerca de ti

y debajo:

Una forma sencilla de conectar personas que necesitan vivienda con quienes
tienen un espacio disponible.

Buscador principal:

- Departamento
- Ciudad
- Presupuesto máximo

CTA:

Buscar vivienda

También:

¿Tienes una vivienda disponible?

CTA:

Publicar vivienda

Después:

Viviendas disponibles recientemente.

No crear secciones de marketing adicionales.

======================================================================
ENCONTRAR
======================================================================

La búsqueda debe permitir principalmente:

- departamento;
- ciudad;
- presupuesto máximo.

Filtros adicionales:

- tipo de inmueble;
- habitaciones mínimas;
- tipo de disponibilidad.

Tipos de inmueble:

- Apartamento
- Casa
- Habitación

Tipo de disponibilidad:

- Arriendo
- Alojamiento temporal gratuito

NO agregar características que aparecen accidentalmente en diseños Stitch
pero no existen funcionalmente.

Ejemplos de características que NO debemos agregar:

- Wi-Fi;
- amoblado;
- servicios incluidos;
- parqueadero;
- baño compartido;
- mascotas;
- amenities.

A menos que posteriormente se solicite explícitamente.

Cards:

mostrar únicamente información relevante:

- fotografía;
- tipo de inmueble;
- barrio;
- ciudad;
- habitaciones;
- baños;
- precio.

Si price > 0:

$1.200.000 / mes

Si price = 0:

mostrar claramente:

ALOJAMIENTO GRATUITO

y:

$0

======================================================================
PUBLICAR
======================================================================

Ruta:

/publicar

El formulario debe solicitar:

- Tipo de inmueble
- Tipo de disponibilidad
- Departamento
- Ciudad
- Barrio
- Precio mensual
- Habitaciones
- Baños
- Descripción
- Nombre de contacto
- WhatsApp
- Fotografías

Máximo 5 fotografías.

NO pedir dirección exacta.

NO pedir información bancaria.

NO pedir identificación.

NO pedir documentos.

IMPORTANTE:

Algunas referencias Stitch actuales no muestran todos estos campos.

Eso NO significa que deban omitirse.

Añade los campos faltantes respetando exactamente el mismo lenguaje visual
del diseño existente.

El formulario puede dividirse visualmente en bloques como:

Información básica

Ubicación

Características

Descripción

Contacto

Fotos del inmueble

pero debe continuar siendo un único formulario sencillo.

NO crear wizard ni pasos múltiples.

======================================================================
TIPO DE DISPONIBILIDAD
======================================================================

No utilizar simplemente:

"Disponibilidad inmediata"

como se observa en alguna referencia Stitch.

Nuestro modelo funcional necesita:

Tipo de disponibilidad

Opciones:

Arriendo

Alojamiento temporal gratuito

======================================================================
PRECIO $0
======================================================================

El precio mensual puede ser cero.

Caso 1:

Tipo de disponibilidad:

ALOJAMIENTO TEMPORAL GRATUITO

Entonces:

monthly_price = 0.

Mostrar:

Este alojamiento será publicado como gratuito.

Caso 2:

Tipo:

ARRIENDO

y precio:

$0

Antes de publicar mostrar confirmación explícita.

Título:

¿Confirmas que el valor del arriendo es $0?

Texto:

Recuerda que al indicar un valor de $0 estás informando que no cobrarás por
esta vivienda. Es importante ingresar el valor real para evitar reprocesos y
permitir que las personas encuentren rápidamente una vivienda que se ajuste
a sus necesidades y posibilidades actuales.

Acciones:

Volver y corregir

Sí, confirmo que el valor es $0

No permitir enviar RENT + 0 sin esta confirmación.

La validación posteriormente deberá existir frontend y server-side.

======================================================================
DETALLE
======================================================================

Ruta:

/vivienda/[id]

Mostrar:

- fotografías;
- tipo de inmueble;
- tipo de disponibilidad;
- barrio;
- ciudad;
- departamento;
- precio;
- habitaciones;
- baños;
- descripción;
- nombre del contacto.

No mostrar dirección exacta.

CTA principal:

Contactar por WhatsApp

Mensaje conceptual:

Hola, vi tu vivienda publicada en Colombia Abriga. Estoy interesado en la
vivienda ubicada en [BARRIO], [CIUDAD]. ¿Sigue disponible?

No implementar chat.

======================================================================
MODERACIÓN
======================================================================

No crear panel administrativo.

Toda publicación nueva posteriormente se guardará:

PENDING

Solo publicaciones:

PUBLISHED

aparecerán públicamente.

Inicialmente la aprobación será manual desde Supabase.

No desarrollar UI administrativa.

======================================================================
COLOMBIA
======================================================================

La plataforma funciona exclusivamente para Colombia.

Selector:

Departamento
→
Ciudad

Posteriormente utilizaremos datos oficiales DIVIPOLA.

No inventes municipios.

No inventes departamentos.

No inventes códigos.

Los datos se manejarán desde el proyecto de forma local, probablemente:

src/data/colombia.json

pero la implementación real se realizará en una fase posterior.

======================================================================
ARQUITECTURA
======================================================================

Mantener la arquitectura sencilla.

Una estructura conceptual apropiada sería:

src/
  app/
  components/
  lib/
  data/
  types/
  actions/

No es obligatorio crear carpetas si todavía no son necesarias.

Evitar:

- overengineering;
- repository pattern innecesario;
- service layers artificiales;
- abstracciones prematuras;
- wrappers innecesarios;
- arquitecturas empresariales.

Utilizar Server Components por defecto cuando tenga sentido.

Client Components solamente donde exista interactividad real.

Mantener TypeScript estricto.

Evitar any.

======================================================================
COMPONENTES VISUALES
======================================================================

Identifica patrones reutilizables del DESIGN.md y referencias Stitch.

Probablemente necesitaremos componentes como:

Header
Footer
Container
Button
FormField
Select
PriceInput
ListingCard
SearchForm
ListingFilters

No crees un design system gigantesco.

Solo extrae componentes cuando exista reutilización real.

======================================================================
RESPONSIVE
======================================================================

Las referencias Stitch son principalmente desktop.

Debes mantener fielmente esa composición en desktop.

Para tamaños inferiores, implementar responsive web design razonable.

Objetivo aproximado:

320px → desktop grande.

No convertir la versión móvil en una app.

No agregar:

- bottom navigation;
- floating buttons;
- headers de app;
- navegación móvil tipo aplicación nativa.

Simplemente reorganiza el layout de la página web.

======================================================================
ACCESIBILIDAD
======================================================================

Mantener:

- labels visibles;
- controles accesibles;
- focus states;
- contraste suficiente;
- navegación por teclado;
- semántica HTML;
- botones reales;
- inputs correctamente asociados con labels.

No depender exclusivamente del color.

======================================================================
REGLAS PARA CODEX
======================================================================

Antes de cada fase:

1. Inspecciona el repositorio.
2. Lee AGENTS.md si existe.
3. Lee PROJECT.md si existe.
4. Lee docs/design/DESIGN.md.
5. Inspecciona docs/design/references/.
6. Revisa package.json.
7. Revisa configuración TypeScript.
8. Revisa configuración Tailwind.
9. Revisa cambios existentes.
10. Determina qué archivos realmente deben modificarse.

Durante las tareas:

- No avances a fases posteriores.
- No agregues funcionalidades no solicitadas.
- No cambies el stack.
- No reemplaces configuración válida.
- No instales dependencias sin necesidad.
- No agregues paquetes solamente por comodidad.
- No ignores el DESIGN.md.
- No inventes estilos si DESIGN.md ya define el comportamiento.
- No sacrifiques accesibilidad para copiar una captura.
- No copies código Stitch defectuoso.
- Replica visualmente los diseños mediante componentes Next.js correctos.

Antes de finalizar:

1. Revisa git diff.
2. Ejecuta lint.
3. Ejecuta TypeScript typecheck.
4. Ejecuta tests existentes cuando aplique.
5. Ejecuta production build.
6. Corrige TODOS los errores.
7. Revisa warnings relevantes.
8. Elimina console.log innecesarios.
9. Elimina imports sin usar.
10. Elimina código muerto.
11. Revisa que no hayas implementado funcionalidades fuera de scope.

Al finalizar informa:

- qué implementaste;
- qué archivos modificaste;
- decisiones relevantes;
- comandos ejecutados;
- resultado de lint;
- resultado de typecheck;
- resultado de build;
- posibles bloqueos.

======================================================================
FASES
======================================================================

FASE 0
Preparación del repositorio y sistema visual.

FASE 1
Supabase, modelo de datos, Storage y Colombia/DIVIPOLA.

FASE 2
ENCONTRAR vivienda.

FASE 3
PUBLICAR vivienda.

FASE 4
VER y CONTACTAR.

FASE 5
Auditoría, seguridad, UX y producción.

IMPORTANTE:

NO ejecutes automáticamente ninguna fase solamente por leer este documento.

Espera una instrucción explícita:

"Ejecuta FASE X"

y realiza únicamente esa fase.