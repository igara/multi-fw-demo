import tsParser from "@typescript-eslint/parser";
import betterTailwindcss from "eslint-plugin-better-tailwindcss";

export default [
  {
    ignores: ["dist", "storybook-static"],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "better-tailwindcss": betterTailwindcss,
    },
    settings: {
      "better-tailwindcss": {
        // Tailwind CSS v4の場合: CSSエントリーポイント
        entryPoint: "src/themes/default.css",
        // Tailwind CSS v3の場合: 設定ファイル
        // tailwindConfig: "tailwind.config.js",
      },
    },
    rules: {
      // Tailwind特有のルールのみ有効化（Biomeと競合しないように）
      "better-tailwindcss/no-unregistered-classes": "error",
      "better-tailwindcss/no-conflicting-classes": "error",
      "better-tailwindcss/no-deprecated-classes": "warn",
      "better-tailwindcss/no-restricted-classes": "off",

      // フォーマット関連のルールはBiomeに任せるため無効化
      "better-tailwindcss/enforce-consistent-line-wrapping": "off",
      "better-tailwindcss/enforce-consistent-class-order": "off",
      "better-tailwindcss/enforce-consistent-variable-syntax": "off",
      "better-tailwindcss/enforce-consistent-important-position": "off",
      "better-tailwindcss/enforce-shorthand-classes": "off",
      "better-tailwindcss/no-duplicate-classes": "off",
      "better-tailwindcss/no-unnecessary-whitespace": "off",
    },
  },
];
