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
      {
        find: "@common/",
        replacement: new URL("./src/common/", import.meta.url).pathname,
      },
      {
        find: "@lib/",
        replacement: new URL("./src/lib/", import.meta.url).pathname,
      },
      {
        find: "@model/",
        replacement: new URL("./src/model/", import.meta.url).pathname,
      },
      {
        find: "@module/",
        replacement: new URL("./src/module/", import.meta.url).pathname,
      },
      {
        find: "@types/",
        replacement: new URL("./src/types/", import.meta.url).pathname,
      },
      {
        find: "@src/",
        replacement: new URL("./src/", import.meta.url).pathname,
      },
    ],
  },
  plugins: [tsconfigPaths()],
});
