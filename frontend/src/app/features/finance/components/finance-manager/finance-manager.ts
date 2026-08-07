import { Component, Input } from '@angular/core';
import { FinanceEntryType, type FinanceEntry } from '../../models/finance-entry';
import { CurrencyPipe, PercentPipe } from '@angular/common';
import { FinanceOverviewChart } from '../finance-overview-chart/finance-overview-chart';

@Component({
    selector: 'app-finance-manager',
    imports: [CurrencyPipe, PercentPipe, FinanceOverviewChart],
    templateUrl: './finance-manager.html',
    styleUrl: './finance-manager.css',
})
export class FinanceManager {
  @Input() financeEntries: FinanceEntry[] = [];

  get totalIncome(): number {
  return this.financeEntries
      .filter(
          (entry) =>
              entry.entryType === FinanceEntryType.Income
      )
      .reduce(
          (total, entry) => total + entry.amount,
          0
      );
  }

  get totalOutgoings(): number {
      return this.financeEntries
          .filter(
              (entry) =>
                  entry.entryType === FinanceEntryType.Expense
          )
          .reduce(
              (total, entry) => total + entry.amount,
              0
          );
  }

  get moneyAfterBills(): number {
      return this.totalIncome - this.totalOutgoings;
  }

  get outgoingPercentage(): number {
      if (this.totalIncome === 0) {
          return 0;
      }

      return this.totalOutgoings / this.totalIncome;
  }

  get incomeEntries(): FinanceEntry[] {
    return this.financeEntries.filter(
        (entry) =>
            entry.entryType === FinanceEntryType.Income
    );
  }

  get outgoingEntries(): FinanceEntry[] {
    return this.financeEntries.filter(
        (entry) =>
            entry.entryType === FinanceEntryType.Expense
    );
  }
}