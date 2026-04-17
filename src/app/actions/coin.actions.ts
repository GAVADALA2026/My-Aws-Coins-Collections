import { createAction, props } from '@ngrx/store';
import { Coin } from '../models/Coin';

export const seelCoin = createAction(
  '[Coin Component] find & sell a coin',
  props<{ coinIdx: number }>(),
);

export const addCoin = createAction(
  '[Coin Component] add a coin inside the collection',
  props<{ coin: Coin }>(),
);
