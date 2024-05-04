import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import path from "path";

export default defineConfig(({ command }) => {
  if (command === "serve") {
    // Dev config
    return {
      plugins: [],
      root: path.resolve(__dirname, "dev"),
      build: {
        outDir: path.resolve(__dirname, "dist"),
      },
    };
  } else {
    // Build config
    return {
      plugins: [react(), dts()],
      build: {
        lib: {
          entry: path.resolve(__dirname, "src/index.ts"),
          name: "@hudoro/hooks",
          formats: ["es", "umd", "cjs"],
          fileName: (format) => `index.${format}.js`,
        },
      },
    };
  }
});
