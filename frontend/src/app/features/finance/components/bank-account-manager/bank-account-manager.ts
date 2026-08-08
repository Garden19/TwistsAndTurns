import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BankAccount } from '../../models/bank-account';
import { CreateBankAccountRequest } from '../../models/create-bank-account-request';
import { BankAccounts } from '../../services/bank-accounts';

@Component({
    selector: 'app-bank-account-manager',
    imports: [FormsModule],
    templateUrl: './bank-account-manager.html',
    styleUrl: './bank-account-manager.css',
})
export class BankAccountManager implements OnInit {
    bankAccounts: BankAccount[] = [];

    accountName = '';
    bankName = '';
    formError = '';

    constructor(
        private bankAccountsService: BankAccounts
    ) {}

    ngOnInit(): void {
        this.bankAccountsService
            .getBankAccounts()
            .subscribe({
                next: (accounts) => {
                    this.bankAccounts = accounts;

                    console.log(this.bankAccounts);
                },
                error: (error) => {
                    console.error(error);
                }
            });
    }

    addBankAccount(): void {
        const trimmedAccountName = this.accountName.trim();
        const trimmedBankName = this.bankName.trim();

        if (
            trimmedAccountName === '' ||
            trimmedBankName === ''
        ) {
            this.formError = 'Please enter an account name and bank.';
            return;
        }

        this.formError = '';

        const request: CreateBankAccountRequest = {
            name: trimmedAccountName,
            bankName: trimmedBankName
        };

        this.bankAccountsService
            .createBankAccount(request)
            .subscribe({
                next: (createdAccount) => {
                    this.bankAccounts = [
                        createdAccount,
                        ...this.bankAccounts
                    ];

                    this.accountName = '';
                    this.bankName = '';
                },
                error: (error) => {
                    console.error(error);
                }
            });
    }
    removeBankAccount(account: BankAccount): void {
        const confirmed = window.confirm(
            `Are you sure you want to remove "${account.name}"?`
        );

        if (!confirmed) {
            return;
        }

        this.bankAccountsService
            .archiveBankAccount(account.id)
            .subscribe({
                next: () => {
                    this.bankAccounts =
                        this.bankAccounts.filter(
                            bankAccount =>
                                bankAccount.id !== account.id
                        );
                },
                error: (error) => {
                    console.error(error);
                }
            });
    }
}