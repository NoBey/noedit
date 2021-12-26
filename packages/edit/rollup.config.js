import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import url from '@rollup/plugin-url';
import {string} from "rollup-plugin-string";
import commonjs from '@rollup/plugin-commonjs'; 
import packageJson from './package.json'; 

// dependencies

export default {
  input: './src/index.tsx',
  external: Object.keys(packageJson.dependencies),
  output: {
    dir: 'dist',
    format: 'cjs',
  },

  plugins: [
    string({
      include: "**/*.md",
    }),
    commonjs(),
    url(),
    postcss({
      // modules: true,
      inject: true
    }),
    typescript({
      tsconfig: './tsconfig.json',
    }),
  ],

};
