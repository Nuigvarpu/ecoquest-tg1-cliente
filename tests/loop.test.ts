import { describe, expect, it } from "vitest";
import { FIXED_DT, FixedStepLoop, MAX_STEPS_PER_FRAME } from "../src/core/loop";

describe("FixedStepLoop (RF-01, RF-03)", () => {
  it("da 60 pasos en un segundo, sin importar cómo se reparta el tiempo", () => {
    let steps = 0;
    const loop = new FixedStepLoop(() => steps++);
    for (let i = 0; i < 30; i++) loop.advance(1 / 30); // dispositivo lento, 30 FPS
    expect(steps).toBe(60);
  });

  it("devuelve alpha para interpolar entre pasos (RF-02)", () => {
    const loop = new FixedStepLoop(() => {});
    const { steps, alpha } = loop.advance(FIXED_DT * 1.5);
    expect(steps).toBe(1);
    expect(alpha).toBeCloseTo(0.5, 5);
  });

  it("no entra en espiral cuando el frame tarda demasiado", () => {
    let steps = 0;
    const loop = new FixedStepLoop(() => steps++);
    loop.advance(2); // la pestaña estuvo congelada 2 s
    expect(steps).toBe(MAX_STEPS_PER_FRAME);
  });

  it("reset descarta el tiempo acumulado al volver el foco", () => {
    let steps = 0;
    const loop = new FixedStepLoop(() => steps++);
    loop.advance(FIXED_DT * 0.9);
    loop.reset();
    loop.advance(FIXED_DT * 0.2);
    expect(steps).toBe(0);
  });
});
