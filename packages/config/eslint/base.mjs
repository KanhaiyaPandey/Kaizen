export default [
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        projectService: true
      }
    },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }]
    }
  }
];
