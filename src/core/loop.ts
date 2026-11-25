// Bucle con delta time fijo (RF-01): la simulación avanza en pasos de 1/60 s
// sin importar los FPS reales. El tiempo entra como parámetro, así que la
// misma secuencia de entradas produce siempre el mismo resultado (RNF-11).

export const FIXED_DT = 1 / 60;
/** Tope de pasos por frame para no entrar en espiral si el dispositivo se atrasa. */
export const MAX_STEPS_PER_FRAME = 5;

export class FixedStepLoop {
  private accumulator = 0;

  constructor(private readonly step: (dt: number) => void) {}

  /**
   * Avanza la simulación según el tiempo real transcurrido (en segundos).
   * Devuelve alpha en [0, 1): cuánto falta para el siguiente paso, para que
   * la presentación interpole entre el estado anterior y el actual (RF-02).
   */
  advance(elapsedSeconds: number): { steps: number; alpha: number } {
    this.accumulator += Math.max(0, elapsedSeconds);
    let steps = 0;
    while (this.accumulator >= FIXED_DT && steps < MAX_STEPS_PER_FRAME) {
      this.step(FIXED_DT);
      this.accumulator -= FIXED_DT;
      steps++;
    }
    if (steps === MAX_STEPS_PER_FRAME) this.accumulator = Math.min(this.accumulator, FIXED_DT);
    return { steps, alpha: this.accumulator / FIXED_DT };
  }

  /** Al recuperar el foco se descarta el tiempo acumulado para no saltar (RF-03). */
  reset(): void {
    this.accumulator = 0;
  }
}
