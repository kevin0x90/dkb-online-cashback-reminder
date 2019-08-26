import { shopNameToHostname, findActiveShop } from 'shopHostnameUtils';

describe('Provides utility methods to get the hostname from a shop name and the other way around', () => {
  it.each`
    shopName          | expectedHostname
    ${'about you'}    | ${'aboutyou'}
    ${'mein koffer'}  | ${'mein-koffer'}
    ${'more & more'}  | ${'more-and-more'}
  `('should correctly resolve a shop name $shopName to hostname $hostname',
  ({shopName, expectedHostname}) => {
    const hostname = shopNameToHostname(shopName);

    expect(hostname).toEqual(expectedHostname);
  });

  it.each`
    hostname          | expectedShop
    ${'my-test-shop'} | ${{ shopName: 'my test shop', hostname: 'my-test-shop'}}
    ${'unknown'}      | ${undefined}
    ${'shop.olympus'} | ${undefined}
    ${'olymp'}        | ${{ shopName: 'olymp', hostname: 'olymp'}}
  `('should find the shop $expectedShop to a hostname $hostname',
  ({hostname, expectedShop}) => {
    const shops = [
      {
        shopName: 'my test shop',
        hostname: 'my-test-shop'
      },
      {
        shopName: 'my awesome test shop',
        hostname: 'my-test'
      },
      {
        shopName: 'unknown shop',
        hostname: 'unknown-shop'
      },
      {
        shopName: 'olymp',
        hostname: 'olymp'
      }
    ];

    const activeShop = findActiveShop(shops, hostname);

    expect(activeShop).toEqual(expectedShop);
  });
});