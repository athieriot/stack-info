/** @jsx React.DOM */

'use strict';

require.config({
  baseUrl: 'scripts',
  paths: {
    bower: '../bower_components',
    oboe: '../bower_components/oboe/dist/oboe-browser'
  },
  shim: {
    'bower/react/react': { exports: 'React' },
    'bower/oauth-js/oauth': { exports: 'OAuth' }
  },
  config: {
    'utils/stackapi': {
      stack_url: 'https://api.stackexchange.com/2.2',
      client_key: 'SmpXalcPaUzPh34LMibvWg(('
    }
  }
});

require(['components/askuser',
         'bower/react/react',
         'common'], function(AskUser, React) {

  React.renderComponent(
    <AskUser />,
    document.getElementById('main-content')
  );
});
