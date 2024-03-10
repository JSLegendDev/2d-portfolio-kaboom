import { defineConfig } from "vite";

export default defineConfig({
  base: "https://jslegenddev.github.io/2d-portfolio-kaboom/",
  build: {
    minify: "terser",
  },
});
