/*
 * compile the tokens with style-dictionary and export them as a css "file"
 * does not require a build step, can be imported directly in the storybook
 */

import StyleDictionary from 'style-dictionary'
import memfs from '@bundled-es-modules/memfs'

// Create a virtual file system to store the generated CSS file
// This allows us to avoid writing to the disk and instead keep everything in memory
const { Volume } = memfs
const vol = new Volume()

// Use Vite's glob import to load all JSON files
const tokenModules = import.meta.glob('../tokens/definitions/*.json', {
  eager: true
})

const tokens = Object.entries(tokenModules).reduce((acc, [module]) => {
  return {
    ...acc,
    ...module.default
  }
}, {})

const sd = new StyleDictionary(
  {
    tokens,
    platforms: {
      css: {
        transformGroup: 'css',
        files: [
          {
            destination: 'variables.css',
            format: 'css/variables'
          }
        ]
      }
    },
    log: { verbosity: 'silent' }
  },
  { volume: vol }
)

await sd.buildPlatform('css')

const readfile = vol.readFileSync('/variables.css')
const variables = readfile.toString()

export { variables }
