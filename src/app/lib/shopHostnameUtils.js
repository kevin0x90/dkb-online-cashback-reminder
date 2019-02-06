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

function shopHostnameMatch(targetHostname) {
  return shop => targetHostname.indexOf(shop.hostname) !== -1;
}

export function shopNameToHostname(shopName) {
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

export function findActiveShop(shops, hostname) {
  const hostnameLengthDiff = (shopHostname) => Math.abs(shopHostname.length - hostname.length);

  const sortedShops = shops
    .filter(shopHostnameMatch(hostname))
    .sort((shopA, shopB) => hostnameLengthDiff(shopA.hostname) - hostnameLengthDiff(shopB.hostname));

  if (sortedShops.length === 0) {
    return undefined;
  }

  return sortedShops[0];
}