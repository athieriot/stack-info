require.config({
  baseUrl: 'scripts',
  paths: {
    bower: '../bower_components'
  },
  shim: {
    'bower/react/react': {
      exports: 'React'
    }
  }
});

require(['popup']);
