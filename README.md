# TecMed

Sitio académico sobre avances tecnológicos en la medicina de Estados Unidos.

## Abrir y revisar

Abre `index.html` directamente en un navegador. No requiere instalación, claves ni base de datos. Opcionalmente, desde esta carpeta ejecuta `python -m http.server 8000` y visita `http://localhost:8000`.

## Páginas

Inicio, Nosotros, Marco teórico, Resultados y Propuestas de cambio tienen archivos HTML y direcciones independientes.

## Modificar

Edita los archivos HTML para cambiar textos; `assets/styles.css` controla el diseño y `assets/main.js` el menú móvil y el filtro del dashboard. El logo original está en `assets/tecmed-logo.jpeg`. Las cifras también están documentadas en `assets/datos.json` y `assets/resultados.csv`. Si se actualizan datos, deben actualizarse estos dos archivos y las cifras y filas de Inicio y Resultados para mantenerlos consistentes.

## Fuentes y límites

El contenido se basa en el marco teórico aportado. Las cifras 97 %, 94 % y 90 % corresponden a 100 hospitales oncológicos observados del 17 de septiembre al 24 de octubre de 2023. No describen todo el sistema médico de Estados Unidos. No se consultaron fuentes externas. Las propuestas son sugerencias sin implementación. Faltan la referencia completa de Medina-Aguerrebere (2026) y la aclaración del año de Mackert (2020/2021). La página Marco teórico conserva los enlaces disponibles, sin verificarlos externamente.

## Publicación

No se configuró ni activó hosting. Para publicar posteriormente, se puede habilitar GitHub Pages desde la rama elegida y la carpeta raíz, previa autorización del propietario. No hay formularios, envíos ni almacenamiento simulado.

## Revisión

Se comprobaron enlaces locales, estructura HTML, coincidencia de datos, recursos y sintaxis JavaScript. Las pruebas visuales en navegadores, dispositivos y lectores de pantalla quedan pendientes.

## Dirección visual del rediseño

Concepto de publicación médica contemporánea: marfil, azul cobalto y verde suave; tipografía Helvetica/Arial sin dependencias externas. Cabecera en dos niveles, navegación numerada, portada tipográfica, identidad del proyecto, columna de lectura con índice, panel de datos y plan de acción. Se revisaron el HTML de Inicio y las hojas de estilos de Biotecnología y Bosques para evitar repetir sus fondos oscuros, fuentes Space Grotesk, portadas fotográficas y componentes redondeados. El logo original y las cifras se conservan.

Se verificaron rutas locales y anclas, navegación activa, estructura semántica, consistencia de datos, sintaxis JavaScript y contraste de los pares principales (mínimo 4,5:1). Se revisaron reglas CSS para móvil y reducción de movimiento. No se ejecutó una revisión visual en navegador ni una medición real de desbordamiento en dispositivos; siguen pendientes.
