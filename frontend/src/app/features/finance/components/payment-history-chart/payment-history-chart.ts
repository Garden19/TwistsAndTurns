import { Component, Input } from '@angular/core';
import { PercentPipe } from '@angular/common';
import { type FinanceEntry } from '../../models/finance-entry';

@Component({
    selector: 'app-payment-history-chart',
    imports: [ PercentPipe ],
    templateUrl: './payment-history-chart.html',
    styleUrl: './payment-history-chart.css'
})
export class PaymentHistoryChart {

    @Input()
    financeEntries: FinanceEntry[] = [];

    get chartEntries(): {
        label: string;
        amount: number;
        isPaid: boolean;
    }[] {
        return this.financeEntries.map(
            (entry) => {
                const date = new Date(
                    entry.entryDate
                );

                return {
                    label: date.toLocaleString(
                        'en-GB',
                        {
                            month: 'short'
                        }
                    ),
                    amount: entry.amount,
                    isPaid: entry.isPaid
                };
            }
        );
    }

    get highestAmount(): number {
        if (this.chartEntries.length === 0) {
            return 1;
        }

        return Math.max(
            ...this.chartEntries.map(
                (entry) =>
                    entry.amount
            )
        );
    }

    get paidCount(): number {
        return this.financeEntries.filter(
            (entry) =>
                entry.isPaid
        ).length;
    }

    get paidPercentage(): number {
        if (this.financeEntries.length === 0) {
            return 0;
        }

        return (
            this.paidCount /
            this.financeEntries.length
        );
    }
}