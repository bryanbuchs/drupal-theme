import StyleDictionary from 'style-dictionary'
import { basename, resolve } from 'path'
import { globSync } from 'tinyglobby'

const TOKENS_DIR = 'tokens/definitions'
const OUTPUT_DIR = 'tokens/css'

const definitions = globSync([`${TOKENS_DIR}/*.json`], {})

if (definitions.length === 0) {
  console.log(
    `No token definitions found (${TOKENS_DIR}/*.json); nothing to build.`
  )
  process.exit(0)
}

// Every definition is loaded as a source so tokens can reference each other
// across files, and each definition is written to a CSS file of the same name.
const sd = new StyleDictionary({
  log: { verbosity: 'silent' },
  source: definitions,
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: `${OUTPUT_DIR}/`,
      files: definitions.map(definition => ({
        destination: `${basename(definition, '.json')}.css`,
        format: 'css/variables',
        filter: token => resolve(token.filePath) === resolve(definition),
        options: { outputReferences: true }
      }))
    }
  }
})
await sd.buildAllPlatforms()
