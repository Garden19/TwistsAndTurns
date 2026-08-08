import { FinanceEntryType } from './finance-entry';

export interface CreateFinanceEntryRequest {
    name: string;
    amount: number;
    entryType: FinanceEntryType;
    category: string;
    bankAccountId: number | null;
}