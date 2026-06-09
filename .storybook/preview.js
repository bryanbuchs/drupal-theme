// global styles
import.meta.glob('../tokens/css/*.css', { eager: true })
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
import './prevent-default.js'
import './active-trail.js'

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
  controls: {
    hideNoControlsWarning: true,
    disableSaveFromUI: true,
    sort: 'none'
  },
  backgrounds: {
    options: {
      white: { name: 'white', value: '#ffffff' },
      dark: { name: 'dark', value: '#2e2d29' },
      light: { name: 'light', value: '#f9fafb' }
    }
  }
}

const decorators = [
  story =>
    `<div class="page-wrapper" style="background: transparent; min-height:unset;"><div>${story()}</div></div>`
]

export default {
  parameters,
  decorators,
  argTypes,

  initialGlobals: {
    backgrounds: {
      value: 'white'
    }
  }
}
