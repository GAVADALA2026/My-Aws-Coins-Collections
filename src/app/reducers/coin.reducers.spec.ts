import {
  addCoin, getCoinsCollection, getCoinsCollectionFailure, getCoinsCollectionSuccess, seelCoin,
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

  it.each([0, 1])('removes only the requested coin at index %i', (coinIdx) => {
    const next = coinReducer({ ...loadedState, error: null }, seelCoin({ coinIdx }));
    expect(next.coins).toEqual(coinIdx === 0 ? [coinB] : [coinA]);
    expect(next).not.toBe(loadedState);
  });

  it.each([-1, 2])('alerts and returns the same state for an invalid index %i', (coinIdx) => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => undefined);
    const next = coinReducer(loadedState, seelCoin({ coinIdx }));

    expect(alertSpy).toHaveBeenCalledWith('Coin not found');
    expect(next).toBe(loadedState);
  });

  it('prepends a new coin without changing loading or error state', () => {
    const next = coinReducer(loadedState, addCoin({ coin: coinB }));
    expect(next).toEqual({ coins: [coinB, coinA, coinB], loading: false, error: 'previous error' });
  });
});
