import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { Subject, of, throwError } from 'rxjs';
import { getCoinsCollection, getCoinsCollectionFailure, getCoinsCollectionSuccess } from '../actions/coin.actions';
import { Coin } from '../models/Coin';
import { CoinService } from '../services/coin-service';
import { CoinEffects } from './coin.effects';

describe('CoinEffects', () => {
  let actions$: Subject<ReturnType<typeof getCoinsCollection>>;
  let service: { getCoinCollection: jest.Mock };
  let effects: CoinEffects;

  beforeEach(() => {
    actions$ = new Subject();
    service = { getCoinCollection: jest.fn() };
    TestBed.configureTestingModule({
      providers: [
        CoinEffects,
        { provide: Actions, useValue: new Actions(actions$) },
        { provide: CoinService, useValue: service },
      ],
    });
    effects = TestBed.inject(CoinEffects);
  });

  it('dispatches success with coins returned by the service', (done) => {
    const coins = [new Coin('Euro', '', 'Italy', 2002, 1, 2)];
    service.getCoinCollection.mockReturnValue(of(coins));

    effects.loadCoinsCollection$.subscribe((action) => {
      expect(action).toEqual(getCoinsCollectionSuccess({ coinsCollections: coins }));
      expect(service.getCoinCollection).toHaveBeenCalledTimes(1);
      done();
    });
    actions$.next(getCoinsCollection());
  });

  it('dispatches the original message for Error failures', (done) => {
    service.getCoinCollection.mockReturnValue(throwError(() => new Error('offline')));

    effects.loadCoinsCollection$.subscribe((action) => {
      expect(action).toEqual(getCoinsCollectionFailure({ error: 'offline' }));
      done();
    });
    actions$.next(getCoinsCollection());
  });

  it('uses a safe fallback for non-Error failures', (done) => {
    service.getCoinCollection.mockReturnValue(throwError(() => 'offline'));

    effects.loadCoinsCollection$.subscribe((action) => {
      expect(action).toEqual(getCoinsCollectionFailure({ error: 'Unable to load coins collection' }));
      done();
    });
    actions$.next(getCoinsCollection());
  });
});
