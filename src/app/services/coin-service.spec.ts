import { Coin } from '../models/Coin';
import { CoinService } from './coin-service';

describe('CoinService', () => {
  let service: CoinService;

  beforeEach(() => {
    service = new CoinService();
    jest.useFakeTimers();
  });

  afterEach(() => jest.useRealTimers());

  it('emits the initial collection after one second', () => {
    const received: Coin[][] = [];
    service.getCoinCollection().subscribe((coins) => received.push(coins));

    jest.advanceTimersByTime(999);
    expect(received).toEqual([]);

    jest.advanceTimersByTime(1);
    expect(received).toHaveLength(1);
    expect(received[0]).toHaveLength(10);
  });

  it('returns collection records with the expected essential fields', () => {
    let collection: Coin[] = [];
    service.getCoinCollection().subscribe((coins) => (collection = coins));
    jest.advanceTimersByTime(1000);

    expect(collection[0]).toMatchObject({ name: '1 Euro Cent', country: 'Italy', year: 2002 });
    expect(collection.at(-1)).toMatchObject({ name: 'Rare National Coin', country: 'San Marino' });
  });

  it('gives independent delayed emissions to multiple subscribers', () => {
    const first: Coin[][] = [];
    const second: Coin[][] = [];
    const collection$ = service.getCoinCollection();
    collection$.subscribe((coins) => first.push(coins));
    collection$.subscribe((coins) => second.push(coins));

    jest.advanceTimersByTime(1000);
    expect(first).toHaveLength(1);
    expect(second).toHaveLength(1);
    expect(first[0]).toEqual(second[0]);
  });
});
