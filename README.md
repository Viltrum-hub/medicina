# TecMed

Sitio académico sobre avances tecnológicos en la medicina de Estados Unidos. Cada página tiene una dirección independiente: Inicio, Nosotros, Marco teórico, Resultados y Propuestas de cambio.

## Uso y edición

Abre `index.html` directamente en un navegador. No requiere instalación ni base de datos. Los archivos HTML contienen los textos, `assets/styles.css` controla el diseño y `assets/main.js` controla el menú móvil y el filtro de resultados. El logo original se conserva en `assets/tecmed-logo.jpeg`.

## Datos

Se mantienen las cifras existentes del marco teórico: 97 %, 94 % y 90 %, sobre una muestra de 100 hospitales oncológicos observada en 2023. Las cifras están en Inicio, Resultados, `assets/datos.json` y `assets/resultados.csv`; cualquier actualización debe conservar la consistencia entre estos recursos. Las propuestas siguen siendo acciones sugeridas, sin implementación evaluada. Se conservan las referencias y precisiones bibliográficas de la página Marco teórico.

## Diseño

Identidad médica en azul profundo, blanco frío y cian: navegación compacta, encabezados con imágenes y contexto, propuestas en una cuadrícula visual, lectura con índice, dashboard con filtros y pie de página compacto. Las fotografías ilustrativas se guardan localmente; sus enlaces figuran en `assets/creditos.txt`. No son evidencia sobre los hospitales de la muestra. El sitio no carga imágenes ni bibliotecas desde servicios externos.

El CSS adapta columnas, navegación y tamaños a pantallas pequeñas. El contenido sigue visible si JavaScript no está disponible y se respeta la preferencia de movimiento reducido.

## Publicación y validación

GitHub Pages sirve el sitio desde la rama main y la raíz del repositorio. Se revisaron las rutas locales, anclas, IDs únicos, un H1 por página y sintaxis JavaScript. No se incorporan formularios ni servicios simulados.
