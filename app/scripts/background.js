/*jshint camelcase: false*/
'use strict';

/* TODO:
 *
 * - Check if the API return an error
 * - Authentication
 * - Use Q to chain API calls
 */

var STACK_API = 'https://api.stackexchange.com/2.1';
var NORMAL_COLOR = '#FFA217';
var OK_COLOR = '#389D3C';
var REPUTATION_KEY = 'latestReputationChange';

var callStackApi = function(path, callback) {

  var xhr = new XMLHttpRequest();
  xhr.open('GET', STACK_API + path + '?site=stackoverflow', true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {

      callback(JSON.parse(xhr.responseText));
    }
  };
  xhr.send();
};

var checkReputationHistory = function() {
  callStackApi('/users/1204393/reputation', function(result) {

    chrome.storage.sync.set({'latestReputationChange': result.items[0]});
  });
};

var checkReputationHistory = function() {
  callStackApi('/users/1204393/reputation', function(result) {

    chrome.storage.sync.set({'latestReputationChange': result.items[0]});
  });
};

var checkReputation = function() {
  callStackApi('/users/1204393', function(result) {

    chrome.browserAction.setBadgeText({text: result.items[0].reputation.toString()});
    chrome.browserAction.setBadgeBackgroundColor({color: NORMAL_COLOR});

    checkReputationHistory();
  });
};

var reputationUpdate = function(change) {
  if (change.oldValue.on_date !== change.newValue.on_date) {
      
    chrome.browserAction.setBadgeText({text: '+ ' + change.newValue.reputation_change.toString()});
    chrome.browserAction.setBadgeBackgroundColor({color: OK_COLOR});
  }
};

chrome.runtime.onInstalled.addListener(function () {
  chrome.alarms.create('stackRefresh', {
    'when': Date.now() + 500,
    'periodInMinutes': 1
  });
});

chrome.alarms.onAlarm.addListener(function (alarm) {

  if (alarm && alarm.name === 'stackRefresh') {
    checkReputation();
  }
});

chrome.storage.onChanged.addListener(function(changes) {
  for (var key in changes) {
    if (key === REPUTATION_KEY) {
      reputationUpdate(changes[REPUTATION_KEY]);
    }
  }
});
