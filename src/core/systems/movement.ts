import type { ActionState } from "../actions";
import type { World } from "../ecs";

export const PLAYER_SPEED = 160; // unidades de mundo por segundo

/** Sistema de input: convierte las acciones del jugador local en velocidad. */
export function inputSystem(world: World, actions: ActionState): void {
  for (const e of world.query("localPlayer", "velocity")) {
    const v = world.get(e, "velocity")!;
    const len = Math.hypot(actions.move.x, actions.move.y);
    const scale = len > 1 ? 1 / len : 1;
    v.x = actions.move.x * scale * PLAYER_SPEED;
    v.y = actions.move.y * scale * PLAYER_SPEED;
  }
}

/** Sistema de movimiento: integra posición con el paso fijo y la limita al mapa. */
export function movementSystem(world: World, dt: number, bounds: { width: number; height: number }): void {
  for (const e of world.query("position", "velocity")) {
    const p = world.get(e, "position")!;
    const v = world.get(e, "velocity")!;
    p.x = Math.min(bounds.width, Math.max(0, p.x + v.x * dt));
    p.y = Math.min(bounds.height, Math.max(0, p.y + v.y * dt));
  }
}
