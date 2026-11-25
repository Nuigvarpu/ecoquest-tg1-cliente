import type { World } from "../../core/ecs";

// Capa de presentación móvil en Canvas 2D (RF-09, RF-12). Solo lee el estado
// del ECS; la capa WebXR (src/render/webxr) leerá el mismo estado en 3D (RF-17).

export class Canvas2DRenderer {
  private readonly ctx: CanvasRenderingContext2D;

  constructor(private readonly canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D no disponible");
    this.ctx = ctx;
    this.resize();
  }

  /** Ajusta la resolución interna a devicePixelRatio para verse nítido (RF-12). */
  resize(): void {
    const dpr = window.devicePixelRatio || 1;
    const { clientWidth: w, clientHeight: h } = this.canvas;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  draw(world: World, stats: { fps: number; entities: number }): void {
    const { ctx, canvas } = this;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.fillStyle = "#1f3b2d";
    ctx.fillRect(0, 0, w, h);

    for (const e of world.query("position")) {
      const p = world.get(e, "position")!;
      const local = world.get(e, "localPlayer") !== undefined;
      ctx.fillStyle = local ? "#f2c14e" : "#7fb7be";
      ctx.beginPath();
      ctx.arc(p.x, p.y, local ? 12 : 8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Panel de depuración mínimo (base de RF-30).
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(8, 8, 150, 44);
    ctx.fillStyle = "#ffffff";
    ctx.font = "13px system-ui, sans-serif";
    ctx.fillText(`FPS: ${stats.fps.toFixed(0)}`, 16, 26);
    ctx.fillText(`Entidades: ${stats.entities}`, 16, 44);
  }
}
