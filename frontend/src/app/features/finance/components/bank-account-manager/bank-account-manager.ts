import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateBankAccountRequest } from '../../models/create-bank-account-request';
import { BankAccounts } from '../../services/bank-accounts';

@Component({
    selector: 'app-bank-account-manager',
    imports: [FormsModule],
    templateUrl: './bank-account-manager.html',
    styleUrl: './bank-account-manager.css',
})
export class BankAccountManager {
    accountName = '';
    bankName = '';

    constructor(
        private bankAccountsService: BankAccounts
    ) {}

    addBankAccount(): void {
        const request: CreateBankAccountRequest = {
            name: this.accountName,
            bankName: this.bankName
        };

        this.bankAccountsService
            .createBankAccount(request)
            .subscribe({
                next: (createdAccount) => {
                    console.log(createdAccount);

                    this.accountName = '';
                    this.bankName = '';
                },
                error: (error) => {
                    console.error(error);
                }
            });
    }
}