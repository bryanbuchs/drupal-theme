// import autoprefixer from 'autoprefixer'
import inlineSvg from 'postcss-inline-svg'
import postcssPresetEnv from 'postcss-preset-env'
import postcssUtopia from 'postcss-utopia'

export default {
  plugins: [
    inlineSvg({
      paths: [
        'node_modules/@fortawesome/fontawesome-free/svgs/',
        'node_modules',
        'images'
      ]
    }),
    postcssPresetEnv(),
    postcssUtopia({
      minWidth: 428,
      maxWidth: 1024,
      minSize: 16,
      maxSize: 18
    })
  ]
}
