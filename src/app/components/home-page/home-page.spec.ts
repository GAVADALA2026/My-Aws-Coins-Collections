import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { HomePage } from './home-page';

describe('HomePage', () => {
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    const state = { user: { username: 'Gabriele', pwd: 'password' }, coinCollection: { coins: [], loading: false, error: null } };
    const store = { dispatch: jest.fn(), select: jest.fn((selector) => of(selector(state))) };
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [provideNoopAnimations(), { provide: Store, useValue: store }],
    }).compileComponents();
    fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();
  });

  it('composes welcome, new-coin and coins-list sections', () => {
    expect(fixture.nativeElement.querySelector('app-welcome')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('app-new-coin')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('app-coins-list')).not.toBeNull();
  });
});
