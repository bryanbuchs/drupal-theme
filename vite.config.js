// vite.config.js
import { defineConfig } from 'vite'
import fs from 'fs'
import lessPluginGlob from 'less-plugin-glob'
import path from 'path'
import VitePluginBrowserSync from 'vite-plugin-browser-sync'

function getEntries (dir, parent = '') {
  let entries = {}
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      const newParent = parent ? `${parent}/${file}` : file
      entries = { ...entries, ...getEntries(fullPath, newParent) }
    } else if (file.endsWith('.library.js')) {
      const name = `${path.basename(file, '.library.js')}`
      entries[name] = fullPath
    }
  }
  return entries
}

const componentsDir = path.resolve(__dirname, 'components')
const entries = getEntries(componentsDir)

// get a list of the folders in the /less/ directory and set up
// an @import statement for each one using the glob plugin to
// import all .less files in each folder
function getLessImports () {
  const lessDir = path.resolve(__dirname, 'less')
  const imports = fs
    .readdirSync(lessDir)
    .filter(file => fs.statSync(path.join(lessDir, file)).isDirectory())
    .map(dir => `@import (reference) './less/${dir}/*.less';`)

  return imports.join('\n')
}

function removeEmptyJsFiles () {
  return {
    name: 'remove-empty-js-files',
    closeBundle () {
      const distDir = path.resolve(__dirname, 'components')
      fs.readdirSync(distDir, { withFileTypes: true }).forEach(dirent => {
        if (dirent.isDirectory()) {
          const componentDir = path.join(distDir, dirent.name, 'dist')
          if (fs.existsSync(componentDir)) {
            fs.readdirSync(componentDir).forEach(file => {
              if (file.endsWith('.js')) {
                const filePath = path.join(componentDir, file)
                const content = fs.readFileSync(filePath, 'utf-8')
                if (content.trim() === '') {
                  fs.unlinkSync(filePath)
                }
              }
            })
          }
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

export default defineConfig({
  base: './',
  build: {
    cssCodeSplit: true,
    cssMinify: true,
    minify: true,
    publicPath: '',
    reportCompressedSize: false,
    emptyOutDir: true,
    copyPublicDir: false,
    rollupOptions: {
      input: entries,
      output: {
        dir: 'dist',
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: assetInfo => `[name].[ext]`
      }
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        additionalData: getLessImports(),
        math: 'strict',
        plugins: [lessPluginGlob]
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
})
