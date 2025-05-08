// vite.config.js
import { defineConfig } from 'vite'
import fs from 'fs'
import { resolve, basename, extname } from 'path'
import { globSync } from 'tinyglobby'
import VitePluginBrowserSync from 'vite-plugin-browser-sync'
import browserslist from 'browserslist-to-esbuild'
import StyleDictionary from 'style-dictionary'
import sdConfig from './style-dictionary.config.js'
import project from './package.json'

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

function removeEmptyJsFiles () {
  return {
    name: 'remove-empty-js-files',
    closeBundle () {
      const files = globSync(['dist/**/*.js'], {})
      files.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8')
        // Strip all types of JavaScript/CSS comments and whitespace
        const strippedContent = content
          .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
          .replace(/\/\/.*/g, '') // Remove single-line comments
          .trim()

        if (strippedContent === '') {
          fs.unlinkSync(file)
        }
      })
    }
  }
}

function styleTokensPlugin () {
  return {
    name: 'style-tokens',
    buildStart () {
      // console.log('Building Style Dictionary tokens...')
      const sd = new StyleDictionary(sdConfig)
      sd.buildAllPlatforms()
    }
  }
}

// this will build the entry files in the components directory
// - build the style dictionary tokens to css/less files
// - output component css/js to the dist directory
// - copy the assets from the components directory to the dist directory
// - remove any empty .js files from the dist directory
// - (watch mode) set up a browser sync server to watch for changes and reload the browser automatically

export default defineConfig(({ mode }) => ({
  base: './',
  build: {
    target: browserslist(),
    outDir: resolve(import.meta.dirname, './dist'),
    reportCompressedSize: false,
    rollupOptions: {
      input: getEntries(),
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
  css: {
    preprocessorOptions: {
      less: {
        additionalData: getLessImports(),
        math: 'strict'
      }
    }
  },

  plugins: [
    styleTokensPlugin(),
    VitePluginBrowserSync({
      dev: { enable: false },
      preview: { enable: false },
      buildWatch: {
        enable: true,
        bs: {
          host: 'localhost',
          port: 8008,
          proxy: `https://${project.name}.lndo.site`,
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
