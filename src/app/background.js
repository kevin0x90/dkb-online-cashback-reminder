import loadDkbCashbackInformation from './lib/dkbCashbackInformationLoader';
import ShopRepository from './lib/shopRepository';
import escapeStringRegEx from 'escape-string-regexp';

const shopRepository = new ShopRepository();

function loadImageData(url) {
  return new Promise(resolve => {
    const canvas = document.body.appendChild(document.createElement('canvas'));
    const context = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      context.drawImage(img, 0, 0);
      const data = context.getImageData(0, 0, img.width, img.height);
      canvas.remove();
      resolve(data);
    };
    img.src = url;
  });
}

function mapShopsToPageUrlMatcher(shops) {
  return shops.map((shop) => {
    const regex = `\\b${escapeStringRegEx(shop.hostname)}\\b`;

    return new chrome.declarativeContent.PageStateMatcher({
      pageUrl: { originAndPathMatches: regex },
    });
  });
}

function getShopPageChangeConditions() {
  return shopRepository.getShops().then(mapShopsToPageUrlMatcher);
}

async function setupDeclarativeContentRules() {
  const activeIcon16 = await loadImageData('images/percentage16.png');
  const activeIcon32 = await loadImageData('images/percentage32.png');
  const activeIcon48 = await loadImageData('images/percentage48.png');
  const activeIcon128 = await loadImageData('images/percentage128.png');

  getShopPageChangeConditions().then((conditions) => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: conditions,
        actions: [
          new chrome.declarativeContent.ShowPageAction(),
          new chrome.declarativeContent.SetIcon({
            imageData: {
              16: activeIcon16,
              32: activeIcon32,
              48: activeIcon48,
              128: activeIcon128,
            },
          }),
        ],
      },
    ]);
  });
}

function synchWithCashbackInformation() {
  return loadDkbCashbackInformation()
    .then(shopRepository.saveShops)
    .then(() => {
      chrome.declarativeContent.onPageChanged.removeRules(
        undefined,
        setupDeclarativeContentRules
      );
    });
}

chrome.runtime.onInstalled.addListener(synchWithCashbackInformation);
chrome.runtime.onStartup.addListener(synchWithCashbackInformation);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'newDkbCashbackFilterTab') {
    chrome.tabs.create({ url: request.url }, (tab) => {
      chrome.tabs.executeScript(tab.id, { file: 'dkb-content/content.js' }, function () {
        chrome.tabs.sendMessage(tab.id, request);
      });
    });
  } else if (request.action === 'getAvailableShops') {
    shopRepository.getShops().then((shops) => {
      sendResponse({ shops: shops });
    });

    return true;
  }
});
