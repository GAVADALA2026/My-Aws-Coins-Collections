import { createReducer, on } from '@ngrx/store';
import { Coin } from '../models/Coin';
import {
  addCoin,
  getCoinsCollection,
  getCoinsCollectionFailure,
  getCoinsCollectionSuccess,
  sellCoin,
  sellCoinFailure,
} from '../actions/coin.actions';

export interface CoinState {
  coins: Coin[];
  loading: boolean;
  error: string | null;
}

export const initialState: CoinState = {
  coins: [],
  loading: false,
  error: null,
};

export const coinReducer = createReducer(
  initialState,
  on(getCoinsCollection, (state) => {
    return {
      ...state,
      loading: true,
      error: null,
    };
  }),
  on(getCoinsCollectionSuccess, (_, { coinsCollections }) => {
    return {
      coins: coinsCollections,
      loading: false,
      error: null,
    };
  }),
  on(getCoinsCollectionFailure, (state, { error }) => {
    return {
      ...state,
      loading: false,
      error,
    };
  }),
  on(sellCoin, (state, { coinId }) => {
    const exists = state.coins.some((coin) => coin.id === coinId);
    if (!exists) {
      return state;
    }
    return {
      ...state,
      coins: state.coins.filter((coin) => coin.id !== coinId),
    };
  }),
  on(sellCoinFailure, (state, { error }) => {
    return {
      ...state,
      error,
    };
  }),
  on(addCoin, (state, { coin }) => {
    return {
      ...state,
      coins: [coin, ...state.coins],
    };
  }),
);
