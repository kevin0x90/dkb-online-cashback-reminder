(function () {
  'use strict';

  const SHOP_HOSTNAME_LOOKUP = {
    'shop der deutschen post': 'shop.deutschepost',
    'about you': 'aboutyou',
    babywalz: 'baby-walz',
    'reichelt elektronik.de': 'reichelt',
    'mister spex': 'misterspex',
    'sanicare - die versandapotheke': 'sanicare',
    'toys r us': 'toysrus',
    'elv elektronik': 'elv',
    'lego shop deutschland': 'shop.lego',
    'hotel de': 'hotel',
    'a.t.u auto-teile-unger': 'atu',
    'nike store': 'nike',
    'o2 germany': 'o2online',
    'floraprima blumenversand': 'floraprima',
    'apo-discounter.de': 'apodiscounter',
    'erwin müller': 'erwinmueller',
    'spiele max': 'spielemax.de',
    'depot online-shop': 'depot-online',
    'babor cosmetics': 'babor',
    'rewe lieferservice': 'shop.rewe',
    'outletcity metzingen online shop': 'outletcity',
    'peter hahn': 'peterhahn',
    'l\'occitane': 'loccitane',
    'reno - die behalte ich gleich an!': 'reno',
    'van graaf': 'vangraaf',
    'bofrost*': 'bofrost',
    'fleurop blumenversand': 'fleurop',
    'neckermann macht´s möglich! - möbel, heimtextilien': 'neckermann',
    'lands\' end': 'landsend',
    'the body shop': 'thebodyshop',
    'takko fashion': 'takko',
    'netto marken-discount': 'netto-online',
    'alba moda': 'albamoda',
    'best western': 'bestwestern',
    'adler moden': 'adlermode',
    bettwarenshop: 'bettwaren-shop',
    'ted baker': 'tedbaker',
    southbag: 'schulranzen-onlineshop',
    'allyouneed fresh': 'allyouneedfresh',
    'versandhaus wenz': 'wenz',
    'ctshirts.com - charles tyrwhitt': 'ctshirts',
    'i´m walking': 'imwalking',
    'house of gerry weber': 'house-of-gerryweber',
    'runners point': 'runnerspoint',
    'microsoft store': 'microsoft',
    'villeroy & boch': 'villeroy-boch',
    'fc schalke 04': 'schalke04',
    'casper matratze': 'casper',
    disneystore: 'shopdisney',
    'camp david & soccx': 'campdavid-soccx',
    'g data software ag': 'gdatasoftware',
    'hellweg - die profi-baumärkte': 'hellweg',
    'kaspersky lab': 'kaspersky',
    miamoda: 'mia-moda',
    'hertha bsc': 'herthabsc',
    'alba berlin': 'albaberlin',
    'eisbären berlin': 'eisbaeren',
    'füchse berlin': 'fuechse',
    'sc dhfk leipzig': 'scdhfk-handball',
    'sc magdeburg': 'scm-handball',
    'handball wm 2019': 'handball19',
    'frischauf! göppingen': 'frischauf-gp',
    'hunkemöller': 'hunkemoller'
  };

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

        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }

        return resolve(shopInfos);
      });
    });
  }

  function shopNameToHostname(shopName) {    
    const normalizedShopName = shopName.toLowerCase();
    const hostname = SHOP_HOSTNAME_LOOKUP[normalizedShopName];

    if (hostname) {
      return hostname;
    }

    return normalizedShopName
      .replace('&', ' and ')
      .replace(/\s/g, '-')
      .replace('\'', '-')
      .replace('ö', 'oe')
      .replace('ä', 'ae')
      .replace('ü', 'ue');
  }

  function getCashbackShopsFromStore() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get('cashbackShops', storeValue => {
        if (storeValue.cashbackShops === undefined) {
          return reject('no stored cashback shops');
        }

        return resolve(storeValue.cashbackShops);
      });
    });
  }

  function mapShopsToPageUrlMatcher(shops) {
    return shops.map(shop => new chrome.declarativeContent.PageStateMatcher({
      pageUrl: { hostContains: shop.hostname },
    }));
  }

  function getShopPageChangeConditions() {
    return getCashbackShopsFromStore()
      .then(mapShopsToPageUrlMatcher);
  }

  function setupDeclarativeContentRules() {
    getShopPageChangeConditions().then(conditions => {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: conditions,
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });
  }

  function synchWithCashbackInformation() {
    return loadCashbackInformation()
      .then(storeShopInfos)
      .then(() => {
        chrome.declarativeContent.onPageChanged.removeRules(undefined, setupDeclarativeContentRules);
      });
  }

  chrome.runtime.onInstalled.addListener(synchWithCashbackInformation);
  chrome.runtime.onStartup.addListener(synchWithCashbackInformation);

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'newDkbCashbackFilterTab') {
      chrome.tabs.create({ url: request.url}, tab => {
        chrome.tabs.executeScript(tab.id, { file: 'dkb-content/content.js' }, function() {
          chrome.tabs.sendMessage(tab.id, request);
        });
      });
    } else if (request.action === 'getAvailableShops') {
      getCashbackShopsFromStore()
        .then(shops => {
          sendResponse({ shops: shops });
        });

      return true;
    }
  });
})();