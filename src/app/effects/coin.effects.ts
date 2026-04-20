import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import {
  getCoinsCollection,
  getCoinsCollectionFailure,
  getCoinsCollectionSuccess,
} from '../actions/coin.actions';
import { CoinService } from '../services/coin-service';

@Injectable()
export class CoinEffects {
  private actions$ = inject(Actions);
  private coinService = inject(CoinService);

  loadCoinsCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getCoinsCollection),
      switchMap(() =>
        this.coinService.getCoinCollection().pipe(
          map((coinsCollections) => getCoinsCollectionSuccess({ coinsCollections })),
          catchError((error: unknown) =>
            of(
              getCoinsCollectionFailure({
                error: error instanceof Error ? error.message : 'Unable to load coins collection',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
