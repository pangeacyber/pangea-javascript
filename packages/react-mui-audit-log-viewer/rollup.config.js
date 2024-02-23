// /rollup.config.js
import resolve from "@rollup/plugin-node-resolve";
import external from "rollup-plugin-peer-deps-external";
import terser from "@rollup/plugin-terser";
import postcss from "rollup-plugin-postcss";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import dts from "rollup-plugin-dts";
import json from "@rollup/plugin-json";
import nodePolyfills from "rollup-plugin-polyfill-node";

import pkg from "./package.json";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        dir: "dist/cjs",
        format: "cjs",
        sourcemap: true,
        name: "react-lib",
      },
      {
        dir: "dist/esm",
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      external(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      json(),
      postcss(),
      terser(),
      nodePolyfills(),
      replace({
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        preventAssignment: true,
      }),
    ],
    external: Object.keys(pkg.peerDependencies || {}),
  },
  {
    input: "src/index.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    external: [/\.css$/],
    plugins: [dts()],
  },
];
