import {
    CurrencyPipe,
    DatePipe
} from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    Output
} from '@angular/core';
import { type BankAccount } from '../../models/bank-account';
import {
    type FinanceEntry
} from '../../models/finance-entry';
import {
    RecurrenceUnit
} from '../../models/recurring-finance-item';

@Component({
    selector: 'app-finance-entry-table',
    imports: [
        CurrencyPipe,
        DatePipe
    ],
    templateUrl: './finance-entry-table.html',
    styleUrl: './finance-entry-table.css'
})
export class FinanceEntryTable {
    @Input()
    bankAccounts: BankAccount[] = [];

    @Input()
    incomeEntries: FinanceEntry[] = [];

    @Input()
    outgoingEntries: FinanceEntry[] = [];

    @Output()
    entrySelected =
        new EventEmitter<FinanceEntry>();

    @Output()
    paidStatusToggled =
        new EventEmitter<FinanceEntry>();

    selectEntry(
        entry: FinanceEntry
    ): void {
        this.entrySelected.emit(entry);
    }

    togglePaidStatus(
        entry: FinanceEntry
    ): void {
        this.paidStatusToggled.emit(entry);
    }

    getNextDueDate(
        entry: FinanceEntry
    ): Date | null {
        if (
            entry.recurringFinanceItemId === null ||
            !entry.isRecurringActive ||
            entry.recurrenceUnit === null ||
            entry.recurrenceInterval === null ||
            entry.recurrenceStartDate === null
        ) {
            return null;
        }

        const nextDate = new Date(
            entry.recurrenceStartDate
        );

        const today = new Date();

        while (nextDate <= today) {
            if (
                entry.recurrenceUnit ===
                RecurrenceUnit.Week
            ) {
                nextDate.setDate(
                    nextDate.getDate() +
                    7 * entry.recurrenceInterval
                );
            }

            if (
                entry.recurrenceUnit ===
                RecurrenceUnit.Month
            ) {
                nextDate.setMonth(
                    nextDate.getMonth() +
                    entry.recurrenceInterval
                );
            }

            if (
                entry.recurrenceUnit ===
                RecurrenceUnit.Year
            ) {
                nextDate.setFullYear(
                    nextDate.getFullYear() +
                    entry.recurrenceInterval
                );
            }
        }

        return nextDate;
    }
}