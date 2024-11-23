import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills(),
    svgr({
      svgrOptions: {
        icon: true,
      },
      include: "**/*.svg?react",
    }),
  ],
  base: "/swap",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
