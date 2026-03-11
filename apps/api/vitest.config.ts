import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@acme/db": fileURLToPath(new URL("../../packages/db/src/index.ts", import.meta.url)),
      "@acme/queue": fileURLToPath(new URL("../../packages/queue/src/index.ts", import.meta.url)),
      "@acme/shared": fileURLToPath(new URL("../../packages/shared/src/index.ts", import.meta.url))
    }
  },
  test: {
    environment: "node",
    include: ["src/tests/**/*.test.ts"]
  }
});
