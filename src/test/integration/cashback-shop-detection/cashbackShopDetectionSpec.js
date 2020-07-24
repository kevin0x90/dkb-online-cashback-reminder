import { Builder, By, until, Key } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
import { Timeouts } from 'selenium-webdriver/lib/capabilities';
import 'chromedriver';
import crypto from 'crypto';
import path from 'path';
import os from 'os';

// eslint-disable-next-line no-undef
const EXTENSION_PATH = path.normalize(
  __dirname + path.sep + '..' + path.sep + '..' + path.sep + '..' + path.sep + 'dist'
);
const EXTENSION_ID = calculateExtensionId(EXTENSION_PATH);
const SIXTY_MIN_TIMEOUT = 3600000;

jest.setTimeout(SIXTY_MIN_TIMEOUT);

// Implement the same algorithm chrome uses to calculate the extension id
function calculateExtensionId(extensionPath) {
  const mappingTable = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    '3': 'd',
    '4': 'e',
    '5': 'f',
    '6': 'g',
    '7': 'h',
    '8': 'i',
    '9': 'j',
    a: 'k',
    b: 'l',
    c: 'm',
    d: 'n',
    e: 'o',
    f: 'p',
  };

  const encoding = os.platform() === 'win32' ? 'ucs2' : 'utf8';

  const hash = crypto
    .createHash('sha256')
    .update(extensionPath, encoding)
    .digest('hex')
    .substring(0, 32)
    .toLowerCase();

  let result = '';
  for (let i = 0; i < hash.length; ++i) {
    result += mappingTable[hash[i]];
  }

  return result;
}

async function waitForElement(driver, selector, waitTime = 3000) {
  const waitResult = await driver.wait(until.elementLocated(selector), waitTime);

  // eslint-disable-next-line no-console
  console.log(`result waiting for selector ${selector}: ${waitResult}`);
  if (waitResult === 'timed-out') {
    throw new Error(`timeout while waiting for selector: ${selector}`);
  }

  return await driver.findElement(selector);
}

async function searchOnGoogleAndVisitFirstMatch(driver, searchTerm) {
  await driver.get('https://www.google.com');
  const searchInput = await waitForElement(driver, By.css('input[name="q"]'));
  await searchInput.sendKeys(searchTerm);
  await searchInput.sendKeys(Key.RETURN);

  const firstSearchResultLink = await waitForElement(
    driver,
    By.css('#search .rc .r a')
  );
  await firstSearchResultLink.click();
}

async function verifyFoundByExtension(driver, shopName) {
  // Workaround for sites because of their bad seo department
  if (shopName.toLowerCase().includes('neckermann')) {
    await driver.get('https://www.neckermann.de/');
  } else if (shopName.toLowerCase().includes('rewe')) {
    await driver.get('https://shop.rewe.de/');
  } else if (shopName.toLowerCase().includes('allyouneed fresh')) {
    await driver.get('http://www.allyouneedfresh.de/');
  } else if (shopName.toLowerCase().includes('blablabus')) {
    await driver.get('https://de.blablabus.com/');
  } else if (shopName.toLowerCase() === 'boden') {
    await driver.get('https://www.bodendirect.de/');
  } else {
    await searchOnGoogleAndVisitFirstMatch(driver, shopName);
  }

  const verified = await checkExtensionPopup(driver, shopName);

  return verified;
}

async function checkExtensionPopup(driver, shopName) {
  const currentUrl = await driver.getCurrentUrl();
  await driver.get(
    `chrome-extension://${EXTENSION_ID}/popup/popup.html?active-url=${currentUrl}`
  );

  // eslint-disable-next-line no-console
  console.log(`verify: ${shopName} with url ${currentUrl}`);
  await driver.sleep(1000);

  const shopNameLocator = By.css('#shopName');
  await driver.wait(until.elementLocated(shopNameLocator));
  const shopNameElement = await driver.findElement(shopNameLocator);
  const shopNameElementText = await shopNameElement.getText();
  const isEqual =
    shopNameElementText.trim().toLowerCase() == shopName.trim().toLowerCase();

  if (!isEqual) {
    // eslint-disable-next-line no-console
    console.log(`invalid: ${shopName.trim().toLowerCase()} with url ${currentUrl}`);
  }

  return isEqual;
}

