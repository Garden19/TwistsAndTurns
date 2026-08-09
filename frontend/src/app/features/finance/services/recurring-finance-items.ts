import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecurringFinanceItem } from '../models/recurring-finance-item';
import { CreateRecurringFinanceItemRequest } from '../models/create-recurring-finance-item-request';

@Injectable({
    providedIn: 'root'
})
export class RecurringFinanceItems {
    private apiUrl =
        'http://localhost:5200/api/recurring-finance-items';

    constructor(
        private http: HttpClient
    ) {}

    createRecurringFinanceItem(
        request: CreateRecurringFinanceItemRequest
    ): Observable<RecurringFinanceItem> {
        return this.http.post<RecurringFinanceItem>(
            this.apiUrl,
            request,
            {
                withCredentials: true
            }
        );
    }

    generateForMonth(
        year: number,
        month: number
    ): Observable<{ generatedCount: number }> {
        return this.http.post<{ generatedCount: number }>(
            `${this.apiUrl}/generate?year=${year}&month=${month}`,
            {},
            {
                withCredentials: true
            }
        );
    }

    stopRecurringFinanceItem(
        id: number,
        stopAfterDate: string
    ): Observable<void> {
        return this.http.post<void>(
            `${this.apiUrl}/${id}/stop`,
            {
                stopAfterDate: stopAfterDate
            },
            {
                withCredentials: true
            }
        );
    }
}