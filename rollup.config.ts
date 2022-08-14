import { defineConfig } from "rollup";
import babel from "@rollup/plugin-babel";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
// import { terser } from "rollup-plugin-terser";

export default defineConfig({
  input: "./src/index.ts",
  output: [
    {
      name: "i18n_tool",
      file: "dist/index.js",
      format: "commonjs",
      exports: "named",
      // plugins: [terser()],
    },
  ],
  plugins: [
    commonjs(),
    json(),
    babel({ babelHelpers: "runtime", extensions: [".ts", ".js"] }),
    nodeResolve({
      extensions: [".ts", ".js", ".tsx", ".jsx"],
    }),
  ],
});
