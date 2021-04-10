import dkbCashbackResponse from '../mockData/responses/dkbCashbackInfoResponse';
import loadCashbackInformation from 'dkbCashbackInformationLoader';

describe('dkb cashback information loader', () => {
  beforeEach(() => {
    // Fix jsdom innerText
    Object.defineProperty(window.Element.prototype, 'innerText', {
      get() {
        return this.textContent;
      },
    });

    window.fetch = jest.fn();
  });

  it('should fetch a list of shop information from DKB cashback page', () => {
    fetch.mockImplementation(() =>
      Promise.resolve({
        text: () => Promise.resolve(dkbCashbackResponse),
      })
    );

    return loadCashbackInformation().then((shopInformation) => {
      expect(shopInformation).toEqual([
        {
          shopName: 'Booking.com',
          discountInfo: '2,5% Cashback',
          hostname: 'booking.com',
        },
      ]);
    });
  });
});
