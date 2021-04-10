import { getActiveTab } from 'tabUtils.js';

describe('tab utils', () => {
  beforeEach(() => {
    window.chrome = {
      tabs: {
        query: jest.fn(),
      },
    };
  });

  it('should return the current active tab', () => {
    chrome.tabs.query.mockImplementation((_, callback) => {
      callback([{}]);
    });

    return getActiveTab().then((activeTab) => {
      expect(activeTab).toEqual({});
    });
  });

  it('should return an error message when no active tab is found', () => {
    chrome.tabs.query.mockImplementation((_, callback) => {
      callback([]);
    });

    return getActiveTab().catch((errorMessage) => {
      expect(errorMessage).toEqual('no active tab available');
    });
  });
});
