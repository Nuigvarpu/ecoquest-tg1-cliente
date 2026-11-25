# Capa de presentación WebXR (pendiente)

Aquí irá el prototipo para Meta Quest 3 (RF-16 a RF-19, fase F5, desde el sprint 9):

- Detectar soporte con `navigator.xr.isSessionSupported('immersive-vr')` antes de mostrar el botón «Entrar en VR» (RF-16).
- Dibujar con Three.js el mismo estado del ECS que dibuja `render/canvas2d` (RF-17).
- Mapear los controles del Quest con WebXR Input Profiles a las acciones genéricas de `core/actions.ts` (RF-18).

Para probar sin el visor: extensión Immersive Web Emulator en Chrome. WebXR exige HTTPS (GitHub Pages ya lo da).
