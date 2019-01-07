(function () {
  'use strict';

  chrome.runtime.onMessage.addListener(function(request) {
    console.log(request);
  });
})();