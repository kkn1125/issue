import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    // ... Specify options here.
    reporters: ["default", "html"],
    coverage: {
      enabled: true,
    },
    benchmark: {
      reporters: "verbose",
      outputFile: "html",
    },
  },
  resolve: {
    alias: [
      { find: "@common/", replacement: "src/common/" },
      { find: "@lib/", replacement: "src/lib/" },
      { find: "@model/", replacement: "src/model/" },
      { find: "@module/", replacement: "src/module/" },
      { find: "@types/", replacement: "src/types/" },
      { find: "@src/", replacement: "src/" },
    ],
  },
  plugins: [tsconfigPaths()],
});
