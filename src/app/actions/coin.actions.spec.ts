import {
  addCoin, getCoinsCollection, getCoinsCollectionFailure, getCoinsCollectionSuccess, sellCoin, sellCoinFailure,
} from './coin.actions';
import { Coin } from '../models/Coin';

describe('coin actions', () => {
  const coin = new Coin('Euro', 'Description', 'Italy', 2002, 1, 3);

  it('creates an add action with the original coin', () => {
    expect(addCoin({ coin })).toEqual({ type: addCoin.type, coin });
  });

  it('creates a sell action for a coin id', () => {
    expect(sellCoin({ coinId: 'abc' })).toEqual({ type: sellCoin.type, coinId: 'abc' });
  });

  it('creates a sell failure action with the error', () => {
    expect(sellCoinFailure({ error: 'sell failed' })).toEqual({ type: sellCoinFailure.type, error: 'sell failed' });
  });

  it('creates a collection request without payload', () => {
    expect(getCoinsCollection()).toEqual({ type: getCoinsCollection.type });
  });

  it('creates success and failure actions with their payloads', () => {
    expect(getCoinsCollectionSuccess({ coinsCollections: [coin] })).toEqual({
      type: getCoinsCollectionSuccess.type, coinsCollections: [coin],
    });
    expect(getCoinsCollectionFailure({ error: 'offline' })).toEqual({
      type: getCoinsCollectionFailure.type, error: 'offline',
    });
  });
});
