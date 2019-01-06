(function () {
  'use strict';

  chrome.storage.local.get('cashbackShops', storeValue => {
    const list = document.getElementById('stored-cashbackshops');
    storeValue.cashbackShops.forEach(shop => {
      const item = document.createElement('li');
      const content = document.createTextNode(shop.shopName);
      item.appendChild(content);
      list.appendChild(item);
    });
  });
})();