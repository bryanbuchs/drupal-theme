# Drupal Theme Build System

This repo is limited to the dependencies and configuration to build CSS/JS files for a Drupal theme, with a Storybook interface for component development. A Drupal theme will need to be generated first (https://www.drupal.org/docs/core-modules-and-themes/core-themes/starterkit-theme). Then copy the files from this repo into that folder.

## Quick Start

- `pnpm build` compiles and optimizes the output
- `pnpm storybook` launches the storybook ui in a browser
- `pnpm build:tokens` regenerates the token CSS (runs automatically before the commands above)

## Notes

- `components` are expected to follow the conventions from https://github.com/bryanbuchs/generator-component
- Vite looks for `components/**/*.library.js` files and compiles each to the `dist` directory, registered as libraries for the corresponding SDC. The build exits cleanly when no entries are found.
- Design tokens compile to CSS custom properties. See [Design Tokens](#design-tokens).
- `dist`, `components` and `tokens` are ignored in this repo. Remove them from `.gitignore` after cloning.
- Small images referenced in CSS are inlined as data-URLs in the compiled output.

## Design Tokens

Tokens are written as JSON and compiled to CSS custom properties by Style Dictionary. Neither folder exists in a fresh clone - create `tokens/definitions/` and add at least one file. `tokens/css/` is generated.

```text
tokens/
  definitions/   source files, one JSON file per group of tokens
    colors.json
    themes.json
  css/           generated, one CSS file per JSON file - do not edit
    colors.css
    themes.css
```

- Any number of `*.json` files can go in `tokens/definitions/`, with any filenames. Each one compiles to a CSS file of the same name.
- Files use the [Design Tokens Community Group format](https://www.designtokens.org/tr/drafts/format/): a token is an object with a `$value` and a `$type`, nested inside any number of named groups.
- The custom property name comes from the path of keys to the token, not from the filename.
- A token can reference another token with `{path.to.token}`, including one defined in a different file. References compile to `var()`.

`tokens/definitions/colors.json`

```json
{
  "colors": {
    "brand": { "$value": "#175e54", "$type": "color" }
  }
}
```

`tokens/definitions/themes.json`

```json
{
  "themes": {
    "primary": {
      "background": { "$value": "{colors.brand}", "$type": "color" }
    }
  }
}
```

Running `pnpm build:tokens` then produces:

```css
/* tokens/css/colors.css */
:root {
  --colors-brand: #175e54;
}

/* tokens/css/themes.css */
:root {
  --themes-primary-background: var(--colors-brand);
}
```

Storybook loads every file in `tokens/css/` automatically. The Drupal theme needs its own library definition pointing at those files.
