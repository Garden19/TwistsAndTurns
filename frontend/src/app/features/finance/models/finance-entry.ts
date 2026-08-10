import { RecurrenceUnit } from './recurring-finance-item';

export enum FinanceEntryType {
    Income = 0,
    Expense = 1,
}

export interface FinanceEntry {
    id: number;
    name: string;
    amount: number;
    entryType: FinanceEntryType;
    category: string;
    entryDate: string;
    createdAt: string;
    bankAccountId: number | null;
    bankAccountName: string | null;
    bankName: string | null;
    recurringFinanceItemId: number | null;
    isRecurringActive: boolean;
    isSkipped: boolean;
    isPaid: boolean;
    recurrenceUnit: RecurrenceUnit | null;
    recurrenceInterval: number | null;
    recurrenceStartDate: string | null;
}