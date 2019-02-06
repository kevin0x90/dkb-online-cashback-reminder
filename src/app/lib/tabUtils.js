export function getActiveTab() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      if (tabs.length === 0) {
        return reject('no active tab available');
      }

      return resolve(tabs[0]);
    });
  });
}