import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { firstValueFrom, Observable, of, Subject, throwError } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { AppState } from '../../AppState';
import { appConfig } from '../../app.config';
import { Coin } from '../../models/Coin';
import { CoinService } from '../../services/coin-service';
import { NewCoin } from './components/new-coin/new-coin';
import { HomePage } from './home-page';

interface NewCoinAccess {
  nameCtrl: { setValue(value: string): void };
  descriptionCtrl: { setValue(value: string): void };
  countryCtrl: { setValue(value: string): void };
  yearCtrl: { setValue(value: number): void };
  currencyValueCtrl: { setValue(value: number): void };
  estimatedValueCtrl: { setValue(value: number): void };
}

interface CoinServiceStub {
  getCoinCollection: jest.MockedFunction<() => Observable<Coin[]>>;
}

describe('HomePage integration: Store, Effects and components', () => {
  const sampleCoin = new Coin('Integration Euro', 'Loaded by the effect', 'Italy', 2002, 2, 18);

  const createFixture = async (coinService: CoinServiceStub): Promise<ComponentFixture<HomePage>> => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        provideNoopAnimations(),
        ...appConfig.providers,
        { provide: CoinService, useValue: coinService },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();
    return fixture;
  };

  it('renders loading then the list after a real request, effect and reducer success flow', async () => {
    const response$ = new Subject<Coin[]>();
    const coinService: CoinServiceStub = {
      getCoinCollection: jest.fn(() => response$.asObservable()),
    };
    const fixture = await createFixture(coinService);

    expect(coinService.getCoinCollection).toHaveBeenCalledTimes(1);
    expect(fixture.nativeElement.querySelector('mat-spinner')).not.toBeNull();

    response$.next([sampleCoin]);
    response$.complete();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('mat-spinner')).toBeNull();
    expect(fixture.nativeElement.querySelectorAll('app-coin-item')).toHaveLength(1);
    expect(fixture.nativeElement.textContent).toContain('Integration Euro');
    expect(fixture.nativeElement.textContent).toContain('18');
  });

  it('renders failure feedback and lets Retry reach the real effect and success state', async () => {
    const coinService: CoinServiceStub = {
      getCoinCollection: jest
        .fn<Observable<Coin[]>, []>()
        .mockImplementationOnce(() => throwError(() => new Error('offline')))
        .mockImplementationOnce(() => of([sampleCoin])),
    };
    const fixture = await createFixture(coinService);

    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Unable to load your coin collection.');
    expect(fixture.nativeElement.textContent).toContain('offline');

    (fixture.nativeElement.querySelector('button[type="button"]') as HTMLButtonElement).click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(coinService.getCoinCollection).toHaveBeenCalledTimes(2);
    expect(fixture.nativeElement.querySelector('.feedback-wrapper')).toBeNull();
    expect(fixture.nativeElement.querySelectorAll('app-coin-item')).toHaveLength(1);
  });

  it('propagates a NewCoin form submission through the reducer to the list and summary', async () => {
    const coinService: CoinServiceStub = { getCoinCollection: jest.fn(() => of([])) };
    const fixture = await createFixture(coinService);
    const store = TestBed.inject(Store) as Store<AppState>;

    await fixture.whenStable();
    fixture.detectChanges();

    const newCoin = fixture.debugElement.query(By.directive(NewCoin)).componentInstance as unknown as NewCoinAccess;
    newCoin.nameCtrl.setValue('Added from form');
    newCoin.descriptionCtrl.setValue('Component integration');
    newCoin.countryCtrl.setValue('France');
    newCoin.yearCtrl.setValue(2024);
    newCoin.currencyValueCtrl.setValue(2);
    newCoin.estimatedValueCtrl.setValue(12.5);

    (fixture.nativeElement.querySelector('form') as HTMLFormElement).dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );

    const coins = await firstValueFrom(
      store.select((state) => state.coinCollection.coins).pipe(
        filter((collection) => collection.some((coin) => coin.name === 'Added from form')),
        take(1),
      ),
    );
    fixture.detectChanges();

    expect(coins).toHaveLength(1);
    expect(coins[0]).toEqual(expect.objectContaining({ name: 'Added from form', estimatedValue: 12.5 }));
    expect(fixture.nativeElement.querySelectorAll('app-coin-item')).toHaveLength(1);
    expect(fixture.nativeElement.textContent).toContain('Added from form');
    expect(fixture.nativeElement.textContent).toContain('12.50');
  });

});
