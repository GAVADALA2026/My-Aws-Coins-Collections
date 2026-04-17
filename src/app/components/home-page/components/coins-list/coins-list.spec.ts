import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinsList } from './coins-list';

describe('CoinsList', () => {
  let component: CoinsList;
  let fixture: ComponentFixture<CoinsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoinsList],
    }).compileComponents();

    fixture = TestBed.createComponent(CoinsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
