import { createReducer, on } from '@ngrx/store';
import { Coin } from '../models/Coin';
import { addCoin, seelCoin } from '../actions/coin.actions';

export const initialState: Coin[] = [
  new Coin(
    '1 Euro Cent',
    'Italian circulation coin with classic national side.',
    'Italy',
    2002,
    0.01,
    0.8,
  ),
  new Coin('2 Euro Cent', 'Commemorative style copper-plated euro cent.', 'Spain', 2004, 0.02, 1.2),
  new Coin(
    '5 Euro Cent',
    'Small denomination euro coin in good condition.',
    'France',
    2001,
    0.05,
    1.5,
  ),
  new Coin(
    '10 Euro Cent',
    'Standard euro circulation issue with visible mint details.',
    'Germany',
    2007,
    0.1,
    2.1,
  ),
  new Coin(
    '20 Euro Cent',
    'Well-preserved coin collected from early euro years.',
    'Portugal',
    2003,
    0.2,
    3.4,
  ),
  new Coin(
    '50 Euro Cent',
    'Common euro coin kept as part of a national set.',
    'Belgium',
    2006,
    0.5,
    4.2,
  ),
  new Coin(
    '1 Euro',
    'Bi-metallic euro coin with minor circulation marks.',
    'Netherlands',
    2008,
    1,
    6.8,
  ),
  new Coin(
    '2 Euro',
    'High denomination euro coin from a regular national issue.',
    'Austria',
    2011,
    2,
    8.5,
  ),
  new Coin(
    '2 Euro Commemorative',
    'Special commemorative issue preserved in protective sleeve.',
    'Greece',
    2014,
    2,
    18,
  ),
  new Coin(
    'Rare National Coin',
    'Placeholder entry for a higher-value collectible coin.',
    'San Marino',
    2016,
    2,
    45,
  ),
];

export const coinReducer = createReducer(
  initialState,
  on(seelCoin, (coinCollection, { coinIdx }) => {
    if (coinIdx < 0 || coinIdx >= coinCollection.length) {
      alert('Coin not found');
      return coinCollection;
    }
    return coinCollection.filter((_, index) => index !== coinIdx);
  }),
  on(addCoin, (coinCollection, { coin }) => {
    return [coin, ...coinCollection];
  }),
);
