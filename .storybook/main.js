import path from 'path'
import twig from 'vite-plugin-twig-drupal'
import DrupalAttribute from 'drupal-attribute'

export default {
  framework: {
    name: '@storybook/html-vite',
    options: {}
  },
  stories: ['../components/**/*.stories.js'],
  staticDirs: ['../images'],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-backgrounds',
    '@storybook/addon-controls'
  ],
  viteFinal: async (config, { configType }) => {
    // resolve aliases to `@components` in *.stories.js files
    config.resolve.alias = {
      ...config.resolve.alias,
      '@components': path.resolve(__dirname, '../components')
    }
    config.plugins.push(twig({
      // resolve aliases to `@components` in *.twig files
      namespaces: {
        components: path.resolve(__dirname, '../components')
      },
      // mock Drupal twig filters & functions
      functions: {
        create_attribute: (twigInstance) => twigInstance.extendFunction("create_attribute", () => new DrupalAttribute()),
        typography: (twigInstance) => twigInstance.extendFilter("typography", (text) => text),
        clean_unique_id: (twigInstance) => twigInstance.extendFilter("clean_unique_id", (text) => text),
      }
    }))
    return config
  }
}
