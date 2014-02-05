/*jshint camelcase: false*/

'use strict';

/* TODO:
 *
 * - Authentication
 * - Use Q to chain API calls
 * - Negative reputation should be Red
 * - Store the User object in the Storage. Keep doing calls in the background
 * - Using unread notifications
 * - Open links in tabs
 * - Organise the code
 * - Use a REST framework
 * - Display in "k"
 */

var STACK_API = 'https://api.stackexchange.com/2.1';
var PERIOD_IN_MINUTES = 10;

var NORMAL_COLOR = '#FFA217';
var OK_COLOR = '#389D3C';
var ERROR_COLOR = '#7C7C7B';

var REPUTATION_KEY = 'latestReputationChange';
var USER_ID_KEY = 'user_id';

var handleError = function(error) {
    chrome.browserAction.setBadgeText({text: '?'});
    chrome.browserAction.setBadgeBackgroundColor({color: ERROR_COLOR});
    chrome.browserAction.setTitle({title: error});
};

var callStackApi = function(path, callback) {
  chrome.storage.sync.get(USER_ID_KEY, function(result) {

    if (!chrome.runtime.lastError && result) {
      var xhr = new XMLHttpRequest();
      var url = STACK_API + path.replace('{user_id}', result[USER_ID_KEY]) + '?site=stackoverflow';

      xhr.open('GET', url, true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {

          if (xhr.status.toString().indexOf("2") === 0) {
            callback(JSON.parse(xhr.responseText));
          } else {
            var error = xhr.responseText ? JSON.parse(xhr.responseText).error_message : xhr.statusText;
            handleError(error);
          }
        }
      };
      xhr.send();
    } else {
      handleError('Please provide your StackExchange ID');
    }
  });
};
