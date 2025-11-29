import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
  input: 'executable.js',
  output: {
    file: 'package/lib/community-dynamodb-marshaller.js',
    format: 'cjs'
  },
  plugins: [
    resolve({
      preferBuiltins: true
    }),
    commonjs(),
    json()
  ]
};
