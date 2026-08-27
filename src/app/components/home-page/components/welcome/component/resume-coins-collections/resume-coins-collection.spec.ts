import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { Coin } from '../../../../../../models/Coin';
import { ResumeCoinsCollection } from './resume-coins-collection';

describe('ResumeCoinsCollection', () => {
  let component: ResumeCoinsCollection;
  let fixture: ComponentFixture<ResumeCoinsCollection>;
  let store: { select: jest.Mock };

  beforeEach(async () => {
    store = { select: jest.fn((selector) => of(selector({ coinCollection: { coins: [], loading: false, error: null } }))) };
    await TestBed.configureTestingModule({
      imports: [ResumeCoinsCollection],
      providers: [{ provide: Store, useValue: store }],
    }).compileComponents();
    fixture = TestBed.createComponent(ResumeCoinsCollection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('selects the collection at initialization', () => {
    expect(store.select).toHaveBeenCalledTimes(1);
  });

  it('calculates zero count and value for an empty collection', () => {
    expect(component.getCoinInfo([])).toEqual({ numCoins: 0, collectionValue: 0 });
  });

  it('sums estimated values and counts every coin', () => {
    const coins = [new Coin('A', '', 'Italy', 2002, 1, 1.5), new Coin('B', '', 'France', 2003, 2, 2.5)];
    expect(component.getCoinInfo(coins)).toEqual({ numCoins: 2, collectionValue: 4 });
  });
});
