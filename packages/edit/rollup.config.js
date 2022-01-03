import postcss from 'rollup-plugin-postcss';
import url from '@rollup/plugin-url';
import { string } from 'rollup-plugin-string';
import commonjs from '@rollup/plugin-commonjs';
import packageJson from './package.json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
// import typescript from '@rollup/plugin-typescript';
import ts from "rollup-plugin-ts";
// dependencies

export default {
  sourceMap: true,
  input: './src/index.tsx',
  external: Object.keys(packageJson.dependencies),
  output: {
    dir: 'dist',
    format: 'cjs',
  },
  plugins: [
    string({
      include: '**/*.md',
    }),
    url(),
    postcss({
      // modules: true,
      inject: true,
    }),
    commonjs(),
    ts({tsconfig: './tsconfig.json'}),
    // nodeResolve(),
  ],
};
