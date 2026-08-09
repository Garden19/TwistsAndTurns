import { Component, Input } from '@angular/core';
import { CurrencyPipe, PercentPipe } from '@angular/common';
import { FinanceEntryType, type FinanceEntry } from '../../models/finance-entry';

@Component({
    selector: 'app-finance-overview-chart',
    imports: [PercentPipe],
    templateUrl: './finance-overview-chart.html',
    styleUrl: './finance-overview-chart.css',
})
export class FinanceOverviewChart {
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

    get totalTracked(): number {
        return this.totalIncome + this.totalOutgoings;
    }

    get incomePercentage(): number {
        if (this.totalTracked === 0) {
            return 0;
        }

        return (this.totalIncome / this.totalTracked) * 100;
    }

    get chartBackground(): string {
        return `conic-gradient(
            #1f8b4c 0% ${this.incomePercentage}%,
            #ff4336 ${this.incomePercentage}% 100%
        )`;
    }
}