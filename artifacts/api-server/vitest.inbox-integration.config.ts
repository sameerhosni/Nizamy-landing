import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/lib/supportInbox.integration.ts"],
    testTimeout: 15_000,
    hookTimeout: 60_000,
  },
});
