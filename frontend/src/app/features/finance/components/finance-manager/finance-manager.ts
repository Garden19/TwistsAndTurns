import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanceEntryType, type FinanceEntry } from '../../models/finance-entry';
import { CreateFinanceEntryRequest } from '../../models/create-finance-entry-request';
import { FinanceOverviewChart } from '../finance-overview-chart/finance-overview-chart';
import { Finance } from '../../services/finance';
import { BankAccountManager } from '../bank-account-manager/bank-account-manager';
import { BankAccount } from '../../models/bank-account';
import { BankAccounts } from '../../services/bank-accounts';
import { RecurrenceUnit } from '../../models/recurring-finance-item';
import { CreateRecurringFinanceItemRequest } from '../../models/create-recurring-finance-item-request';
import { RecurringFinanceItems } from '../../services/recurring-finance-items';
import { PaymentHistoryChart } from "../payment-history-chart/payment-history-chart";

@Component({
    selector: 'app-finance-manager',
    imports: [
    CurrencyPipe,
    PercentPipe,
    FinanceOverviewChart,
    FormsModule,
    BankAccountManager,
    DatePipe,
    PaymentHistoryChart
],
    templateUrl: './finance-manager.html',
    styleUrl: './finance-manager.css',
})
export class FinanceManager implements OnInit {

     @ViewChild('financeDrawer')
    financeDrawer?: ElementRef<HTMLElement>;

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
    currentDate = new Date();
    selectedYear = this.currentDate.getFullYear();    
    selectedMonth = this.currentDate.getMonth() + 1;
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
        this.loadSelectedMonth();
    }

    resetDrawerScroll(): void {
        setTimeout(
            () => {
                this.financeDrawer
                    ?.nativeElement
                    .scrollTo({
                        top: 0,
                        behavior: 'auto'
                    });
            }
        );
    }

    startDeleteConfirmation(): void {
        this.isConfirmingDelete = true;
    }

    cancelDeleteConfirmation(): void {
        this.isConfirmingDelete = false;
    }

    get selectedEntryAnnualProjection(): number | null {
      if (
          this.selectedEntry === null ||
          this.selectedEntry.recurringFinanceItemId === null ||
          this.selectedEntry.recurrenceUnit === null ||
          this.selectedEntry.recurrenceInterval === null ||
          this.selectedEntry.recurrenceInterval <= 0
      ) {
          return null;
      }

      if (
          this.selectedEntry.recurrenceUnit ===
          RecurrenceUnit.Week
      ) {
          return (
              this.selectedEntry.amount *
              (52 / this.selectedEntry.recurrenceInterval)
          );
      }

      if (
          this.selectedEntry.recurrenceUnit ===
          RecurrenceUnit.Month
      ) {
          return (
              this.selectedEntry.amount *
              (12 / this.selectedEntry.recurrenceInterval)
          );
      }

      if (
          this.selectedEntry.recurrenceUnit ===
          RecurrenceUnit.Year
      ) {
          return (
              this.selectedEntry.amount *
              (1 / this.selectedEntry.recurrenceInterval)
          );
      }

      return null;
  }

  get selectedEntryPaymentHistory(): FinanceEntry[] {
    if (
        this.selectedEntry === null ||
        this.selectedEntry.recurringFinanceItemId === null
    ) {
        return [];
    }

    return this.financeEntries
        .filter(
            (entry) =>
                entry.recurringFinanceItemId ===
                this.selectedEntry?.recurringFinanceItemId &&
                !entry.isSkipped
        )
        .sort(
            (a, b) =>
                new Date(a.entryDate).getTime() -
                new Date(b.entryDate).getTime()
        );
      }

    openEntryDetails(
        entry: FinanceEntry
    ): void {
        this.selectedEntry = entry;
        this.activeDrawer = 'entryDetails';

        this.resetDrawerScroll();
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

    loadSelectedMonth(): void {
        this.recurringFinanceItemsService
            .generateForMonth(
                this.selectedYear,
                this.selectedMonth
            )
            .subscribe({
                next: () => {
                    this.financeService
                        .getFinanceEntries()
                        .subscribe({
                            next: (entries) => {
                                this.financeEntries = entries;
                            },
                            error: (error) => {
                                console.error(error);
                            }
                        });
                },
                error: (error) => {
                    console.error(error);
                }
            });
    }

    openBankAccounts(): void {
        this.activeDrawer = 'bankAccounts';
        this.resetDrawerScroll();
    }

    openAddForm(): void {
        this.activeDrawer = 'addItem';
        this.resetDrawerScroll();
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

        previousMonth(): void {
            this.selectedMonth--;

            if (this.selectedMonth < 1) {
                this.selectedMonth = 12;
                this.selectedYear--;
            }

            this.loadSelectedMonth();
        }

    nextMonth(): void {
        this.selectedMonth++;

        if (this.selectedMonth > 12) {
            this.selectedMonth = 1;
            this.selectedYear++;
        }

        this.loadSelectedMonth();
    }

    get selectedMonthLabel(): string {
        const date = new Date(
            this.selectedYear,
            this.selectedMonth - 1,
            1
        );

        return date.toLocaleString(
            'en-GB',
            {
                month: 'long',
                year: 'numeric'
            }
        );
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
                                next: () => {
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
                                    this.loadSelectedMonth();
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

        let nextDate = new Date(
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

    stopSelectedRecurringItem(): void {
        if (
            this.selectedEntry === null ||
            this.selectedEntry.recurringFinanceItemId === null
        ) {
            return;
        }

       this.recurringFinanceItemsService
        .stopRecurringFinanceItem(
            this.selectedEntry.recurringFinanceItemId,
            this.selectedEntry.entryDate
        )
            .subscribe({
                next: () => {
                    this.loadSelectedMonth();
                    this.closeDrawer();
                },
                error: (error) => {
                    console.error(error);
                }
            });
    }

    updatePaidStatus(
        entry: FinanceEntry
    ): void {
        const newPaidStatus = !entry.isPaid;

        this.financeService
            .updatePaidStatus(
                entry.id,
                newPaidStatus
            )
            .subscribe({
                next: () => {
                    entry.isPaid = newPaidStatus;
                },
                error: (error) => {
                    console.error(error);
                }
            });
    }

    get leftToPay(): number {
        return this.outgoingEntries
            .filter(
                (entry) =>
                    !entry.isPaid
            )
            .reduce(
                (total, entry) =>
                    total + entry.amount,
                0
            );
    }

    get selectedMonthEntries(): FinanceEntry[] {
        return this.financeEntries.filter(
            (entry) => {
                const entryDate = new Date(
                    entry.entryDate
                );

                return (
                    entryDate.getFullYear() ===
                        this.selectedYear &&
                    entryDate.getMonth() + 1 ===
                        this.selectedMonth &&
                    !entry.isSkipped
                );
            }
        );
    }

    get totalIncome(): number {
        return this.selectedMonthEntries
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
        return this.selectedMonthEntries
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
        return this.selectedMonthEntries.filter(
            (entry) =>
                entry.entryType ===
                FinanceEntryType.Income
        );
    }

    get outgoingEntries(): FinanceEntry[] {
        return this.selectedMonthEntries.filter(
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

    get selectedEntryPaymentHistoryForDisplay(): FinanceEntry[] {
      const history = this.selectedEntryPaymentHistory;

      if (
          typeof window !== 'undefined' &&
          window.innerWidth <= 700
      ) {
          return history.slice(-6);
      }

      return history;
    }
}