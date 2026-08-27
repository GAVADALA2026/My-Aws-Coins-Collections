import { Coin } from '../models/Coin';
import {
  selectCoins,
  selectCoinsCount,
  selectCoinsError,
  selectCoinsLoading,
  selectCoinsTotalEstimatedValue,
  selectCoinsViewModel,
} from './coin.selectors';

describe('coin selectors', () => {
  const coinA = new Coin('A', '', 'Italy', 2002, 1, 2);
  const coinB = new Coin('B', '', 'France', 2003, 2, 3);
  const state = {
    user: { username: '', pwd: '' },
    coinCollection: { coins: [coinA, coinB], loading: true, error: 'offline' },
  };

  it('selects the coins array', () => {
    expect(selectCoins(state)).toEqual([coinA, coinB]);
  });

  it('selects the loading flag', () => {
    expect(selectCoinsLoading(state)).toBe(true);
  });

  it('selects the error', () => {
    expect(selectCoinsError(state)).toBe('offline');
  });

  it('selects the coin count', () => {
    expect(selectCoinsCount(state)).toBe(2);
  });

  it('selects the total estimated value', () => {
    expect(selectCoinsTotalEstimatedValue(state)).toBe(5);
  });

  it('selects a combined view model', () => {
    expect(selectCoinsViewModel(state)).toEqual({
      coins: [coinA, coinB],
      loading: true,
      error: 'offline',
      count: 2,
      totalEstimatedValue: 5,
    });
  });
});