async function setupGoogleSearchSettings(driver) {
  await driver.get('https://www.google.com/preferences?hl=en-DE&fg=1');

  // eslint-disable-next-line no-console
  console.log('Open regional settings');
  const regionShowMoreLink = await waitForElement(driver, By.id('regionanchormore'));
  await regionShowMoreLink.click();
  await driver.sleep(1000);

  // eslint-disable-next-line no-console
  console.log('Select Germany');
  const germanyRadioButton = await waitForElement(
    driver,
    By.css('.jfk-radiobutton[data-value="DE"][role="radio"]')
  );
  await germanyRadioButton.click();

  // eslint-disable-next-line no-console
  console.log('Save settings for session');
  const saveButton = await waitForElement(
    driver,
    By.css('.jfk-button.jfk-button-action')
  );
  await saveButton.click();

  await driver.sleep(5000);

  return await driver.sleep(1000);
}

async function setupDriver() {
  try {
    Timeouts.pageLoad = 10000;

    return await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(
        new Options()
          .addArguments('--no-sandbox')
          .addArguments('--start-maximized')
          .addArguments('--disable-gpu')
          .addArguments('--window-size=1024x768')
          .addArguments('--disable-dev-shm-usage')
          .addArguments(`--load-extension=${EXTENSION_PATH}`)
          .addArguments('--useAutomationExtension=false')
          .excludeSwitches('enable-automation')
      )
      .usingHttpAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 12_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) GSA/83.0.268992909 Mobile/15E148 Safari/605.1')
      .build();
  } catch (ex) {
    // eslint-disable-next-line no-console
    console.log(`Error during driver setup: ${ex}`);
    throw ex;
  }
}

async function retry(callback, count) {
  let result = null;
  for (let i = 0; i < count; ++i) {
    try {
      result = await callback();
      break;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(`error [${error}] going to retry ${i + 1} of ${count}`);
    }
  }

  return result;
}

async function collectAllShopnamesFromDkb(driver) {
  // eslint-disable-next-line no-console
  console.log('Start collection of shops from dkb shops 4 you');
  await searchOnGoogleAndVisitFirstMatch(driver, 'Das kann Bank | DKB AG');
  await driver.sleep(3000);
  await driver.get('https://www.dkb.de/Welcome/content/CmsDetail/Card4YouShops.xhtml?$event=gotoPage&category=0&sort=0&pageSize=300&page=1&%24display.type=single-part');
  await driver.sleep(4000);

  // eslint-disable-next-line no-console
  console.log('Collecting shops');
  const shopsTable = await waitForElement(driver, By.className('shops'), 6000);
  const allShopNameElementsOnPage = await shopsTable.findElements(By.css('.mainRow td h3'));

  // eslint-disable-next-line no-console
  console.log(`Found ${allShopNameElementsOnPage.length} shop elements`);
  const allShopNames = [];

  for (const shopNameElement of allShopNameElementsOnPage) {
    const shopName = await shopNameElement.getText();
    allShopNames.push(shopName);
  }

  return allShopNames;
}

describe('The installed extension detects cashbck shops correctly', () => {
  it('should correctly detect shops that are part of the dkb cashback program', async () => {
    expect.assertions(1);

    // eslint-disable-next-line no-console
    console.log('Starting chrome driver test');

    const driver = await setupDriver();

    await setupGoogleSearchSettings(driver);

    const failedShopNames = [];

    try {
      const allShopNames = await retry(async () => await collectAllShopnamesFromDkb(driver), 3);
      for (const shopName of allShopNames) {
        const isVerified = await verifyFoundByExtension(driver, shopName);

        if (!isVerified) {
          failedShopNames.push(shopName);
        }
      }
    } catch (ex) {
      // eslint-disable-next-line no-console
      console.log(ex);
    } finally {
      await driver.quit();
    }

    expect(failedShopNames).toEqual([]);
  });
});
