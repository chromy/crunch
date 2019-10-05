import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: 'main.js',
  output: {
    name: 'cjs_bundle',
    file: 'cjs_bundle.js',
    format: 'cjs'
  },
  plugins: [
    nodeResolve({
      preferBuiltins: true,
    }),
    commonjs({
      ignore: ['util'],
    }),
  ]
};

