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
    return tableRowDomNode.querySelector('h3').innerText.trim();
  }

  function nodeToStoreObject(tableRowDomNode) {
    const shopName = getShopNameFromTableRowDomNode(tableRowDomNode);
    const discountInfo = getDiscountInfoFromTableRowDomNode(tableRowDomNode);

    return {
      shopName: shopName,
      discountInfo: discountInfo,
      hostname: shopNameToHostname(shopName)
    };
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
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({cashbackShops: shopInfos}, function() {
        console.log("Store shop infos");
        return resolve(shopInfos);
      });
    });
  }

  function shopNameToHostname(shopName) {
    return shopName.toLowerCase().replace(/\s/g, '-').replace("'", '-');
  }

  function getShopPageChangeConditions() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get('cashbackShops', storeValue => {

        if (storeValue.cashbackShops === undefined) {
          return reject('no stored cashback shops');
        }

        const rules = storeValue.cashbackShops.map(shop => {
          return new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostContains: shop.hostname },
          });
        });

        return resolve(rules);
      });
    });
  }

  function setupDeclarativeContentRules() {
    getShopPageChangeConditions().then(conditions => {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: conditions,
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });
  }

  chrome.runtime.onInstalled.addListener(function() {
    loadCashbackInformation()
    .then(storeShopInfos)
    .then(() => {
      chrome.declarativeContent.onPageChanged.removeRules(undefined, setupDeclarativeContentRules);
    });
  });

  chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.action === 'newDkbCashbackFilterTab') {
      chrome.tabs.create({ url: request.url}, tab => {
        chrome.tabs.executeScript(tab.id, { file: "dkb-content/content.js" }, function() {
          chrome.tabs.sendMessage(tab.id, request);
        });
      });
    }
  });
})();