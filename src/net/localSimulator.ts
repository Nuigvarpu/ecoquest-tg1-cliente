import type { NetAdapter, NetMessage, PlayerStateMessage } from "./contract";

// Simulador local de red (RI-06): genera jugadores remotos que se mueven y
// envían su estado a 15 Hz, con el mismo contrato que el módulo del Trabajo 2.
// Permite probar el cliente con hasta 30 remotos sin depender del otro grupo.

export class LocalNetSimulator implements NetAdapter {
  private readonly inbox: NetMessage[] = [];
  private readonly peers: Array<{ id: string; angle: number; cx: number; cy: number; r: number; speed: number; seq: number }>;
  private clock = 0;
  private sinceLastTick = 0;

  constructor(remoteCount: number, bounds: { width: number; height: number }, private readonly hz = 15) {
    this.peers = Array.from({ length: remoteCount }, (_, i) => ({
      id: `sim-${i + 1}`,
      angle: (i / Math.max(1, remoteCount)) * Math.PI * 2,
      cx: bounds.width * (0.2 + 0.6 * ((i * 37) % 100) / 100),
      cy: bounds.height * (0.2 + 0.6 * ((i * 61) % 100) / 100),
      r: 40 + ((i * 13) % 60),
      speed: 0.5 + ((i * 7) % 10) / 10,
      seq: 0,
    }));
  }

  send(): void {
    // El simulador no reenvía el estado local a nadie.
  }

  /** Avanza el reloj simulado; llamar una vez por frame con segundos reales. */
  update(elapsedSeconds: number): void {
    this.clock += elapsedSeconds;
    this.sinceLastTick += elapsedSeconds;
    const period = 1 / this.hz;
    while (this.sinceLastTick >= period) {
      this.sinceLastTick -= period;
      for (const p of this.peers) {
        const a = p.angle + this.clock * p.speed;
        const msg: PlayerStateMessage = {
          type: "player-state",
          peerId: p.id,
          seq: ++p.seq,
          x: p.cx + Math.cos(a) * p.r,
          y: p.cy + Math.sin(a) * p.r,
          role: "recolector",
        };
        this.inbox.push(msg);
      }
    }
  }

  drain(): NetMessage[] {
    return this.inbox.splice(0, this.inbox.length);
  }
}
