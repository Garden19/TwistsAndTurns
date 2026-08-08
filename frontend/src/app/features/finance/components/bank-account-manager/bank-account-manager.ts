import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-bank-account-manager',
    imports: [FormsModule],
    templateUrl: './bank-account-manager.html',
    styleUrl: './bank-account-manager.css',
})
export class BankAccountManager {
    accountName = '';
    bankName = '';
}