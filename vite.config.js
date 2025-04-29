// vite.config.js
import { defineConfig } from 'vite'
import fs from 'fs'
import { resolve, basename, join} from 'path'
import { globSync } from 'tinyglobby'
import VitePluginBrowserSync from 'vite-plugin-browser-sync'
import browserslist from 'browserslist-to-esbuild'

const getEntries = () => {
  const files = globSync(['components/**/*.library.js'], {})
  return files.reduce((entries, file) => {
    const name = basename(file, '.library.js')
    entries[name] = file
    return entries
  }, {})
}

// get a list of the folders in the /less/ directory and set up
// an @import statement for each one using the glob plugin to
// import all .less files in each folder
function getLessImports () {
  const files = globSync(['less/**/*.less'], {})
  return files.map(file => `@import (reference) './${file}';`).join('\n')
}

console.log(getLessImports())

function removeEmptyJsFiles () {
  return {
    name: 'remove-empty-js-files',
    closeBundle () {
      const files = globSync(['dist/**/*.js'], {})
      files.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8')
        if (content.trim() === '') {
          fs.unlinkSync(file)
        }
      })
    }
  }
}

// this will build the entry files in the components directory
// - output to the dist directory
// - copy the assets from the components directory to the dist directory
// - remove any empty .js files from the dist directory
// - set up a browser sync server to watch for changes and reload the browser automatically

export default defineConfig(({ mode }) => ({
  base: './',
  build: {
    lib: {
      entry: getEntries(),
      formats: ['es'],
    },
    target: browserslist(),
    cssCodeSplit: true,
    outDir: resolve(import.meta.dirname, './dist'),
    sourcemap: mode === 'development',
    rollupOptions: {
      output: {
        chunkFileNames: 'chunks/[name]-[hash].js',
      },
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        additionalData: getLessImports(),
        math: 'strict'
      }
    }
  },

  plugins: [
    VitePluginBrowserSync({
      dev: { enable: false },
      preview: { enable: false },
      buildWatch: {
        enable: true,
        bs: {
          host: 'localhost',
          port: 8008,
          proxy: 'https://CHANGEME.lndo.site',
          files: ['./dist', './templates', './components/**/*.twig'],
          watchEvents: ['add', 'change', 'unlink', 'addDir', 'unlinkDir'],
          ghostMode: false,
          ui: false,
          open: true
        }
      }
    }),
    removeEmptyJsFiles()
  ]
}))
