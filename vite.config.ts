import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    react(),
    svgr({
      include: "**/*.svg",
    }),
  ],
  server: {
    port: 5200,
  },
  resolve: {
    alias: {
      "@components": "/src/components",
      "@containers": "/src/containers",
      "@forms": "/src/forms",
      "@hooks": "/src/hooks",
      "@layouts": "/src/layouts",
      "@pages": "/src/pages",
      "@providers": "/src/providers",
      "@routes": "/src/routes",
      "@services": "/src/services",
      "@store": "/src/store",
      "@ui-kit": "/src/ui-kit",
      "@utils": "/src/utils",
      "@types": "/src/@types",
    },
  },
});
