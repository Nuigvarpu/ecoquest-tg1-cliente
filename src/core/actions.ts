// Acciones genéricas (RF-07). La capa de input traduce toques, teclado o
// controles del Quest a este formato; la lógica solo conoce estas acciones.

export interface ActionState {
  /** Dirección de movimiento normalizada, cada eje en [-1, 1]. */
  move: { x: number; y: number };
  action: boolean;
  ability1: boolean;
  ability2: boolean;
  ability3: boolean;
  interact: boolean;
  pause: boolean;
}

export const idleActions = (): ActionState => ({
  move: { x: 0, y: 0 },
  action: false,
  ability1: false,
  ability2: false,
  ability3: false,
  interact: false,
  pause: false,
});
