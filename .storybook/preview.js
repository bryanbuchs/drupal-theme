// global styles from our theme
// ...

// storybook preview
import './prevent-default.js'
import './preview.less'

export const parameters = {
  options: {
    storySort: {
      order: [
        'README',
        'Global',
        'Element',
        'Entity',
        'Media',
        'Paragraph',
        'Nav',
        'Block',
        'Region',
        'View'
      ]
    }
  },

  backgrounds: {
    default: 'white',
    values: [
      { name: 'white', value: '#ffffff' },
      { name: 'theme-olive', value: '#707c36' },
      { name: 'theme-plum', value: '#620059' },
      { name: 'theme-lagunita', value: '#007c92' },
      { name: 'paragraph-shaded', value: '#f4f4f4' },
      { name: 'stone-light-75', value: '#dfdddd' },
      { name: 'region-footer', value: '#eae8e8' }
    ]
  },

  controls: { hideNoControlsWarning: true }
}

export const argTypes = {}
const hiddenControls = [
  'attributes',
  'media',
  'config',
  'table',
  'rows',
  'cards',
  'menu',
  'image',
  'video'
]
hiddenControls.forEach((key) => {
  argTypes[key] = {
    table: {
      disable: true
    }
  }
})

// export const decorators = [
//   (story) =>
//     `<div class="page-wrapper" style="background: transparent; min-height:unset;">${story()}</div>`
// ]
