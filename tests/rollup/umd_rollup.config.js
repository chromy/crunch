import commonjs from 'rollup-plugin-commonjs';
import nodeGlobals from 'rollup-plugin-node-globals';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: 'main.js',
  output: {
    name: 'umd_bundle',
    file: 'umd_bundle.js',
    format: 'umd'
  },
  plugins: [
    nodeResolve({
      mainFields: ['main'],
    }),
    commonjs({
      ignore: ['util', 'fs', 'path', 'crypto'],
    }),
    nodeGlobals({
      process: false,
    }),
  ]
};

