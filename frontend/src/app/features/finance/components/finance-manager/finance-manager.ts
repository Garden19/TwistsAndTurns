import { Component, Input } from '@angular/core';
import { CurrencyPipe, PercentPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanceEntryType, type FinanceEntry } from '../../models/finance-entry';
import { CreateFinanceEntryRequest } from '../../models/create-finance-entry-request';
import { FinanceOverviewChart } from '../finance-overview-chart/finance-overview-chart';
import { Finance } from '../../services/finance';
import { BankAccountManager } from "../bank-account-manager/bank-account-manager";

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

    constructor(private financeService: Finance) {}

    @Input() financeEntries: FinanceEntry[] = [];

    isAddFormOpen = false;
    isSaving = false;

    itemName = '';
    itemAmount: number | null = null;
    itemKind = 'income';
    itemCategory = '';
    itemIsRecurring = false;
    itemDueDate = '';
    isBankAccountsOpen = false;

    openBankAccounts(): void {
      this.isBankAccountsOpen = true;
    }

    closeBankAccounts(): void {
        this.isBankAccountsOpen = false;
    }
    openAddForm(): void {
        this.isAddFormOpen = true;
    }

    closeAddForm(): void {
        this.isAddFormOpen = false;
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
            category: this.itemCategory
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
            this.itemIsRecurring = false;
            this.itemDueDate = '';

            this.isSaving = false;
            this.closeAddForm();
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