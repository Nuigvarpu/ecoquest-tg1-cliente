import { describe, expect, it } from "vitest";
import { idleActions } from "../src/core/actions";
import { World } from "../src/core/ecs";
import { FIXED_DT } from "../src/core/loop";
import { inputSystem, movementSystem, PLAYER_SPEED } from "../src/core/systems/movement";

const MAP = { width: 960, height: 540 };

function makeWorld() {
  const world = new World();
  const p = world.createEntity();
  world.add(p, "position", { x: 100, y: 100 });
  world.add(p, "velocity", { x: 0, y: 0 });
  world.add(p, "localPlayer", true);
  return { world, p };
}

describe("ECS (RF-04, RF-06)", () => {
  it("consulta solo las entidades con todos los componentes pedidos", () => {
    const { world, p } = makeWorld();
    const remote = world.createEntity();
    world.add(remote, "position", { x: 0, y: 0 });
    expect(world.query("position")).toEqual([p, remote]);
    expect(world.query("position", "localPlayer")).toEqual([p]);
  });

  it("destruye una entidad y todos sus componentes", () => {
    const { world, p } = makeWorld();
    world.destroyEntity(p);
    expect(world.query("position")).toEqual([]);
  });

  it("serializa el estado para la red", () => {
    const { world, p } = makeWorld();
    expect(world.snapshot()).toEqual([{ id: p, x: 100, y: 100 }]);
  });
});

describe("Sistemas de input y movimiento", () => {
  it("mueve al jugador con la acción genérica de mover", () => {
    const { world, p } = makeWorld();
    const actions = idleActions();
    actions.move.x = 1;
    inputSystem(world, actions);
    movementSystem(world, FIXED_DT, MAP);
    expect(world.get(p, "position")!.x).toBeCloseTo(100 + PLAYER_SPEED * FIXED_DT, 5);
  });

  it("no excede la velocidad en diagonal", () => {
    const { world, p } = makeWorld();
    const actions = idleActions();
    actions.move = { x: 1, y: 1 };
    inputSystem(world, actions);
    const v = world.get(p, "velocity")!;
    expect(Math.hypot(v.x, v.y)).toBeCloseTo(PLAYER_SPEED, 5);
  });

  it("es determinista: la misma secuencia de entradas da el mismo estado (RNF-11)", () => {
    const run = () => {
      const { world } = makeWorld();
      for (let i = 0; i < 120; i++) {
        const a = idleActions();
        a.move = { x: Math.sin(i / 10), y: Math.cos(i / 7) };
        inputSystem(world, a);
        movementSystem(world, FIXED_DT, MAP);
      }
      return world.snapshot();
    };
    expect(run()).toEqual(run());
  });
});
