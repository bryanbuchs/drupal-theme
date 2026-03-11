# Copilot instructions for this repository

## Build, lint, and verification commands

- Install dependencies: `npm install`
- Production build: `npm run build`
- Watch/dev build (writes to `dist/` and runs BrowserSync proxy): `npm start`
- Lint all supported files: `npm run lint`
- Auto-fix lint issues: `npm run lint:fix`
- Build design tokens only: `npm run build-tokens`
- Run Storybook locally: `npm run storybook`
- CI-style Storybook verification/build: `npm run build-storybook`

Testing note: this repo has no dedicated `npm test` script or `*.test`/`*.spec` test suite. The closest automated verification is `npm run build-storybook` (`storybook build --test`). There is no single-test CLI command currently configured.

## High-level architecture

- This repo is a front-end build system for Drupal themes (not a full Drupal app). A generated Drupal starter theme consumes these files.
- `tokens/definitions/*.json` are the source of truth for design tokens. Style Dictionary compiles them to:
  - `tokens/css/variables.css`
  - `less/settings/variables.less`
- Vite is the main build pipeline (`vite.config.js`):
  - Discovers entrypoints via `components/**/*.library.js`
  - Builds per-component JS/CSS into `dist/`
  - Runs Style Dictionary at build start
  - Removes empty JS artifacts after bundle output
  - In watch mode, BrowserSync proxies `https://<package-name>.lndo.site` and reloads on `dist`, Twig, and template changes
- LESS processing injects all `less/**/*.less` files as reference imports globally, so shared mixins/settings are available during component compilation.
- Storybook (`@storybook/html-vite`) renders Drupal Twig components using `vite-plugin-twig-drupal`, with `@components`/`components` path aliases and mocked Drupal Twig functions/filters.

## Key repository conventions

- Component build entrypoints must be named `*.library.js` under `components/`; filenames determine output library names.
- Prefer updating token JSON in `tokens/definitions/`; do not hand-edit generated token outputs (`tokens/css/variables.css`, `less/settings/variables.less`).
- Storybook component stories are expected at `components/**/*.stories.js`.
- Drupal behavior assumptions are mocked in Storybook (`.storybook/preview-body.html`, `.storybook/preview.js`), including `window.Drupal`, `drupalSettings`, and `once`.
- ESLint is configured for JavaScript and Twig (`eslint . --ext .js,.twig`); CSS/LESS/HTML are intentionally ignored by ESLint.
- Pre-commit automation runs `lint-staged`; commit messages are validated by Commitlint conventional rules via Husky hooks.
- Formatting conventions are enforced via Prettier (`singleQuote: true`, `semi: false`, 2-space indentation).
