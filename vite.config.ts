import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      "/fezzi-app": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/fezzi-app/, "") || "/",
      },
      "/_next": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
      },
      "/Soda-can.gltf": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
      },
      "/Soda-can.bin": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
      },
      "/labels": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
      },
      "/hdr": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
      },
      "/fonts": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
