import { defineConfig } from "vite";

export default defineConfig({
  base: "/dist/",
  build: {
    minify: "terser",
  },
});
