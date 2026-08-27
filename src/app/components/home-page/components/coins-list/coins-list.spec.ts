import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Coin } from '../../../../models/Coin';
import { getCoinsCollection } from '../../../../actions/coin.actions';
import { CoinsList } from './coins-list';

interface CoinsListAccess { loadCoins(): void };

describe('CoinsList', () => {
  const coin = new Coin('Euro', 'Commemorative', 'Italy', 2002, 2, 18);

  const createFixture = async (viewModel: unknown) => {
    const store = {
      dispatch: jest.fn(),
      select: jest.fn(() => of(viewModel)),
    };
    await TestBed.configureTestingModule({
      imports: [CoinsList],
      providers: [provideNoopAnimations(), { provide: Store, useValue: store }],
    }).compileComponents();
    const fixture = TestBed.createComponent(CoinsList);
    fixture.detectChanges();
    return { fixture, component: fixture.componentInstance, store };
  };

  it('selects the coins view model and dispatches initial loading', async () => {
    const { component, store } = await createFixture({
      coins: [], loading: false, error: null, count: 0, totalEstimatedValue: 0,
    });
    expect(store.select).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(getCoinsCollection());
    (component as unknown as CoinsListAccess).loadCoins();
    expect(store.dispatch).toHaveBeenCalledTimes(2);
  });

  it('renders a spinner while loading', async () => {
    const { fixture } = await createFixture({
      coins: [], loading: true, error: null, count: 0, totalEstimatedValue: 0,
    });
    expect(fixture.nativeElement.querySelector('mat-spinner')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.feedback-wrapper')).toBeNull();
  });

  it('renders error feedback and retries loading on click', async () => {
    const { fixture, store } = await createFixture({
      coins: [], loading: false, error: 'offline', count: 0, totalEstimatedValue: 0,
    });
    expect(fixture.nativeElement.textContent).toContain('Unable to load your coin collection.');
    fixture.nativeElement.querySelector('button').click();
    expect(store.dispatch).toHaveBeenCalledTimes(2);
  });

  it('renders one coin item for every loaded coin', async () => {
    const { fixture } = await createFixture({
      coins: [coin, coin], loading: false, error: null, count: 2, totalEstimatedValue: 36,
    });
    expect(fixture.nativeElement.querySelectorAll('app-coin-item')).toHaveLength(2);
  });

  it('renders an empty state when the collection has no coins', async () => {
    const { fixture } = await createFixture({
      coins: [], loading: false, error: null, count: 0, totalEstimatedValue: 0,
    });
    expect(fixture.nativeElement.textContent).toContain('Your collection is empty.');
    expect(fixture.nativeElement.querySelectorAll('app-coin-item')).toHaveLength(0);
  });
});
