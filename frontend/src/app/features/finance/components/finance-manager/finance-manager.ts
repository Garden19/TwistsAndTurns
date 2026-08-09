import { Component, Input, OnInit } from '@angular/core';
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
import { RecurrenceUnit } from '../../models/recurring-finance-item';
import { CreateRecurringFinanceItemRequest } from '../../models/create-recurring-finance-item-request';
import { RecurringFinanceItems } from '../../services/recurring-finance-items';

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
export class FinanceManager implements OnInit {

    constructor(
        private financeService: Finance,
        private bankAccountsService: BankAccounts,
        private recurringFinanceItemsService: RecurringFinanceItems
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
    itemRecurrenceUnit = RecurrenceUnit.Month;
    itemRecurrenceInterval = 1;

    hasAttemptedSave = false;

    recurrenceUnits = RecurrenceUnit;

    bankAccounts: BankAccount[] = [];

    isConfirmingDelete = false;
    isEditingEntry = false;

    activeDrawer:
        | 'addItem'
        | 'bankAccounts'
        | 'entryDetails'
        | null = null;

    selectedEntry: FinanceEntry | null = null;

    ngOnInit(): void {
        this.loadBankAccounts();
    }

    startDeleteConfirmation(): void {
        this.isConfirmingDelete = true;
    }

    cancelDeleteConfirmation(): void {
        this.isConfirmingDelete = false;
    }

    openEntryDetails(entry: FinanceEntry): void {
        this.selectedEntry = entry;
        this.activeDrawer = 'entryDetails';
    }

    loadBankAccounts(): void {
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

    openBankAccounts(): void {
        this.activeDrawer = 'bankAccounts';
    }

    openAddForm(): void {
        this.activeDrawer = 'addItem';
    }

    closeDrawer(): void {
        this.activeDrawer = null;
        this.selectedEntry = null;
        this.isConfirmingDelete = false;
        this.isEditingEntry = false;
    }

    startEditingEntry(): void {
        if (this.selectedEntry === null) {
            return;
        }

        this.itemName = this.selectedEntry.name;
        this.itemAmount = this.selectedEntry.amount;
        this.itemCategory = this.selectedEntry.category;
        this.itemBankAccountId =
            this.selectedEntry.bankAccountId;

        this.itemKind =
            this.selectedEntry.entryType === FinanceEntryType.Income
                ? 'income'
                : 'outgoing';

        this.hasAttemptedSave = false;
        this.isEditingEntry = true;
    }

    cancelEditingEntry(): void {
        this.isEditingEntry = false;
        this.hasAttemptedSave = false;
    }

    saveEditedEntry(): void {
        this.hasAttemptedSave = true;

        if (
            this.selectedEntry === null ||
            this.itemName.trim() === '' ||
            this.itemAmount === null ||
            this.itemAmount <= 0 ||
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
            name: this.itemName.trim(),
            amount: this.itemAmount,
            entryType: entryType,
            category: this.itemCategory,
            bankAccountId: this.itemBankAccountId
        };

        this.financeService
            .updateFinanceEntry(
                this.selectedEntry.id,
                request
            )
            .subscribe({
                next: (updatedEntry) => {
                    this.financeEntries =
                        this.financeEntries.map(
                            (entry) =>
                                entry.id === updatedEntry.id
                                    ? updatedEntry
                                    : entry
                        );

                    this.selectedEntry = updatedEntry;

                    this.isEditingEntry = false;
                    this.hasAttemptedSave = false;
                    this.isSaving = false;
                },
                error: (error) => {
                    console.error(error);
                    this.isSaving = false;
                }
            });
    }

    saveFinanceEntry(): void {
        this.hasAttemptedSave = true;

        if (
            this.itemName.trim() === '' ||
            this.itemAmount === null ||
            this.itemAmount <= 0 ||
            this.itemCategory === '' ||
            (
                this.itemIsRecurring &&
                (
                    this.itemDueDate === '' ||
                    this.itemRecurrenceInterval <= 0
                )
            )
        ) {
            return;
        }

        this.isSaving = true;

        const entryType =
            this.itemKind === 'income'
                ? FinanceEntryType.Income
                : FinanceEntryType.Expense;

        if (this.itemIsRecurring) {
            const request: CreateRecurringFinanceItemRequest = {
                name: this.itemName.trim(),
                amount: this.itemAmount,
                entryType: entryType,
                category: this.itemCategory,
                recurrenceUnit: this.itemRecurrenceUnit,
                recurrenceInterval:
                    this.itemRecurrenceInterval,
                startDate: this.itemDueDate,
                bankAccountId: this.itemBankAccountId
            };

            this.recurringFinanceItemsService
                .createRecurringFinanceItem(request)
                .subscribe({
                    next: () => {
                        this.financeService
                            .getFinanceEntries()
                            .subscribe({
                                next: (entries) => {
                                    this.financeEntries = entries;

                                    this.itemName = '';
                                    this.itemAmount = null;
                                    this.itemKind = 'income';
                                    this.itemCategory = '';
                                    this.itemBankAccountId = null;
                                    this.itemIsRecurring = false;
                                    this.itemDueDate = '';
                                    this.itemRecurrenceUnit =
                                        RecurrenceUnit.Month;
                                    this.itemRecurrenceInterval = 1;
                                    this.hasAttemptedSave = false;
                                    this.isSaving = false;

                                    this.closeDrawer();
                                },
                                error: (error) => {
                                    console.error(error);
                                    this.isSaving = false;
                                }
                            });
                    },
                    error: (error) => {
                        console.error(error);
                        this.isSaving = false;
                    }
                });

            return;
        }

        const request: CreateFinanceEntryRequest = {
            name: this.itemName.trim(),
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
                    this.itemRecurrenceUnit =
                        RecurrenceUnit.Month;
                    this.itemRecurrenceInterval = 1;
                    this.hasAttemptedSave = false;
                    this.isSaving = false;

                    this.closeDrawer();
                },
                error: (error) => {
                    console.error(error);
                    this.isSaving = false;
                }
            });
    }

