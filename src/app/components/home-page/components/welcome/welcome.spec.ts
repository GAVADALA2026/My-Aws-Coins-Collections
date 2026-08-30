import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Welcome } from './welcome';

describe('Welcome', () => {
  const createFixture = async () => {
    const state = { coinCollection: { coins: [], loading: false, error: null } };
    const store = { select: jest.fn((selector: (current: typeof state) => unknown) => of(selector(state))) };
    await TestBed.configureTestingModule({
      imports: [Welcome],
      providers: [provideNoopAnimations(), { provide: Store, useValue: store }],
    }).compileComponents();
    const fixture = TestBed.createComponent(Welcome);
    fixture.detectChanges();
    return { fixture, store };
  };

  it('renders a public demo heading without reading user state', async () => {
    const { fixture, store } = await createFixture();
    expect(store.select).toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Coin collection demo');
    expect(fixture.nativeElement.textContent).toContain('Your collection');
  });
});
