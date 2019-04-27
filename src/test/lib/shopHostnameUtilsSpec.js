import { shopNameToHostname, findActiveShop } from 'shopHostnameUtils';

describe('Provides utility methods to get the hostname from a shop name and the other way around', () => {
  it.each`
    shopName          | expectedHostname
    ${'about you'}    | ${'aboutyou'}
    ${'mein koffer'}  | ${'mein-koffer'}
  `('should correctly resolve a shop name $shopName to hostname $hostname', ({shopName, expectedHostname}) => {
    const hostname = shopNameToHostname(shopName);

    expect(hostname).toEqual(expectedHostname);
  });

  it.each`
    hostname          | expectedShop
    ${'my-test-shop'} | ${{ shopName: 'my test shop', hostname: 'my-test-shop'}}
    ${'unknown'}      | ${undefined}
  `('should find the shop $shop to a hostname $hostname', ({hostname, expectedShop}) => {
    const shops = [
      {
        shopName: 'my test shop',
        hostname: 'my-test-shop'
      },
      {
        shopName: 'unknown shop',
        hostname: 'unknown-shop'
      }
    ]

    const activeShop = findActiveShop(shops, hostname);

    expect(activeShop).toEqual(expectedShop);
  });
});