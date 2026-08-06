import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { FinanceEntry } from '../models/finance-entry';

@Injectable({
  providedIn: 'root',
})
export class Finance {
  private apiUrl = 'http://localhost:5200/api/finance-entries';

  constructor(private http: HttpClient) {}

  getFinanceEntries(): Observable<FinanceEntry[]> {
    return this.http.get<FinanceEntry[]>(
      this.apiUrl,
      {
        withCredentials: true,
      }
    );
  }
}