import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Subject, of, throwError } from 'rxjs';
import { getCoinsCollection, getCoinsCollectionFailure, getCoinsCollectionSuccess } from '../actions/coin.actions';
import { Coin } from '../models/Coin';
import { CoinService } from '../services/coin-service';
import { CoinEffects } from './coin.effects';

describe('CoinEffects', () => {
  let actions$: Subject<Action>;
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

  it('does not emit or call the service for unrelated actions', () => {
    const emitted: Action[] = [];
    const subscription = effects.loadCoinsCollection$.subscribe((action) => emitted.push(action));

    actions$.next({ type: '[Test] Unrelated action' });

    expect(service.getCoinCollection).not.toHaveBeenCalled();
    expect(emitted).toEqual([]);
    subscription.unsubscribe();
  });

  it('cancels an in-flight request when a newer collection request arrives', () => {
    const firstRequest$ = new Subject<Coin[]>();
    const secondRequest$ = new Subject<Coin[]>();
    const firstCoins = [new Coin('Old result', '', 'Italy', 2002, 1, 1)];
    const latestCoins = [new Coin('Latest result', '', 'France', 2003, 2, 2)];
    const emitted: Action[] = [];

    service.getCoinCollection
      .mockReturnValueOnce(firstRequest$)
      .mockReturnValueOnce(secondRequest$);
    const subscription = effects.loadCoinsCollection$.subscribe((action) => emitted.push(action));

    actions$.next(getCoinsCollection());
    actions$.next(getCoinsCollection());
    firstRequest$.next(firstCoins);
    secondRequest$.next(latestCoins);

    expect(service.getCoinCollection).toHaveBeenCalledTimes(2);
    expect(emitted).toEqual([getCoinsCollectionSuccess({ coinsCollections: latestCoins })]);
    subscription.unsubscribe();
  });
});
