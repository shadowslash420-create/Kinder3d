import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { metaImagesPlugin } from "./vite-plugin-meta-images";

export default defineConfig({
  define: {
    "import.meta.env.VITE_FIREBASE_API_KEY": JSON.stringify(process.env.FIREBASE_API_KEY),
    "import.meta.env.VITE_FIREBASE_AUTH_DOMAIN": JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN),
    "import.meta.env.VITE_FIREBASE_PROJECT_ID": JSON.stringify(process.env.FIREBASE_PROJECT_ID),
    "import.meta.env.VITE_FIREBASE_STORAGE_BUCKET": JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET),
    "import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID": JSON.stringify(process.env.FIREBASE_MESSAGING_SENDER_ID),
    "import.meta.env.VITE_FIREBASE_APP_ID": JSON.stringify(process.env.FIREBASE_APP_ID),
  },
  plugins: [
    react(),
    runtimeErrorOverlay(),
    tailwindcss(),
    metaImagesPlugin(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  css: {
    postcss: {
      plugins: [],
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          ui: ["@radix-ui/react-accordion", "@radix-ui/react-alert-dialog", "@radix-ui/react-avatar", "@radix-ui/react-checkbox", "@radix-ui/react-dialog", "@radix-ui/react-label", "@radix-ui/react-popover", "@radix-ui/react-select", "@radix-ui/react-switch", "@radix-ui/react-tabs", "@radix-ui/react-toast"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    sourcemap: false,
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    middlewareMode: false,
    hmr: {
      clientPort: 443,
    },
  },
});
