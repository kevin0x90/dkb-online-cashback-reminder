import ShopRepository from 'shopRepository';

describe('allows retrieval and update of the persisted shops', () => {
  beforeEach(() => {
    window.chrome = {
      storage: {
        local: {
          get: jest.fn(),
          set: jest.fn(),
        },
      },
      runtime: {},
    };
  });

  it('should get the stored shops from local store', () => {
    window.chrome.storage.local.get.mockImplementation((_, callback) =>
      callback({ cashbackShops: [] })
    );

    const resultPromise = new ShopRepository().getShops();

    return expect(resultPromise).resolves.toEqual([]);
  });

  it('should reject with an error when no cashback shops are stored', () => {
    window.chrome.storage.local.get.mockImplementation((_, callback) =>
      callback({ cashbackShops: undefined })
    );

    const resultPromise = new ShopRepository().getShops();

    return expect(resultPromise).rejects.toEqual('no stored cashback shops');
  });

  it('should store shops and resolve with the saved shops', () => {
    window.chrome.storage.local.set.mockImplementation((_, callback) => callback());
    const shopsToSave = [
      {
        shopName: 'test-shop',
        discountInfo: '3% Rabatt',
        hostname: 'test-shop',
      },
    ];

    const resultPromise = new ShopRepository().saveShops(shopsToSave);

    return expect(resultPromise).resolves.toEqual(shopsToSave);
  });

  it('should reject with an error message when shops can not be stored', () => {
    window.chrome.storage.local.set.mockImplementation((_, callback) => callback());
    chrome.runtime.lastError = 'local store unavailable';

    const resultPromise = new ShopRepository().saveShops({});

    return expect(resultPromise).rejects.toEqual('local store unavailable');
  });
});
