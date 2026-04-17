import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCoin } from './new-coin';

describe('NewCoin', () => {
  let component: NewCoin;
  let fixture: ComponentFixture<NewCoin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewCoin],
    }).compileComponents();

    fixture = TestBed.createComponent(NewCoin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
