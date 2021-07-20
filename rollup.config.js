import json from '@rollup/plugin-json'
import typescript from '@rollup/plugin-typescript'
import sourcemaps from 'rollup-plugin-sourcemaps'

export default {
  input: 'src/main.ts',
  output: [
    {
      name: 'main',
      dir: 'docs',
      format: 'esm'
    },
    {
      name: 'browser',
      file: 'docs/browser.js',
      format: 'umd',
      sourcemap: true
    }
  ],
  plugins: [
    json(),
    typescript(),
    sourcemaps()
  ]
}
