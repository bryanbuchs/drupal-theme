import { defineConfig } from 'vite'
import fs from 'fs'
// import { parse } from "yaml";
import { resolve, basename, extname } from 'path'
import { globSync } from 'tinyglobby'
import VitePluginBrowserSync from 'vite-plugin-browser-sync'
import browserslist from 'browserslist-to-esbuild'

// const lando = parse(fs.readFileSync('../../../../.lando.yml', 'utf8'));
const lando = { name: 'TEST' }

function getEntries() {
  const files = globSync(['components/**/*.library.js'], {})

  return files.reduce((entries, file) => {
    const name = basename(file, '.library.js')
    entries[name] = file
    return entries
  }, {})
}

function removeEmptyJsFiles() {
  return {
    name: 'remove-empty-js-files',
    closeBundle() {
      const files = globSync(['dist/**/*.js'], {})
      files.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8')
        const stripped = content
          .replace(/\/\*[\s\S]*?\*\//g, '')
          .replace(/\/\/.*/g, '')
          .trim()
        if (stripped === '') {
          fs.unlinkSync(file)
        }
      })
    }
  }
}

export default defineConfig(({ command }) => {
  const input = getEntries()

  // A direct `vite build` with no components has nothing to bundle, so exit
  // cleanly instead of failing on an empty rollup input. Storybook loads this
  // same config and supplies its own entries, so leave it alone.
  if (
    command === 'build' &&
    !process.env.STORYBOOK &&
    Object.keys(input).length === 0
  ) {
    console.log(
      'No build entries found (components/**/*.library.js); nothing to build.'
    )
    process.exit(0)
  }

  return {
    base: './',
    build: {
      target: browserslist(),
      outDir: resolve(import.meta.dirname, './dist'),
      reportCompressedSize: false,
      rollupOptions: {
        input,
        output: {
          entryFileNames: '[name].js',
          chunkFileNames: '[name]-[hash].js',
          assetFileNames: ({ name }) => {
            const ext = extname(name)
            switch (ext) {
              case '.css':
                return '[name].css'
              default:
                return '[name]-[hash][extname]'
            }
          }
        }
      }
    },
    plugins: [
      VitePluginBrowserSync({
        dev: { enable: false },
        preview: { enable: false },
        buildWatch: {
          enable: process.env.BROWSERSYNC !== 'false',
          bs: {
            host: 'localhost',
            proxy: `https://${lando.name}.lndo.site`,
            files: ['./dist', './templates', './components'],
            watchEvents: ['add', 'change', 'unlink', 'addDir', 'unlinkDir'],
            ghostMode: false,
            ui: false,
            open: false
          }
        }
      }),
      removeEmptyJsFiles()
    ]
  }
})
