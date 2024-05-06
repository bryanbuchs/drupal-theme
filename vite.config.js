// vite.config.js
import { defineConfig } from 'vite'
import fs from 'fs'
import lessPluginGlob from 'less-plugin-glob'
import path from 'path'
import VitePluginBrowserSync from 'vite-plugin-browser-sync'

function getEntries(dir, parent = '') {
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
function getLessImports() {
  const lessDir = path.resolve(__dirname, 'less')
  const imports = fs
    .readdirSync(lessDir)
    .filter((file) => fs.statSync(path.join(lessDir, file)).isDirectory())
    .map((dir) => `@import (reference) './less/${dir}/*.less';`)

  return imports.join('\n')
}

export default defineConfig({
  base: './',
  build: {
    cssCodeSplit: true,
    cssMinify: true,
    minify: true,
    publicPath: '',
    reportCompressedSize: false,
    rollupOptions: {
      input: entries,
      output: {
        dir: 'dist',
        entryFileNames: '[name]/[name].js',
        chunkFileNames: '[name]/[name].js',
        assetFileNames: (assetInfo) => {
          // set an output path for each asset depending on the file extension
          const extension = path.extname(assetInfo.name).slice(1)
          let group = '[name]'

          switch (extension) {
            case 'woff':
            case 'woff2':
              group = 'webfonts'
              break

            case 'jpg':
            case 'gif':
            case 'png':
            case 'svg':
              group = 'images'
              break
          }

          return `${group}/[name].[ext]`
        }
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
          proxy: 'https://stanford-b2b.lndo.site',
          files: ['./dist', './templates'],
          watchEvents: ['add', 'change', 'unlink', 'addDir', 'unlinkDir'],
          ghostMode: false,
          ui: false,
          open: true
        }
      }
    })
  ]
})
