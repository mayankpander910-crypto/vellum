import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(process.cwd(), "src") } },
  test: {
    environment: "node",
    include: ["src/tests/**/*.test.ts"],
    testTimeout: 60000,
    hookTimeout: 60000,
  },
});
