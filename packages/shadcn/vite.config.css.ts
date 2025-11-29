import { defineConfig } from "vite";

// CSS専用のビルド設定
export default defineConfig({
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        "themes/default": "src/themes/default.css",
        "themes/green": "src/themes/green.css",
        "themes/blue": "src/themes/blue.css",
      },
      output: {
        assetFileNames: "[name][extname]",
      },
    },
    // CSSのみをビルドするため、JSバンドルを生成しない
    emptyOutDir: false, // メインビルドの成果物を残す
  },
});
