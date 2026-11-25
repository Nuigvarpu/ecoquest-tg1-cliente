import { World } from "./core/ecs";
import { FixedStepLoop } from "./core/loop";
import { inputSystem, movementSystem } from "./core/systems/movement";
import { attachKeyboard, readKeyboard } from "./input/keyboard";
import { LocalNetSimulator } from "./net/localSimulator";
import { Canvas2DRenderer } from "./render/canvas2d/renderer";

// Punto de entrada: conecta input → lógica (ECS) → red (simulador) → presentación.
// Spike del sprint 1: un jugador local y 30 remotos simulados a 15 Hz.

const MAP = { width: 960, height: 540 };
const REMOTE_PLAYERS = 30;

const canvas = document.querySelector<HTMLCanvasElement>("#game")!;
const renderer = new Canvas2DRenderer(canvas);
window.addEventListener("resize", () => renderer.resize());
attachKeyboard();

const world = new World();
const player = world.createEntity();
world.add(player, "position", { x: MAP.width / 2, y: MAP.height / 2 });
world.add(player, "velocity", { x: 0, y: 0 });
world.add(player, "localPlayer", true);

const net = new LocalNetSimulator(REMOTE_PLAYERS, MAP);
const remoteByPeer = new Map<string, number>();

// Orden fijo de sistemas (RF-05): input → movimiento (combate e IA llegarán después).
const loop = new FixedStepLoop((dt) => {
  inputSystem(world, readKeyboard());
  movementSystem(world, dt, MAP);
});

let last = performance.now();
let fps = 60;
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    last = performance.now();
    loop.reset();
  }
});

function frame(now: number) {
  const elapsed = (now - last) / 1000;
  last = now;
  if (elapsed > 0) fps = fps * 0.9 + (1 / elapsed) * 0.1;

  net.update(elapsed);
  for (const msg of net.drain()) {
    if (msg.type !== "player-state") continue;
    let e = remoteByPeer.get(msg.peerId);
    if (e === undefined) {
      e = world.createEntity();
      world.add(e, "position", { x: msg.x, y: msg.y });
      world.add(e, "remote", { peerId: msg.peerId });
      remoteByPeer.set(msg.peerId, e);
    }
    const p = world.get(e, "position")!;
    p.x = msg.x;
    p.y = msg.y;
  }

  loop.advance(elapsed);
  renderer.draw(world, { fps, entities: world.query("position").length });
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
