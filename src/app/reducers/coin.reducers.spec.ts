import {
  addCoin, getCoinsCollection, getCoinsCollectionFailure, getCoinsCollectionSuccess, sellCoin, sellCoinFailure,
} from '../actions/coin.actions';
import { Coin } from '../models/Coin';
import { coinReducer, CoinState, initialState } from './coin.reducers';

describe('coinReducer', () => {
  const coinA = new Coin('A', '', 'Italy', 2002, 1, 2);
  const coinB = new Coin('B', '', 'France', 2003, 2, 3);
  const loadedState: CoinState = { coins: [coinA, coinB], loading: false, error: 'previous error' };

  afterEach(() => jest.restoreAllMocks());

  it('returns the declared initial state for an unknown action', () => {
    expect(coinReducer(undefined, { type: '[Test] Unknown' })).toEqual(initialState);
  });

  it('starts loading and clears a previous error', () => {
    expect(coinReducer(loadedState, getCoinsCollection())).toEqual({
      coins: [coinA, coinB], loading: true, error: null,
    });
  });

  it('replaces the collection when loading succeeds', () => {
    expect(coinReducer(loadedState, getCoinsCollectionSuccess({ coinsCollections: [coinB] }))).toEqual({
      coins: [coinB], loading: false, error: null,
    });
  });

  it('keeps the collection and stores the error when loading fails', () => {
    expect(coinReducer(loadedState, getCoinsCollectionFailure({ error: 'offline' }))).toEqual({
      coins: [coinA, coinB], loading: false, error: 'offline',
    });
  });

  it.each([coinA.id, coinB.id])('removes only the requested coin by id %s', (coinId) => {
    const next = coinReducer({ ...loadedState, error: null }, sellCoin({ coinId }));
    expect(next.coins).toEqual(coinId === coinA.id ? [coinB] : [coinA]);
    expect(next).not.toBe(loadedState);
  });

  it('returns the same state for an unknown coin id (no side effect)', () => {
    const next = coinReducer(loadedState, sellCoin({ coinId: 'missing-id' }));
    expect(next).toBe(loadedState);
  });

  it('stores the error when a sell fails', () => {
    const next = coinReducer(loadedState, sellCoinFailure({ error: 'sell failed' }));
    expect(next).toEqual({ coins: [coinA, coinB], loading: false, error: 'sell failed' });
  });

  it('prepends a new coin without changing loading or error state', () => {
    const next = coinReducer(loadedState, addCoin({ coin: coinB }));
    expect(next).toEqual({ coins: [coinB, coinA, coinB], loading: false, error: 'previous error' });
  });
});
