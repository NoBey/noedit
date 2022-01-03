import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';

export default {
  input: './src/index.tsx',
  output: {
    dir: 'dist',
    format: 'cjs',
  },
  plugins: [
    postcss({
      modules: true,
    }),
    typescript({
      tsconfig: './tsconfig.json',
    }),
  ],
};
