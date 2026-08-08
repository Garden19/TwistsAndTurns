import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BankAccount } from '../models/bank-account';
import { CreateBankAccountRequest } from '../models/create-bank-account-request';

@Injectable({
    providedIn: 'root'
})
export class BankAccounts {
    private apiUrl = 'http://localhost:5200/api/bank-accounts';

    constructor(private http: HttpClient) {}

    getBankAccounts(): Observable<BankAccount[]> {
        return this.http.get<BankAccount[]>(
            this.apiUrl,
            { withCredentials: true }
        );
    }

    createBankAccount(
        request: CreateBankAccountRequest
    ): Observable<BankAccount> {
        return this.http.post<BankAccount>(
            this.apiUrl,
            request,
            { withCredentials: true }
        );
    }
}