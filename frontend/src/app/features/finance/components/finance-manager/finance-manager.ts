import { Component, Input } from '@angular/core';
import { CurrencyPipe, PercentPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    FinanceEntryType,
    type FinanceEntry
} from '../../models/finance-entry';
import { CreateFinanceEntryRequest } from '../../models/create-finance-entry-request';
import { FinanceOverviewChart } from '../finance-overview-chart/finance-overview-chart';
import { Finance } from '../../services/finance';
import { BankAccountManager } from '../bank-account-manager/bank-account-manager';
import { BankAccount } from '../../models/bank-account';
import { BankAccounts } from '../../services/bank-accounts';

@Component({
    selector: 'app-finance-manager',
    imports: [
        CurrencyPipe,
        PercentPipe,
        FinanceOverviewChart,
        FormsModule,
        BankAccountManager
    ],
    templateUrl: './finance-manager.html',
    styleUrl: './finance-manager.css',
})
export class FinanceManager {

    constructor(
        private financeService: Finance,
        private bankAccountsService: BankAccounts
    ) {}

    @Input() financeEntries: FinanceEntry[] = [];

    isSaving = false;

    itemName = '';
    itemAmount: number | null = null;
    itemKind = 'income';
    itemCategory = '';
    itemIsRecurring = false;
    itemDueDate = '';
    itemBankAccountId: number | null = null;

    bankAccounts: BankAccount[] = [];

    activeDrawer:
        | 'addItem'
        | 'bankAccounts'
        | null = null;

    openBankAccounts(): void {
        this.activeDrawer = 'bankAccounts';
    }

    openAddForm(): void {
        this.activeDrawer = 'addItem';

        this.bankAccountsService
            .getBankAccounts()
            .subscribe({
                next: (accounts) => {
                    this.bankAccounts = accounts;
                },
                error: (error) => {
                    console.error(error);
                }
            });
    }

    closeDrawer(): void {
        this.activeDrawer = null;
    }

    saveFinanceEntry(): void {
        if (
            this.itemName.trim() === '' ||
            this.itemAmount === null ||
            this.itemCategory === ''
        ) {
            return;
        }

        this.isSaving = true;

        const entryType =
            this.itemKind === 'income'
                ? FinanceEntryType.Income
                : FinanceEntryType.Expense;

        const request: CreateFinanceEntryRequest = {
            name: this.itemName,
            amount: this.itemAmount,
            entryType: entryType,
            category: this.itemCategory,
            bankAccountId: this.itemBankAccountId
        };

        this.financeService
            .createFinanceEntry(request)
            .subscribe({
                next: (createdEntry) => {
                    this.financeEntries = [
                        createdEntry,
                        ...this.financeEntries
                    ];

                    this.itemName = '';
                    this.itemAmount = null;
                    this.itemKind = 'income';
                    this.itemCategory = '';
                    this.itemBankAccountId = null;
                    this.itemIsRecurring = false;
                    this.itemDueDate = '';

                    this.isSaving = false;
                    this.closeDrawer();
                },
                error: (error) => {
                    console.error(error);
                    this.isSaving = false;
                }
            });
    }

    get totalIncome(): number {
        return this.financeEntries
            .filter(
                (entry) =>
                    entry.entryType === FinanceEntryType.Income
            )
            .reduce(
                (total, entry) =>
                    total + entry.amount,
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
                (total, entry) =>
                    total + entry.amount,
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

    deleteFinanceEntry(entry: FinanceEntry): void {
        const confirmed = window.confirm(
            `Are you sure you want to remove "${entry.name}"?`
        );

        if (!confirmed) {
            return;
        }

        this.financeService
            .deleteFinanceEntry(entry.id)
            .subscribe({
                next: () => {
                    this.financeEntries =
                        this.financeEntries.filter(
                            (financeEntry) =>
                                financeEntry.id !== entry.id
                        );
                },
                error: (error) => {
                    console.error(error);
                }
            });
    }
}