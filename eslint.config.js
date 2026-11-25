import js from "@eslint/js";
import tseslint from "typescript-eslint";

// Regla de capas (RNF-10): la lógica de juego en src/core no puede depender
// del dispositivo de salida. Prohíbe Canvas, DOM, Three.js y las capas de
// presentación, input y red. Si esta regla falla en CI, el pull request no entra.
const coreRestrictions = {
  files: ["src/core/**/*.ts"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          { group: ["three", "three/*"], message: "La lógica no puede usar Three.js (RNF-10)." },
          { group: ["**/render/**"], message: "La lógica no puede depender de la presentación (RNF-10)." },
          { group: ["**/input/**"], message: "La lógica recibe acciones genéricas, no eventos de input (RF-07)." },
          { group: ["**/net/**"], message: "La lógica no conoce la red; el adaptador la llama a ella." },
        ],
      },
    ],
    "no-restricted-globals": [
      "error",
      { name: "window", message: "La lógica no puede usar el DOM (RNF-10)." },
      { name: "document", message: "La lógica no puede usar el DOM (RNF-10)." },
      { name: "navigator", message: "La lógica no puede usar APIs del navegador (RNF-10)." },
      { name: "requestAnimationFrame", message: "El bucle de render vive fuera de la lógica (RF-01)." },
      { name: "performance", message: "El tiempo llega como parámetro para que la simulación sea determinista (RNF-11)." },
      { name: "HTMLCanvasElement", message: "La lógica no puede usar Canvas (RNF-10)." },
      { name: "CanvasRenderingContext2D", message: "La lógica no puede usar Canvas (RNF-10)." },
    ],
  },
};

export default tseslint.config(
  { ignores: ["dist", "node_modules"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  coreRestrictions,
);
