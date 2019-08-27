import { shopNameToHostname, findActiveShop } from 'shopHostnameUtils';

describe('Provides utility methods to get the hostname from a shop name and the other way around', () => {
  it.each`
    shopName                   | expectedHostname
    ${'about you'}             | ${'aboutyou'}
    ${'mein koffer'}           | ${'mein-koffer'}
    ${'more & more'}           | ${'more-and-more'}
    ${'lufthansa'}             | ${'lufthansa'}
    ${'lego shop deutschland'} | ${'lego'}
    ${'boden'}                 | ${'bodendirect'}
    ${'c&a'}                   | ${'c-and-a'}
    ${'smyths toys'}           | ${'smythstoys'}
    ${'ernsting\'s family'}     | ${'ernstings-family'}
    ${'dänisches bettenlager'} | ${'daenischesbettenlager'}
    ${'happy socks'}           | ${'happysocks'}
    ${'house of gerry weber'}  | ${'gerryweber'}
    ${'little lunch'}          | ${'littlelunch'}
    ${'tui cruises'}           | ${'tuicruises'}
    ${'heide park resort'}     | ${'heide-park'}
    ${'br volleys'}            | ${'berlin-recycling-volleys'}
    ${'douglas/'}              | ${'douglas'}
  `(
  'should correctly resolve a shop name $shopName to hostname $expectedHostname',
  ({ shopName, expectedHostname }) => {
    const hostname = shopNameToHostname(shopName);

    expect(hostname).toEqual(expectedHostname);
  }
);

  it.each`
    hostname          | expectedShop
    ${'my-test-shop'} | ${{ shopName: 'my test shop', hostname: 'my-test-shop' }}
    ${'unknown'}      | ${undefined}
    ${'shop.olympus'} | ${undefined}
    ${'olymp'}        | ${{ shopName: 'olymp', hostname: 'olymp' }}
  `(
  'should find the shop $expectedShop to a hostname $hostname',
  ({ hostname, expectedShop }) => {
    const shops = [
      {
        shopName: 'my test shop',
        hostname: 'my-test-shop',
      },
      {
        shopName: 'my awesome test shop',
        hostname: 'my-test',
      },
      {
        shopName: 'unknown shop',
        hostname: 'unknown-shop',
      },
      {
        shopName: 'olymp',
        hostname: 'olymp',
      },
    ];

    const activeShop = findActiveShop(shops, hostname);

    expect(activeShop).toEqual(expectedShop);
  }
);
});
