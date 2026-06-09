import { execSync } from 'node:child_process'
import StyleDictionary from 'style-dictionary'

const TOKENS_DIR = 'tokens/definitions'
const OUTPUT_DIR = 'tokens/css'

// Self-contained token files: each maps to its own CSS file.
const cssFiles = ['colors', 'surfaces', 'typography']

for (const name of cssFiles) {
  const sd = new StyleDictionary({
    log: { verbosity: 'silent' },
    source: [`${TOKENS_DIR}/${name}.json`],
    platforms: {
      css: {
        transformGroup: 'css',
        buildPath: `${OUTPUT_DIR}/`,
        files: [
          {
            destination: `${name}.css`,
            format: 'css/variables',
            options: { outputReferences: true }
          }
        ]
      }
    }
  })
  await sd.buildAllPlatforms()
}

// Themes reference palette colors, so the colors source must be present for
// references to resolve, but only theme tokens are written to themes.css.
const themesSd = new StyleDictionary({
  log: { verbosity: 'silent' },
  source: [`${TOKENS_DIR}/colors.json`, `${TOKENS_DIR}/themes.json`],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: `${OUTPUT_DIR}/`,
      files: [
        {
          destination: 'themes.css',
          format: 'css/variables',
          filter: token => token.filePath.endsWith('themes.json'),
          options: { outputReferences: true }
        }
      ]
    }
  }
})
await themesSd.buildAllPlatforms()

execSync(`npx oxfmt ${OUTPUT_DIR}/*.css`, { stdio: 'inherit' })
