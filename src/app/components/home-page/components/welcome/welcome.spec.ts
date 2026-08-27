import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { AppState } from '../../../../AppState';
import { Welcome } from './welcome';

describe('Welcome', () => {
  const createFixture = async (username: string) => {
    const state: AppState = { user: { username, pwd: '' }, coinCollection: { coins: [], loading: false, error: null } };
    const store = { select: jest.fn((selector: (current: AppState) => unknown) => of(selector(state))) };
    await TestBed.configureTestingModule({
      imports: [Welcome],
      providers: [provideNoopAnimations(), { provide: Store, useValue: store }],
    }).compileComponents();
    const fixture = TestBed.createComponent(Welcome);
    fixture.detectChanges();
    return { fixture, store };
  };

  it('selects and renders the authenticated username', async () => {
    const { fixture, store } = await createFixture('Gabriele');
    expect(store.select).toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Gabriele');
  });

  it('renders User when the username is empty', async () => {
    const { fixture } = await createFixture('');
    expect(fixture.nativeElement.textContent).toContain('User');
  });
});
