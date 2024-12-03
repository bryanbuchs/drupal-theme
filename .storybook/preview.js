// global styles
// import '../components/global/global.library.js'
// import '../components/global-layout/global-layout.library.js'
// import '../components/global-typography/global-typography.library.js'
// import '../components/global-themes/global-themes.library.js'
// import '../components/button/button.library.js'
// import '../components/more/more.library.js'

// not truly "global", but library imported by all paragraphs using a theme hook
// import '../components/paragraph-paragraph/paragraph-paragraph.library.js'
// import "../components/paragraph-headings/paragraph-headings.library.js"

// storybook preview
import './gin-variables.css'
import './prevent-default.js'
import './preview.less'

// hide controls for specific arg names that are (a) other components or (b) complex arrays/objects that should not be editable
const hiddenControls = [
  'attributes',
  'anchor',
  'media',
  'config',
  'table',
  'rows',
  'cards',
  'menu',
  'image',
  'video',
  'pager'
]

const argTypes = {}
hiddenControls.forEach(key => {
  argTypes[key] = {
    table: {
      disable: true
    }
  }
})

const parameters = {
  options: {
    storySort: {
      order: [
        'README',
        'Global',
        'Element',
        'Entity',
        'Media',
        'Paragraph',
        'Node',
        'Nav',
        'Block',
        'Region',
        'View',
        'Drupal'
      ]
    }
  },

  backgrounds: {
    default: 'white',
    values: [
      { name: 'white', value: '#ffffff' },
      // { name: 'theme-olive', value: '#707c36' },
      // { name: 'theme-plum', value: '#620059' },
      // { name: 'theme-lagunita', value: '#007c92' },
      // { name: 'paragraph-shaded', value: '#f4f4f4' },
      // { name: 'stone-light-75', value: '#dfdddd' },
      // { name: 'region-footer', value: '#2e2d29' },
      // { name: 'cardinal-red', value: '#8c1515' }
    ]
  },

  controls: { disableSaveFromUI: true, sort: 'none' }
}

const decorators = [
  story =>
    `<div class="page-wrapper" style="background: transparent; min-height:unset;"><div>${story()}</div></div>`
]

export default {
  parameters,
  decorators,
  argTypes
}
