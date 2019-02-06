class ShopRepository {

  getShops() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get('cashbackShops', storeValue => {
        if (storeValue.cashbackShops === undefined) {
          return reject('no stored cashback shops');
        }

        return resolve(storeValue.cashbackShops);
      });
    });
  }

  saveShops(shopInfos) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({cashbackShops: shopInfos}, function() {

        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }

        return resolve(shopInfos);
      });
    });
  }
}

export default ShopRepository;