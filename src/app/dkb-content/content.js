(function () {
  'use strict';

  function filterCashbackList(request) {
    var searchButton = document.getElementById('cy4searchIcon');
    var searchField = document.getElementById('cy4searchField');

    searchField.value = request.activeShop.shopName;
    searchButton.click();
  }

  chrome.runtime.onMessage.addListener(function(request) {

    if (request.action === 'newDkbCashbackFilterTab') {
      filterCashbackList(request);
    }
  });
})();