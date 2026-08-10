import { Component, Input } from '@angular/core';
import { type FinanceEntry } from '../../models/finance-entry';

@Component({
    selector: 'app-monthly-cost-trend',
    imports: [],
    templateUrl: './monthly-cost-trend.html',
    styleUrl: './monthly-cost-trend.css'
})
export class MonthlyCostTrend {

    @Input()
    financeEntries: FinanceEntry[] = [];

    get trendEntries(): {
        label: string;
        amount: number;
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
                    amount: entry.amount
                };
            }
        );
    }

    get lowestAmount(): number {
        if (this.trendEntries.length === 0) {
            return 0;
        }

        return Math.min(
            ...this.trendEntries.map(
                (entry) =>
                    entry.amount
            )
        );
    }

    get highestAmount(): number {
        if (this.trendEntries.length === 0) {
            return 0;
        }

        return Math.max(
            ...this.trendEntries.map(
                (entry) =>
                    entry.amount
            )
        );
    }

    getPointPosition(
        amount: number
    ): number {
        if (
            this.highestAmount ===
            this.lowestAmount
        ) {
            return 50;
        }

        const range =
            this.highestAmount -
            this.lowestAmount;

        const position =
            (
                (
                    amount -
                    this.lowestAmount
                ) /
                range
            ) * 100;

        return 100 - position;
    }

    get trendPoints(): string {
        if (this.trendEntries.length === 0) {
            return '';
        }

        if (this.trendEntries.length === 1) {
            return `50,${this.getPointPosition(
                this.trendEntries[0].amount
            )}`;
        }

        return this.trendEntries
            .map(
                (entry, index) => {
                    const x =
                        (
                            index /
                            (
                                this.trendEntries.length -
                                1
                            )
                        ) * 100;

                    const y =
                        this.getPointPosition(
                            entry.amount
                        );

                    return `${x},${y}`;
                }
            )
            .join(' ');
    }

    get amountChange(): number {
    if (this.trendEntries.length < 2) {
        return 0;
    }

    const firstAmount =
        this.trendEntries[0].amount;

    const latestAmount =
        this.trendEntries[
            this.trendEntries.length - 1
        ].amount;

    return latestAmount - firstAmount;
}

    get trendSummary(): string {
        if (this.amountChange > 0) {
            return `Up £${this.amountChange.toFixed(2)}`;
        }

        if (this.amountChange < 0) {
            return `Down £${Math.abs(
                this.amountChange
            ).toFixed(2)}`;
        }

        return 'No change';
    }
}