import { findActiveShop } from '../lib/shopHostnameUtils';
import { getActiveTab } from '../lib/tabUtils';

function getShopByHostname(hostname) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        action: 'getAvailableShops',
      },
      response => {
        const activeShop = findActiveShop(response.shops, hostname);

        if (activeShop === undefined) {
          return reject(`no shop found for hostname: ${hostname}`);
        }

        return resolve(activeShop);
      }
    );
  });
}

function openLinkInTab(shop) {
  return function() {
    chrome.runtime.sendMessage({
      action: 'newDkbCashbackFilterTab',
      activeShop: shop,
      url: this.href,
    });
  };
}

function getUrl(tab) {
  const url = new URL(tab.url);
  const parameters = url.searchParams;

  // For testing purposes the active url parameter can override the current tab url
  if (parameters.has('active-url')) {
    return new URL(parameters.get('active-url'));
  }

  return url;
}

document.getElementById('gotoDkbCashback').innerHTML = chrome.i18n.getMessage(
  'goto_dkb_cashback_link_page'
);

getActiveTab()
  .then(getUrl)
  .then(url => getShopByHostname(url.hostname))
  .then(shop => {
    const shopNameNode = document.getElementById('shopName');
    const discountInfoNode = document.getElementById('discountInfo');
    const cashbackLinkNode = document.getElementById('gotoDkbCashback');

    shopNameNode.innerText = shop.shopName;
    discountInfoNode.innerText = shop.discountInfo;

    cashbackLinkNode.href = 'https://www.dkb.de/banking/plus/online-cashback';
    cashbackLinkNode.addEventListener('click', openLinkInTab(shop));
  });
