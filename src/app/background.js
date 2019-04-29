import loadDkbCashbackInformation from './lib/dkbCashbackInformationLoader';
import ShopRepository from './lib/shopRepository';

const shopRepository = new ShopRepository();

function mapShopsToPageUrlMatcher(shops) {
  return shops.map(shop => new chrome.declarativeContent.PageStateMatcher({
    pageUrl: { hostContains: shop.hostname },
  }));
}

function getShopPageChangeConditions() {
  return shopRepository.getShops()
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
  return loadDkbCashbackInformation()
    .then(shopRepository.saveShops)
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
    shopRepository.getShops()
      .then(shops => {
        sendResponse({ shops: shops });
      });

    return true;
  }
});