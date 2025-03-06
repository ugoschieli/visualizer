import { defineConfig } from "vite";
import { monaco } from "@bithero/monaco-editor-vite-plugin";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  build: {
    target: "esnext",
  },
  plugins: [
    tailwindcss(),
    monaco({
      languages: ["javascript", "rust"],
    }),
  ],
});
