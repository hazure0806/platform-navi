// eslint.config.mjs
import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";
import eslintPluginPrettier from "eslint-plugin-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Prettier 関連
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ignores: ["node_modules"],
    plugins: { prettier: eslintPluginPrettier },
    rules: {
      // Prettier エラーを ESLint エラーとして出す
      "prettier/prettier": [
        "error",
        {
          singleQuote: false,
          jsxSingleQuote: false,
        },
      ],
    },
  },
];

export default eslintConfig;
