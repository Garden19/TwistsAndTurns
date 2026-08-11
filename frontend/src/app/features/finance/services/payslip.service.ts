import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    type Payslip,
    type SavePayslipRequest
} from '../models/payslip';

@Injectable({
    providedIn: 'root'
})
export class PayslipService {
    private readonly apiUrl =
        'http://localhost:5200/api/payslips';

    constructor(
        private http: HttpClient
    ) {
    }

    getPayslips(): Observable<Payslip[]> {
        return this.http.get<Payslip[]>(
            this.apiUrl,
            {
                withCredentials: true
            }
        );
    }

    createPayslip(
        request: SavePayslipRequest
    ): Observable<Payslip> {
        return this.http.post<Payslip>(
            this.apiUrl,
            request,
            {
                withCredentials: true
            }
        );
    }

    updatePayslip(
        id: number,
        request: SavePayslipRequest
    ): Observable<Payslip> {
        return this.http.put<Payslip>(
            `${this.apiUrl}/${id}`,
            request,
            {
                withCredentials: true
            }
        );
    }

    archivePayslip(
        id: number
    ): Observable<void> {
        return this.http.delete<void>(
            `${this.apiUrl}/${id}`,
            {
                withCredentials: true
            }
        );
    }
}