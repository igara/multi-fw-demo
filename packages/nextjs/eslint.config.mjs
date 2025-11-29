import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import betterTailwindcss from "eslint-plugin-better-tailwindcss";

const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "better-tailwindcss": betterTailwindcss,
    },
    settings: {
      "better-tailwindcss": {
        // Tailwind CSS v4の場合: CSSエントリーポイント
        entryPoint: "app/globals.css",
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
]);

export default eslintConfig;
