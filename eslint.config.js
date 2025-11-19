import js from '@eslint/js'
import globals from 'globals'
import pluginPrettier from 'eslint-plugin-prettier'
import pluginImport from 'eslint-plugin-import'
import pluginN from 'eslint-plugin-n'
import pluginPromise from 'eslint-plugin-promise'
import pluginStorybook from 'eslint-plugin-storybook'
import pluginHtml from 'eslint-plugin-html'
import configPrettier from 'eslint-config-prettier'

export default [
  // Ignore CSS and LESS files - they don't contain JavaScript
  {
    ignores: [
      'node_modules/',
      'vendor/',
      'dist/',
      'build/',
      'public/build/',
      '*.min.js',
      'storybook-static/',
      'coverage/',
      '**/*.css',
      '**/*.less',
      '**/*.html'
    ]
  },

  // Base JavaScript configuration
  js.configs.recommended,

  // Node.js plugin recommended config
  pluginN.configs['flat/recommended'],

  // Promise plugin recommended config
  pluginPromise.configs['flat/recommended'],

  // Storybook recommended configuration
  ...pluginStorybook.configs['flat/recommended'],

  // General configuration for all files
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        // Drupal globals
        Drupal: 'readonly',
        jQuery: 'readonly',
        $: 'readonly',
        drupalSettings: 'readonly',
        once: 'readonly'
      }
    },

    plugins: {
      import: pluginImport,
      prettier: pluginPrettier
    },

    rules: {
      'prettier/prettier': 'error',

      // Adjust n/no-missing-import for ESM
      'n/no-missing-import': 'off',
      'n/no-unpublished-import': 'off',
      // Disable Node.js feature checks since this is primarily browser code
      'n/no-unsupported-features/node-builtins': 'off',
      // Allow globals import for ESLint configuration
      'n/no-extraneous-import': ['error', { allowModules: ['globals'] }]
    }
  },

  // Twig template files configuration
  {
    files: ['**/*.twig'],
    plugins: {
      html: pluginHtml
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        ...globals.browser,
        // Drupal/jQuery globals commonly used in Twig templates
        Drupal: 'readonly',
        jQuery: 'readonly',
        $: 'readonly',
        drupalSettings: 'readonly'
      }
    },
    rules: {
      // Disable Node.js specific rules for Twig files
      'n/no-missing-import': 'off',
      'n/no-unpublished-import': 'off',
      'n/no-unsupported-features/node-builtins': 'off',
      'n/no-missing-require': 'off',
      'n/no-extraneous-require': 'off',
      // Allow inline JavaScript in templates
      'no-inline-comments': 'off'
    }
  },

  // Prettier config (disables conflicting rules) - must be last
  configPrettier
]
