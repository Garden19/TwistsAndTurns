import { FinanceEntryType } from './finance-entry';

export enum RecurrenceUnit {
    Week = 0,
    Month = 1,
    Year = 2
}

export interface RecurringFinanceItem {
    id: number;
    name: string;
    amount: number;
    entryType: FinanceEntryType;
    category: string;
    recurrenceUnit: RecurrenceUnit;
    recurrenceInterval: number;
    startDate: string;
    isActive: boolean;
    createdAt: string;
    bankAccountId: number | null;
    bankAccountName: string | null;
    bankName: string | null;
}