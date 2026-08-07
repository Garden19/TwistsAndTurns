import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceManager } from './finance-manager';

describe('FinanceManager', () => {
  let component: FinanceManager;
  let fixture: ComponentFixture<FinanceManager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceManager]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceManager);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
