export default {
  log: {
    verbosity: 'silent'
  },
  source: ['tokens/definitions/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'tokens/',
      files: [
        {
          destination: 'css/variables.css',
          format: 'css/variables'
        }
      ]
    },
    less: {
      transformGroup: 'less',
      buildPath: 'less/settings/',
      files: [
        {
          destination: 'variables.less',
          format: 'less/variables'
        }
      ]
    }
  }
}
