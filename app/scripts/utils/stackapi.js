'use strict';

define(['oboe', 'module'], function(Oboe, Module) {

  var STACK_URL = Module.config().stack_url;
  var CLIENT_KEY = Module.config().client_key;

  var me = function(token, callback) {
    Oboe(STACK_URL + '/me?site=stackoverflow&key=' + CLIENT_KEY +  '&access_token=' + token)
      .node('items.*.user_id', function(user_id) {
        callback(null, user_id); 
      })
      .fail(callback);
  };

  return {
    me: me
  }
});
