import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: 'main.js',
  output: {
    name: 'umd_bundle',
    file: 'umd_bundle.js',
    format: 'umd'
  },
  plugins: [
    nodeResolve(),
    commonjs({
      ignore: ['util'],
    }),
  ]
};

