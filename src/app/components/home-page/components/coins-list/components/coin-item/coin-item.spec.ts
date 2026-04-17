import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinItem } from './coin-item';

describe('CoinItem', () => {
  let component: CoinItem;
  let fixture: ComponentFixture<CoinItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoinItem],
    }).compileComponents();

    fixture = TestBed.createComponent(CoinItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
