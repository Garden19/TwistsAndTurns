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
}