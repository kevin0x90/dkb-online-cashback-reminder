(function () {
  'use strict';

  function shopHostnameMatch(targetHostname) {
    return shop => targetHostname.indexOf(shop.hostname) !== -1;
  }

  function getShopByHostname(hostname) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get('cashbackShops', storeValue => {
          const activeShop = storeValue.cashbackShops.find(shopHostnameMatch(hostname));

          if (activeShop === undefined) {
            return reject(`no shop found for hostname: ${hostname}`);
          } 
            
          return resolve(activeShop);
      });
    });
  }

  function getActiveTab() {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        if (tabs.length === 0) {
          return reject('no active tab available');
        }

        return resolve(tabs[0]);
      });
    });
  }

  function openLinkInTab(shop) {
    return function() {
      chrome.runtime.sendMessage({
        activeShop: shop,
        url: this.href
      });
    };
  }

  getActiveTab()
  .then(tab => new URL(tab.url))
  .then(url => getShopByHostname(url.hostname))
  .then(shop => {

    const shopNameNode = document.getElementById('shopName');
    const discountInfoNode = document.getElementById('discountInfo');
    const cashbackLinkNode = document.getElementById('gotoDkbCashback');

    shopNameNode.innerText = shop.shopName;
    discountInfoNode.innerText = shop.discountInfo;

    cashbackLinkNode.href = 'https://www.dkb.de/banking/plus/online-cashback';
    cashbackLinkNode.addEventListener('click', openLinkInTab(shop));

    console.log(shop);
  });
})();