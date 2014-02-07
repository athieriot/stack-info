'use strict';

var checkReputationHistory = function() {
  callStackApi('/users/{user_id}/reputation', function(result) {

    chrome.storage.sync.set({'latestReputationChange': result.items[0]});
  });
};

var checkReputation = function() {
  callStackApi('/users/{user_id}', function(result) {

    chrome.browserAction.setBadgeText({text: result.items[0].reputation.toString()});
    chrome.browserAction.setBadgeBackgroundColor({color: NORMAL_COLOR});
    chrome.browserAction.setTitle({title: chrome.runtime.getManifest().name});

    chrome.storage.sync.set({'user': result.items[0]});
    checkReputationHistory();
  });
};

var prepareNewReputation = function(entry) {
    var text = entry < 0 ? "- " + (entry * -1).toString() : "+ " + entry.toString();
    var color = entry < 0 ? BAD_COLOR : OK_COLOR;

    return {text: text, color: color};
};

var reputationUpdate = function(change) {
  if (change.oldValue.on_date !== change.newValue.on_date) {
    var reput = prepareNewReputation(change.newValue.reputation_change);

    chrome.browserAction.setBadgeText({text: reput.text});
    chrome.browserAction.setBadgeBackgroundColor({color: reput.color});
    chrome.browserAction.setTitle({title: chrome.runtime.getManifest().name});
  }
};

chrome.runtime.onInstalled.addListener(function () {
  chrome.alarms.create('stackRefresh', {
    'when': Date.now() + 500,
    'periodInMinutes': PERIOD_IN_MINUTES
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
    } else if (key === USER_ID_KEY) {
      checkReputation();
    }
  }
});

chrome.runtime.onMessage.addListener(function(message) {
  checkReputation();
});
