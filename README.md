# Drupal Theme Build System

This repo is limited to the dependencies and configuration to build CSS/JS files for a Drupal theme, with a Storybook interface for component development. A Drupal theme will need to be generated first (https://www.drupal.org/docs/core-modules-and-themes/core-themes/starterkit-theme). Then copy the files from this repo into that folder.

## Quick Start

- `pnpm build` compiles and optimizes the output
- `pnpm start` watches files for changes in any linked files (`import from...` or `background-image:...`), and compiles the results to `dist/`. Also starts a browsersync instance with a proxy to a lando server
- `pnpm storybook` launches the storybook ui in a browser
- `pnpm build:tokens` regenerates the token CSS (runs automatically before the commands above)

## Notes

- `components` are expected to follow the conventions from https://github.com/bryanbuchs/generator-component
- Vite looks for `components/**/*.library.js` files and compiles each to the `dist` directory, registered as libraries for the corresponding SDC. The build exits cleanly when no entries are found.
- Design tokens live in `tokens/definitions/*.json` and compile via Style Dictionary to one CSS file per group in `tokens/css/` (`colors`, `themes`, `surfaces`, `typography`).
- Small images referenced in CSS are inlined as data-URLs in the compiled output.
