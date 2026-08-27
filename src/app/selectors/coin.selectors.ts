import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../AppState';
import { CoinState } from '../reducers/coin.reducers';

export const selectCoinState = createFeatureSelector<AppState, CoinState>('coinCollection');

export const selectCoins = createSelector(selectCoinState, (state) => state.coins);

export const selectCoinsLoading = createSelector(selectCoinState, (state) => state.loading);

export const selectCoinsError = createSelector(selectCoinState, (state) => state.error);

export const selectCoinsCount = createSelector(selectCoins, (coins) => coins.length);

export const selectCoinsTotalEstimatedValue = createSelector(selectCoins, (coins) =>
  coins.reduce((sum, coin) => sum + coin.estimatedValue, 0),
);

export const selectCoinsViewModel = createSelector(
  selectCoins,
  selectCoinsLoading,
  selectCoinsError,
  selectCoinsCount,
  selectCoinsTotalEstimatedValue,
  (coins, loading, error, count, totalEstimatedValue) => ({
    coins,
    loading,
    error,
    count,
    totalEstimatedValue,
  }),
);
