// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import hash from 'rollup-plugin-hash';
import builtins from 'rollup-plugin-node-builtins';
import {terser} from 'rollup-plugin-terser';

import postcss from 'rollup-plugin-postcss';
import postcssImport from 'postcss-import';

const INPUT_FILE = 'index.js';
const OUTPUT_FILE = 'dist/index.js';
const isProduction = process.env.NODE_ENV === 'production';

export default {
  input: INPUT_FILE,
  output: {
    file: OUTPUT_FILE,
    format: 'iife',
    name: 'codedownmirrorthing'
  },
  plugins: [
    // Replace calls to process.env with build-time variables
    replace({
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'production'
      ),
      'process.env.GA_TRACKING_ID': JSON.stringify(
        process.env.GA_TRACKING_ID || ''
      )
    }),
    // Resolve modules for bundling using node's search algorithtm
    resolve(),
    // Allow resolving CommonJS modules
    commonjs(),
    builtins(),
    postcss({
      extract: isProduction ? true : false,
      plugins: [postcssImport],
      minimize: isProduction ? true : false
    }),
    ifProduction(terser)
  ]
};

function ifProduction(plugin) {
  return isProduction ? plugin() : null;
}
