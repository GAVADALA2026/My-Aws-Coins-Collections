import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeCoinsCollection } from './resume-coins-collection';

describe('ResumeCoinsCollection', () => {
  let component: ResumeCoinsCollection;
  let fixture: ComponentFixture<ResumeCoinsCollection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeCoinsCollection],
    }).compileComponents();

    fixture = TestBed.createComponent(ResumeCoinsCollection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
