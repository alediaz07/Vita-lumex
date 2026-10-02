# VITA LUMEX UNIQUE — presentación interactiva

Presentación web estática diseñada para una exposición presencial de aproximadamente 30 minutos. No requiere backend, proceso de compilación ni dependencias externas; puede publicarse directamente con GitHub Pages.

## Recorrido

1. Apertura — 1–2 min
2. El sistema — 2–3 min
3. La necesidad — 3 min
4. Beneficios — 3–4 min
5. Luz y fluorescencia — 3–4 min
6. Funcionamiento por capas — 5–6 min
7. Flujos BASIC / CREATIVE — 3–4 min
8. Datos y compatibilidad — 3 min
9. Resultado y cierre — 2–3 min

## Controles

- Scroll o trackpad: recorrer cada escena.
- Flechas: avanzar o retroceder por capítulos.
- `Home` / `End`: inicio o último capítulo.
- `F`: activar o salir de pantalla completa.
- `Esc`: cerrar paneles.
- `?`: mostrar ayuda durante la presentación.

La navegación lateral permite saltar directamente a cualquier capítulo. En móvil se abre desde el control superior.

## Estructura

- `index.html`: contenido y estructura narrativa.
- `styles.css`: dirección de arte, responsive y movimiento.
- `app.js`: scrollytelling, navegación e interacciones.
- `assets/images/`: imágenes originales extraídas del PDF y optimizadas en WebP.
- `source/`: PDF original utilizado como fuente.

## Selección editorial del PDF

- **A — Protagonista:** producto, aplicación clínica, microcapas, proceso por capas, flujos y resultado.
- **B — Soporte:** fluorescencia, compatibilidad, kits, composición y propiedades físicas.
- **C — Descartado:** inventario repetitivo de envases, páginas divisorias y recursos pequeños sin utilidad narrativa.

## Vista local

```bash
python3 -m http.server 8000
```

Abrir `http://localhost:8000`. Las rutas son relativas y compatibles con un repositorio publicado en GitHub Pages.
