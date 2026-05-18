<<<<<<< HEAD
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { fileURLToPath, URL } from "node:url";
=======
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
>>>>>>> ff64db5053116e130694ae8ddd0ff07d4b45be9f

// https://vite.dev/config/
export default defineConfig({
<<<<<<< HEAD
  plugins: [
    tanstackStart(),
    nitro(),
    viteReact(),
    tailwindcss(),
    tsConfigPaths(),
  ],

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    dedupe: ["react", "react-dom", "@tanstack/react-router"],
  },
});
=======
  plugins: [react()],
})
>>>>>>> ff64db5053116e130694ae8ddd0ff07d4b45be9f
