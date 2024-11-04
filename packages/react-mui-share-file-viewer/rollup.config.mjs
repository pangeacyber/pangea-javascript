import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import { dts } from "rollup-plugin-dts";
import external from "rollup-plugin-peer-deps-external";
import nodePolyfills from "rollup-plugin-polyfill-node";
import postcss from "rollup-plugin-postcss";

import pkg from "./package.json" with { type: "json" };

export default defineConfig([
  {
    input: "src/index.ts",
    output: [
      {
        dir: "dist/cjs",
        format: "cjs",
        sourcemap: true,
        interop: "auto",
        name: pkg.name,
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
]);
