import autoprefixer from 'autoprefixer'
import inlineSvg from 'postcss-inline-svg'

export default {
  plugins: [
    inlineSvg({
      paths: [
        'node_modules/@fortawesome/fontawesome-free/svgs/',
        'node_modules',
        'images'
      ]
    }),
    autoprefixer
  ]
}
