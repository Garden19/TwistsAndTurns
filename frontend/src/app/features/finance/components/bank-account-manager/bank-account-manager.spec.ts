import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAccountManager } from './bank-account-manager';

describe('BankAccountManager', () => {
  let component: BankAccountManager;
  let fixture: ComponentFixture<BankAccountManager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankAccountManager]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankAccountManager);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
