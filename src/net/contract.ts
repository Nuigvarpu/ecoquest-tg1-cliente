// Borrador del contrato de mensajes con el Trabajo 2 (RI-01 a RI-03).
// Versión propia mientras se acuerda el formato definitivo con el otro grupo.

export const CONTRACT_VERSION = "0.1.0-borrador";

/** RI-01: estado del jugador local, igual para móvil y Quest. */
export interface PlayerStateMessage {
  type: "player-state";
  peerId: string;
  seq: number;
  x: number;
  y: number;
  role: string;
  action?: string;
}

/** RI-03: eventos críticos, por canal confiable. */
export interface CriticalEventMessage {
  type: "critical-event";
  peerId: string;
  event: "deliver-waste" | "detect-dumping" | "request-backup";
  payload?: Record<string, unknown>;
}

export type NetMessage = PlayerStateMessage | CriticalEventMessage;

/** Lo que el cliente necesita de cualquier módulo de red: el real o el simulador (RI-06). */
export interface NetAdapter {
  send(msg: NetMessage): void;
  /** Devuelve los mensajes recibidos desde la última llamada. */
  drain(): NetMessage[];
}
