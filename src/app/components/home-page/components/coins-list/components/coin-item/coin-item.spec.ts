import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { sellCoin } from '../../../../../../actions/coin.actions';
import { Coin } from '../../../../../../models/Coin';
import { CoinItem } from './coin-item';

describe('CoinItem', () => {
  const coin = new Coin('Euro', 'Commemorative', 'Germany', 2002, 2, 18);

  const createFixture = async (inputs?: { coin?: Coin; index?: number | null }) => {
    const store = { dispatch: jest.fn() };
    await TestBed.configureTestingModule({
      imports: [CoinItem],
      providers: [provideNoopAnimations(), { provide: Store, useValue: store }],
    }).compileComponents();
    const fixture = TestBed.createComponent(CoinItem);
    if (inputs?.coin) fixture.componentRef.setInput('coin', inputs.coin);
    if (inputs?.index !== undefined) fixture.componentRef.setInput('index', inputs.index);
    return { fixture, component: fixture.componentInstance, store };
  };

  it('renders the supplied coin and accepts index zero', async () => {
    const { fixture } = await createFixture({ coin, index: 0 });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h3')?.textContent).toContain('Euro');
    expect(fixture.nativeElement.textContent).toContain('🇩🇪');
  });

  it('fails explicitly when coin input is missing', async () => {
    const { fixture } = await createFixture({ index: 0 });
    expect(() => fixture.detectChanges()).toThrow('Add coin as input parameter');
  });

  it.each([undefined, null])('fails explicitly when index is %p', async (index) => {
    const { fixture } = await createFixture({ coin, index });
    expect(() => fixture.detectChanges()).toThrow('Add index as input parameter');
  });

  it('dispatches the sale action for its coin id', async () => {
    const { fixture, component, store } = await createFixture({ coin, index: 2 });
    fixture.detectChanges();
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    component.sell();
    expect(store.dispatch).toHaveBeenCalledWith(sellCoin({ coinId: coin.id }));
  });

  it('does not dispatch the sale action when the user cancels', async () => {
    const { fixture, component, store } = await createFixture({ coin, index: 2 });
    fixture.detectChanges();
    jest.spyOn(window, 'confirm').mockReturnValue(false);
    component.sell();
    expect(store.dispatch).not.toHaveBeenCalled();
  });
});
