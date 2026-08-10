import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FinanceEntry } from '../models/finance-entry';
import { CreateFinanceEntryRequest } from '../models/create-finance-entry-request';

@Injectable({
    providedIn: 'root'
})
export class Finance {
    private apiUrl = 'http://localhost:5200/api/finance-entries';

    constructor(private http: HttpClient) {}

    getFinanceEntries(): Observable<FinanceEntry[]> {
        return this.http.get<FinanceEntry[]>(
            this.apiUrl,
            { withCredentials: true }
        );
    }

    createFinanceEntry(
        request: CreateFinanceEntryRequest
    ): Observable<FinanceEntry> {
        return this.http.post<FinanceEntry>(
            this.apiUrl,
            request,
            { withCredentials: true }
        );
    }

    updateFinanceEntry(
        id: number,
        request: CreateFinanceEntryRequest
    ): Observable<FinanceEntry> {
        return this.http.put<FinanceEntry>(
            `${this.apiUrl}/${id}`,
            request,
            { withCredentials: true }
        );
    }

    deleteFinanceEntry(id: number): Observable<void> {
        return this.http.delete<void>(
            `${this.apiUrl}/${id}`,
            { withCredentials: true }
        );
    }

    updatePaidStatus(
        id: number,
        isPaid: boolean
    ): Observable<void> {
        return this.http.patch<void>(
            `${this.apiUrl}/${id}/paid-status`,
            {
                isPaid: isPaid
            },
            {
                withCredentials: true
            }
        );
    }
}