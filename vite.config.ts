import { defineConfig } from "vite";

// base relativo para que el build funcione en GitHub Pages (https://<usuario>.github.io/<repo>/).
export default defineConfig({
  base: "./",
  test: {
    include: ["tests/**/*.test.ts"],
  },
});
