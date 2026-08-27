import { Coin } from '../models/Coin';
import { InMemoryCoinRepository } from './in-memory-coin.repository';

describe('InMemoryCoinRepository', () => {
  let repository: InMemoryCoinRepository;

  beforeEach(() => {
    repository = new InMemoryCoinRepository();
    jest.useFakeTimers();
  });

  afterEach(() => jest.useRealTimers());

  it('emits the initial collection after one second', () => {
    const received: Coin[][] = [];
    repository.getCoinCollection().subscribe((coins) => received.push(coins));

    jest.advanceTimersByTime(999);
    expect(received).toEqual([]);

    jest.advanceTimersByTime(1);
    expect(received).toHaveLength(1);
    expect(received[0]).toHaveLength(10);
  });

  it('returns collection records with the expected essential fields', () => {
    let collection: Coin[] = [];
    repository.getCoinCollection().subscribe((coins) => (collection = coins));
    jest.advanceTimersByTime(1000);

    expect(collection[0]).toMatchObject({ name: '1 Euro Cent', country: 'Italy', year: 2002 });
    expect(collection.at(-1)).toMatchObject({ name: 'Rare National Coin', country: 'San Marino' });
  });

  it('gives independent delayed emissions to multiple subscribers', () => {
    const first: Coin[][] = [];
    const second: Coin[][] = [];
    const collection$ = repository.getCoinCollection();
    collection$.subscribe((coins) => first.push(coins));
    collection$.subscribe((coins) => second.push(coins));

    jest.advanceTimersByTime(1000);
    expect(first).toHaveLength(1);
    expect(second).toHaveLength(1);
    expect(first[0]).toEqual(second[0]);
  });
});
