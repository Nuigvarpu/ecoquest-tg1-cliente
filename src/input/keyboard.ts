import { idleActions, type ActionState } from "../core/actions";

// Fuente de input de teclado (RF-07). El joystick táctil y los controles del
// Quest se agregan como otras fuentes con la misma salida (RF-08, RF-10, RF-18).

const pressed = new Set<string>();

export function attachKeyboard(target: Window = window): () => void {
  const down = (e: KeyboardEvent) => pressed.add(e.code);
  const up = (e: KeyboardEvent) => pressed.delete(e.code);
  target.addEventListener("keydown", down);
  target.addEventListener("keyup", up);
  return () => {
    target.removeEventListener("keydown", down);
    target.removeEventListener("keyup", up);
  };
}

export function readKeyboard(): ActionState {
  const a = idleActions();
  a.move.x = (pressed.has("KeyD") || pressed.has("ArrowRight") ? 1 : 0) - (pressed.has("KeyA") || pressed.has("ArrowLeft") ? 1 : 0);
  a.move.y = (pressed.has("KeyS") || pressed.has("ArrowDown") ? 1 : 0) - (pressed.has("KeyW") || pressed.has("ArrowUp") ? 1 : 0);
  a.action = pressed.has("Space");
  a.interact = pressed.has("KeyE");
  a.pause = pressed.has("Escape");
  return a;
}
