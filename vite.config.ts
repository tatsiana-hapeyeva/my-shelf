import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/my-shelf/",
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:1444",
        changeOrigin: true,
      },
    },
  },
});
