// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  output: "static",
  adapter: vercel(),
  integrations: [
    react(),
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'zustand',
        'framer-motion',
        'date-fns',
        'clsx',
        'class-variance-authority',
        'tailwind-merge',
        '@radix-ui/*',
        'zod',
      ],
    },
  },
  server: {
    port: 4321,
    host: true,
  }
});
