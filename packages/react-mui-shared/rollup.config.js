// /rollup.config.js
import resolve from "@rollup/plugin-node-resolve";
import external from "rollup-plugin-peer-deps-external";
import terser from "@rollup/plugin-terser";
import postcss from "rollup-plugin-postcss";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import nodePolyfills from "rollup-plugin-polyfill-node";
import dts from "rollup-plugin-dts";

import pkg from "./package.json";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: pkg.main,
        format: "cjs",
        sourcemap: true,
        name: "react-lib",
      },
      {
        file: pkg.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      external(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      postcss(),
      terser(),
      nodePolyfills(),
      replace({
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        preventAssignment: true,
      }),
    ],
    external: Object.keys(pkg.peerDependencies || {}),
    inlineDynamicImports: true,
  },
  {
    input: "dist/esm/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    external: [/\.css$/],
    plugins: [dts()],
  },
];
