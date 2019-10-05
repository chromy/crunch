import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import nodeGlobals from 'rollup-plugin-node-globals';

export default {
  input: 'main.js',
  output: {
    name: 'cjs_bundle',
    file: 'cjs_bundle.js',
    format: 'cjs'
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

