import json from '@rollup/plugin-json'
import typescript from '@rollup/plugin-typescript'

export default {
  input: 'src/main.ts',
  output: {
    name: 'main.js',
    dir: 'dist',
    format: 'umd'
  },
  plugins: [
    json(),
    typescript()
  ]
}
