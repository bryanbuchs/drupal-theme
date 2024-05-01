# Quick Start

- `npm run build` compiles and optimizes the output
- `npm start` watches files for changes in any linked files (`import from...` or `background-image:...`), and compiles the results to `dist/`. Also starts a browsersync instance with a proxy to a lando server
- `npm run storybook` launches the storybook ui in a browser.

## Notes

* `components` are expected to follow the conventions from https://github.com/bryanbuchs/generator-component (`yo generate component`)
* Vite will look for `components/**/*.library.js` files and the results of each will be compiled to their own `dist` files.
* The mixin and settings files in the root `less` directory are automatically loaded when processing LESS.
* Images smaller than 10kb referenced in CSS/LESS will be inlined as data-url in the compiled CSS.
* SVGs can be inlined the same way, or by using [postcss-inline-svg](https://github.com/bryanbuchs/postcss-inline-svg) if fill/stroke colors need to be adjusted per-rule.
* `postcss-inline-svg` will look for SVGs at these paths, in order:
  * same directory as the component
  * the shared `/images` folder
  * installed in `node_modules`
  * A FontAwesome icon, using the pattern `[solid|regular|brands]/[icon].svg`

## TODO

- [x] `npm start` runs the watch task and starts a browsersync instance with a proxy to a lando server
- [x] remove empty build files (`[name]/[name].js`) for css-only components
- [x] add storybook config
- [ ] troubleshoot storybook controls (https://github.com/bryanbuchs/drupal-theme/issues/1)
- [ ] add default Drupal theme assets (https://github.com/bryanbuchs/drupal-theme/issues/2)
