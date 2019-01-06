(function () {
  'use strict';

  function transformToDomElement(htmlString) {
    return new DOMParser().parseFromString(htmlString, 'text/html');
  }

  function getDiscountInfoFromTableRowDomNode(tableRowDomNode) {
    const discountNodeText = tableRowDomNode.querySelector('td:nth-child(3)>span').innerText;
    
    return discountNodeText.replace(/ /g, '')
      .replace(/\s/g, ' ')
      .trim();
  }

  function getShopNameFromTableRowDomNode(tableRowDomNode) {
    return tableRowDomNode.querySelector('h3').innerHTML;
  }

  function nodeToStoreObject(tableRowDomNode) {
    const shopName = getShopNameFromTableRowDomNode(tableRowDomNode);
    const discountInfo = getDiscountInfoFromTableRowDomNode(tableRowDomNode);

    return {
      shopName: shopName,
      discountInfo: discountInfo
    }
  }

  function extractShopInformation(shopListDom) {
    const rowNodes = shopListDom.getElementsByClassName('mainRow');

    return Array.from(rowNodes).map(nodeToStoreObject);
  }

  function loadCashbackInformation() {
    const CASHBACK_URL = 'https://www.dkb.de/Welcome/content/CmsDetail/Card4YouShops.xhtml' + 
      '?$event=gotoPage' +
      '&category=0' +
      '&sort=0' +
      '&pageSize=300' +
      '&page=1' +
      '&%24display.type=single-part';  

    const getOptions = {
      origin: null,
      credentials: 'include',
      headers: {
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'accept-language':'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7',
        'x-requested-with': 'XMLHttpRequest',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Methods': 'GET'
      },
      referrer: 'https://www.dkb.de/banking/plus/online-cashback/',
      referrerPolicy: 'no-referrer-when-downgrade',    
      method: 'GET', 
      mode: 'cors'
    };

    return fetch('https://www.dkb.de/banking/plus/online-cashback/', getOptions)
    .then(() => fetch(CASHBACK_URL, getOptions))
    .then(res => res.text())
    .then(transformToDomElement)
    .then(extractShopInformation);
  }

  function storeShopInfos(shopInfos) {
    chrome.storage.local.set({cashbackShops: shopInfos}, function() {
      console.log("Store shop infos");
    });
  }

  function shopNameToHostName(shopName) {
    return shopName.toLowerCase();
  }

  function getShopPageChangeConditions() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get('cashbackShops', storeValue => {
        const rules = storeValue.cashbackShops.map(shop => {
          return new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostContains: shopNameToHostName(shop.shopName) },
          });
        });

        resolve(rules);
      });
    });
  }

  chrome.runtime.onInstalled.addListener(function() {
    loadCashbackInformation()
    .then(storeShopInfos);
  });

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    getShopPageChangeConditions().then(conditions => {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: conditions,
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });
  });
})();