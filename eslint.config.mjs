import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier";

export default [
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2021,
        p5: "readonly",
        // Common p5.js globals often used without 'p5.' prefix if in global mode, 
        // but this project seems to use modules. 
        // Based on sketch.js imports, it is a module.
        // However, p5 usually injects globals. 
        // Let's assume standard browser globals + p5 specific ones if needed.
      },
    },
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      "prettier/prettier": "error",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": "off", // Games often use console for debugging
    },
  },
  eslintConfigPrettier,
];