    deleteFinanceEntry(
        entry: FinanceEntry
    ): void {
        this.financeService
            .deleteFinanceEntry(entry.id)
            .subscribe({
                next: () => {
                    this.financeEntries =
                        this.financeEntries.filter(
                            (financeEntry) =>
                                financeEntry.id !== entry.id
                        );

                    this.closeDrawer();
                },
                error: (error) => {
                    console.error(error);
                }
            });
    }

    get totalIncome(): number {
        return this.financeEntries
            .filter(
                (entry) =>
                    entry.entryType ===
                    FinanceEntryType.Income
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
                    entry.entryType ===
                    FinanceEntryType.Expense
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

        return (
            this.totalOutgoings /
            this.totalIncome
        );
    }

    get incomeEntries(): FinanceEntry[] {
        return this.financeEntries.filter(
            (entry) =>
                entry.entryType ===
                FinanceEntryType.Income
        );
    }

    get outgoingEntries(): FinanceEntry[] {
        return this.financeEntries.filter(
            (entry) =>
                entry.entryType ===
                FinanceEntryType.Expense
        );
    }

    get shouldShowOverviewChart(): boolean {
        return (
            this.totalIncome > 0 &&
            this.totalOutgoings > 0
        );
    }

    get selectedEntryIncomePercentage(): number {
        if (
            this.selectedEntry === null ||
            this.totalIncome === 0
        ) {
            return 0;
        }

        return (
            this.selectedEntry.amount /
            this.totalIncome
        );
    }

    get selectedEntryOutgoingPercentage(): number {
        if (
            this.selectedEntry === null ||
            this.selectedEntry.entryType !==
                FinanceEntryType.Expense ||
            this.totalOutgoings === 0
        ) {
            return 0;
        }

        return (
            this.selectedEntry.amount /
            this.totalOutgoings
        );
    }

    get selectedEntryIncomeChartBackground(): string {
        const percentage = Math.min(
            this.selectedEntryIncomePercentage,
            1
        );

        const degrees = percentage * 360;

        return `conic-gradient(
            var(--colour-primary) 0deg ${degrees}deg,
            #e8e8e8 ${degrees}deg 360deg
        )`;
    }
}