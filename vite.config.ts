import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import imagePathPlugin from "./scripts/vite-plugin-image-path";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      injectRegister: "auto",
      includeAssets: ["fonts/*.ttf", "./**/*.png"],
      manifest: {
        name: "Airia抽奖",
        short_name: "抽奖",
        description: "Airia抽奖系统",
        theme_color: "#ffffff",
        icons: [
          {
            src: "icon.jpg",
            sizes: "192x192",
            type: "image/jpg",
          },
          {
            src: "icon.jpg",
            sizes: "512x512",
            type: "image/jpg",
          },
        ],
      },
    }),
    imagePathPlugin(),
  ],
  build: {
    rollupOptions: {
      external: [/\.(png|jpe?g|gif|svg)$/],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
