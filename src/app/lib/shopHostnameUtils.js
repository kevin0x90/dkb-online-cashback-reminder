import escapeStringRegExp from 'escape-string-regexp';

const SHOP_HOSTNAME_LOOKUP = {
  'shop der deutschen post': 'shop.deutschepost',
  'about you': 'aboutyou',
  babywalz: 'baby-walz',
  'reichelt elektronik.de': 'reichelt',
  'mister spex': 'misterspex',
  'sanicare - die versandapotheke': 'sanicare',
  'toys r us': 'toysrus',
  'elv elektronik': 'elv',
  'lego shop deutschland': 'lego',
  'hotel de': 'hotel',
  'a.t.u auto-teile-unger': 'atu',
  'nike store': 'nike',
  'o2 germany': 'o2online',
  'floraprima blumenversand': 'floraprima',
  'apo-discounter.de': 'apodiscounter',
  'erwin m\xfcller': 'erwinmueller',
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
  'neckermann macht\xB4s m\xf6glich! - m\xf6bel, heimtextilien': 'neckermann',
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
  'i\xB4m walking': 'imwalking',
  'runners point': 'runnerspoint',
  'microsoft store': 'microsoft',
  'villeroy & boch': 'villeroy-boch',
  'fc schalke 04': 'schalke04',
  'casper matratze': 'casper',
  disneystore: 'shopdisney',
  'camp david & soccx': 'campdavid-soccx',
  'g data software ag': 'gdatasoftware',
  'hellweg - die profi-baum\xe4rkte': 'hellweg',
  'kaspersky lab': 'kaspersky',
  miamoda: 'mia-moda',
  'hertha bsc': 'herthabsc',
  'alba berlin': 'albaberlin',
  'eisb\xe4ren berlin': 'eisbaeren',
  'f\xfcchse berlin': 'fuechse',
  'sc dhfk leipzig': 'scdhfk-handball',
  'sc magdeburg': 'scm-handball',
  'handball wm 2019': 'handball19',
  'frischauf! g\xf6ppingen': 'frischauf-gp',
  'hunkemöller': 'hunkemoller',
  'jack wolfskin outdoor': 'jack-wolfskin',
  'karstadt sports': 'karstadtsports',
  's.oliver': 'soliver',
  boden: 'bodendirect',
  'c&a': 'c-and-a',
  'smyths toys': 'smythstoys',
  'ernsting\'s family': 'ernstings-family',
  'dänisches bettenlager': 'daenischesbettenlager',
  'happy socks': 'happysocks',
  'house of gerry weber': 'gerryweber',
  'little lunch': 'littlelunch',
  'tui cruises': 'tuicruises',
  'heide park resort': 'heide-park',
  'br volleys': 'berlin-recycling-volleys',
  'tvb 1898 stuttgart': 'tvbstuttgart',
  'douglas/': 'douglas',
};

function shopHostnameMatch(targetHostname) {
  return shop => {
    const escapedShopHostname = escapeStringRegExp(shop.hostname);
    const shopHostnameMatcher = new RegExp(`\\b${escapedShopHostname}\\b`);

    return shopHostnameMatcher.test(targetHostname);
  };
}

export function shopNameToHostname(shopName) {
  const normalizedShopName = shopName.toLowerCase();
  const hostname = SHOP_HOSTNAME_LOOKUP[normalizedShopName];

  if (hostname) {
    return hostname;
  }

  return normalizedShopName
    .replace('&', 'and')
    .replace(/\s/g, '-')
    .replace('\'', '-')
    .replace('\xf6', 'oe')
    .replace('\xe4', 'ae')
    .replace('\xfc', 'ue');
}

export function findActiveShop(shops, hostname) {
  const hostnameLengthDiff = shopHostname =>
    Math.abs(shopHostname.length - hostname.length);

  const sortedShops = shops
    .filter(shopHostnameMatch(hostname))
    .sort(
      (shopA, shopB) =>
        hostnameLengthDiff(shopA.hostname) - hostnameLengthDiff(shopB.hostname)
    );

  if (sortedShops.length === 0) {
    return undefined;
  }

  return sortedShops[0];
}
