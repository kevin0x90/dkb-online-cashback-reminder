import { shopNameToHostname } from './shopHostnameUtils';

function transformToDomElement(htmlString) {
  return new DOMParser().parseFromString(htmlString, 'text/html');
}

function getShopNameFromTableRowDomNode(tableRowDomNode) {
  return tableRowDomNode.querySelector('h3').innerText.trim();
}

function getDiscountInfoFromTableRowDomNode(tableRowDomNode) {
  const discountNodeText = tableRowDomNode.querySelector('td:nth-child(3)>span')
    .innerText;

  return discountNodeText.replace(/ /g, '').replace(/\s/g, ' ').trim();
}

function nodeToStoreObject(tableRowDomNode) {
  const shopName = getShopNameFromTableRowDomNode(tableRowDomNode);
  const discountInfo = getDiscountInfoFromTableRowDomNode(tableRowDomNode);

  return {
    shopName: shopName,
    discountInfo: discountInfo,
    hostname: shopNameToHostname(shopName),
  };
}

function extractShopInformation(shopListDom) {
  const rowNodes = shopListDom.getElementsByClassName('mainRow');

  return Array.from(rowNodes).map(nodeToStoreObject);
}

function loadCashbackInformation() {
  const CASHBACK_URL =
    'https://www.dkb.de/Welcome/content/CmsDetail/Card4YouShops.xhtml' +
    '?$event=gotoPage' +
    '&category=0' +
    '&sort=0' +
    '&pageSize=300' +
    '&page=1' +
    '&%24display.type=single-part';

  const getOptions = {
    origin: 'https://www.dkb.de/',
    credentials: 'include',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'accept-language': 'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Methods': 'GET',
    },
    referrer: 'https://www.dkb.de/banking/plus/online-cashback/',
    referrerPolicy: 'no-referrer-when-downgrade',
    method: 'GET',
    mode: 'cors',
  };

  return fetch('https://www.dkb.de/banking/plus/online-cashback/', getOptions)
    .then((res) => res.text())
    .then(() => fetch(CASHBACK_URL, getOptions))
    .then((res) => res.text())
    .then(transformToDomElement)
    .then(extractShopInformation);
}

export default loadCashbackInformation;
