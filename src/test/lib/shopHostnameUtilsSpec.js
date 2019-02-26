import { shopNameToHostname } from 'shopHostnameUtils';

describe('Provides utility methods to get the hostname from a shop name and the other way around', () => {

  it('should correctly resolve a shop name to a hostname', () => {
    const shopName = 'about you';

    const hostname = shopNameToHostname(shopName);

    expect(hostname).toEqual('aboutyou');
  });
});