import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";

// https://vitejs.dev/config/
export default defineConfig({
  node: true,
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },

});