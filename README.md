# Drupal Theme Build System

This repo is limited to the dependencies and configuration to build CSS/JS files for a Drupal theme, with a Storybook interface for component development. A Drupal theme will need to be generated first (https://www.drupal.org/docs/core-modules-and-themes/core-themes/starterkit-theme). Then copy the files from this repo into that folder.

# Quick Start

- `pnpm build` compiles and optimizes the output
- `pnpm start` watches files for changes in any linked files (`import from...` or `background-image:...`), and compiles the results to `dist/`. Also starts a browsersync instance with a proxy to a lando server
- `pnpm storybook` launches the storybook ui in a browser.

## Notes

- `components` are expected to follow the conventions from https://github.com/bryanbuchs/generator-component (`yo generate component`)
- Vite will look for `components/**/*.library.js` files and the results of each will be compiled to the `dist` directory, and will be registered as libraries for the corresponding SDC.
- The mixin and settings files in the root `less` directory are automatically loaded when processing LESS.
- Images smaller than 10kb referenced in CSS/LESS will be inlined as data-url in the compiled CSS.
- SVGs can be inlined the same way.
