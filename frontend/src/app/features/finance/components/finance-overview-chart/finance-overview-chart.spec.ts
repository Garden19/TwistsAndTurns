import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceOverviewChart } from './finance-overview-chart';

describe('FinanceOverviewChart', () => {
  let component: FinanceOverviewChart;
  let fixture: ComponentFixture<FinanceOverviewChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceOverviewChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceOverviewChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
