# EcoQuest P2P · Trabajo de grado 1 — Cliente de juego

Motor de juego 2D en HTML5 Canvas con capa de presentación intercambiable para navegador móvil y Meta Quest 3 (WebXR).
Universidad Cooperativa de Colombia, Ingeniería de Software, Santa Marta.

**Equipo:** Carlos Gomes, Eberto Perez, Fausto Pineda y Santiago Oñate.

## Empezar

```bash
npm install
npm run dev      # servidor de desarrollo, accesible desde el teléfono en la misma red
npm test         # pruebas unitarias (Vitest)
npm run lint     # incluye la regla de separación de capas
npm run build
```

Controles del spike: WASD o flechas.

## Estructura por capas

| Carpeta | Capa | Puede usar DOM/Canvas/Three.js |
| --- | --- | --- |
| `src/core` | Lógica de juego (ECS, bucle de paso fijo, sistemas, acciones genéricas) | **No** — lo verifica ESLint en CI (RNF-10) |
| `src/input` | Teclado, joystick táctil y controles del Quest → acciones genéricas | Sí |
| `src/net` | Contrato de mensajes con el Trabajo 2 y simulador local de red | Sí |
| `src/render/canvas2d` | Presentación móvil en Canvas 2D | Sí |
| `src/render/webxr` | Presentación 3D para Meta Quest 3 (pendiente, fase F5) | Sí |

## Forma de trabajo

- Metodología Scrum, sprints de 2 semanas. Tablero en Jira (clave del proyecto: `EQ`).
- Una rama por historia: `feature/EQ-12-joystick`. Los commits empiezan con `EQ-12:`.
- Todo entra a `main` por pull request revisado por otro integrante y con CI en verde.
- `main` se publica en GitHub Pages con HTTPS para probar en teléfonos y en el Quest.

## Estado

Spike del sprint 1: bucle con paso fijo, ECS mínimo, input de teclado, simulador de 30 jugadores remotos a 15 Hz y render en Canvas 2D con panel de FPS.
