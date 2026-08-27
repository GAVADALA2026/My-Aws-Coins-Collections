import {
  addCoin, getCoinsCollection, getCoinsCollectionFailure, getCoinsCollectionSuccess, seelCoin,
} from './coin.actions';
import { Coin } from '../models/Coin';

describe('coin actions', () => {
  const coin = new Coin('Euro', 'Description', 'Italy', 2002, 1, 3);

  it('creates an add action with the original coin', () => {
    expect(addCoin({ coin })).toEqual({ type: addCoin.type, coin });
  });

  it.each([0, 4, -1])('creates a sell action for index %i', (coinIdx) => {
    expect(seelCoin({ coinIdx })).toEqual({ type: seelCoin.type, coinIdx });
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
