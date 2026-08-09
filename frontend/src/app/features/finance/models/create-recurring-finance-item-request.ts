import {
    FinanceEntryType
} from './finance-entry';

import {
    RecurrenceUnit
} from './recurring-finance-item';

export interface CreateRecurringFinanceItemRequest {
    name: string;
    amount: number;
    entryType: FinanceEntryType;
    category: string;
    recurrenceUnit: RecurrenceUnit;
    recurrenceInterval: number;
    startDate: string;
    bankAccountId: number | null;
}