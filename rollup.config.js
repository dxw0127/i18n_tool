import { defineConfig } from "rollup";
import babel from "@rollup/plugin-babel";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";

export default defineConfig({
  input: "./src/index.ts",
  output: [
    {
      dir: "dist/esm",
      format: "esm",
      preserveModules: true,
    },
    {
      name: "utils",
      file: "dist/umd.min.js",
      format: "umd",
      exports: "named",
      plugins: [terser()],
    },
  ],
  plugins: [
    commonjs(),
    babel({ babelHelpers: "runtime", extensions: [".ts", ".js"] }),
    nodeResolve({
      extensions: [".ts"],
    }),
  ],
});
