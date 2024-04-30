// vite.config.js
import fs from 'fs'
import path from 'path'
import { defineConfig } from 'vite'

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

const globalLessVars = getLessImports()

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: entries,
      output: {
        dir: 'dist',
        entryFileNames: '[name]/[name].js',
        chunkFileNames: '[name]/[name].js',
        assetFileNames: assetInfo => {
          // set an output path for each asset depending on the file extension

          const extension = path.extname(assetInfo.name).slice(1)
          let fileNames = '[name]'

          switch (extension) {
            case 'woff':
            case 'woff2':
              fileNames = 'fonts'
              break

            case 'jpg':
            case 'gif':
            case 'png':
            case 'svg':
              fileNames = 'images'
              break
          }

          return `${fileNames}/[name].[ext]`
        }
      }
    },
    reportCompressedSize: false,
    sourcemap: true,
    publicPath: '',
    cssCodeSplit: true
  },
  css: {
    preprocessorOptions: {
      less: {
        math: 'strict',
        plugins: [require('less-plugin-glob')],
        additionalData: `${globalLessVars}`
      }
    }
  }
})
