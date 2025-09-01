import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("eslint:recommended", "@typescript-eslint/recommended", "plugin:react/recommended", "plugin:react-hooks/recommended"),
  {
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2020,
        sourceType: "module",
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "react/no-unescaped-entities": "off",
      "react/react-in-jsx-scope": "off",
      "jsx-a11y/alt-text": "off",
    },
  },
];

export default eslintConfig;
