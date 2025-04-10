import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  base: "https://azurexh.github.io/",
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        manualChunks: {
          images: [
            "./src/assets/Award",
            "./src/assets/HomeBackground",
            "./src/assets/LotteryBackground",
            "./src/assets/PersonAnimation",
            "./src/assets/PotAnimation",
          ],
        },
      },
    },
  },
});
