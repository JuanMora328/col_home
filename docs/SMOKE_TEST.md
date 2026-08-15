# Smoke test manual

Ejecutar en la URL de producción con tamaños aproximados de 320, 375, 768, 1024 y 1440 px. Confirmar que no hay overflow horizontal y que foco, teclado y contraste siguen siendo perceptibles.

## Home

- [ ] `/` carga con header, buscador, viviendas recientes y footer.
- [ ] Departamento actualiza el select de ciudad con datos de Colombia.
- [ ] La búsqueda abre `/buscar` con los parámetros seleccionados.

## Buscar

- [ ] Filtros de ubicación, presupuesto, inmueble, habitaciones y disponibilidad funcionan.
- [ ] Solo aparecen registros `PUBLISHED`, con orden reciente y paginación correcta.
- [ ] Precio positivo muestra COP por mes y precio cero muestra “ALOJAMIENTO GRATUITO” y `$0`.
- [ ] Parámetros inválidos no causan error 500 y una búsqueda sin resultados muestra estado vacío.
- [ ] Cada título de tarjeta abre `/vivienda/[id]` y volver conserva los filtros.

## Publicar

- [ ] Un arriendo con precio positivo, DIVIPOLA y teléfono válidos finaliza con estado de éxito.
- [ ] `RENT` con `$0` exige confirmación; volver cierra el diálogo y confirmar permite continuar.
- [ ] Alojamiento temporal gratuito fuerza precio `$0` sin esa confirmación.
- [ ] Se exige entre 1 y 5 imágenes JPG, PNG o WebP, cada una de máximo 6 MiB; quitar previews funciona.
- [ ] Campos obligatorios, ciudad/departamento y WhatsApp inválidos muestran errores comprensibles.

## Moderación

- [ ] La publicación nueva queda `PENDING` y no aparece en Home, búsqueda ni detalle directo.
- [ ] Tras revisión manual, cambiarla a `PUBLISHED` hace que aparezca en búsqueda y detalle.

## Detalle y contacto

- [ ] `/vivienda/[id]` muestra fotos firmadas en orden, datos públicos, precio y aviso de seguridad.
- [ ] Una imagen ausente o fallida muestra placeholder sin romper la galería.
- [ ] “Contactar por WhatsApp” abre desktop/móvil con teléfono normalizado y mensaje correcto.
- [ ] El HTML visible no muestra teléfono como texto, status, IDs, timestamps ni paths de Storage.

## Seguridad

- [ ] IDs inexistentes, `PENDING` e `INACTIVE` responden con la misma experiencia 404.
- [ ] `listing-images` continúa privado y sus enlaces de lectura son firmados y expiran.
- [ ] `SUPABASE_SECRET_KEY` no aparece en HTML, JavaScript del navegador, respuestas ni logs.
