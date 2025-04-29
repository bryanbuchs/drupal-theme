// import autoprefixer from 'autoprefixer'
import inlineSvg from 'postcss-inline-svg'
import postcssPresetEnv from 'postcss-preset-env'

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
  ]
}
