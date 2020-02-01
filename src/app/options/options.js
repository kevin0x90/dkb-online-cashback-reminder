import ShopRepository from '../lib/shopRepository';

const shopRepository = new ShopRepository();

document.getElementById('headline').innerHTML = chrome.i18n.getMessage(
  'available_cashback_shops'
);

shopRepository.getShops().then(cashbackShops => {
  const list = document.getElementById('stored-cashbackshops');

  cashbackShops.forEach(shop => {
    const item = document.createElement('li');
    const content = document.createTextNode(shop.shopName);
    item.appendChild(content);
    list.appendChild(item);
  });
});
