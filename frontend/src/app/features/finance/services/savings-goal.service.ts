import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { type SavingsGoal } from '../models/savings-goal';

@Injectable({
    providedIn: 'root'
})
export class SavingsGoalService {
    private readonly apiUrl =
        'http://localhost:5200/api/savingsgoals';

    constructor(
        private http: HttpClient
    ) {
    }

    createSavingsGoal(
        savingsGoal: {
            name: string;
            targetAmount: number;
            currentAmount: number;
            targetDate: string | null;
        }
    ): Observable<SavingsGoal> {
        return this.http.post<SavingsGoal>(
            this.apiUrl,
            savingsGoal,
            {
                withCredentials: true
            }
        );
    }
        getSavingsGoals(): Observable<SavingsGoal[]> {
            return this.http.get<SavingsGoal[]>(
                this.apiUrl,
                {
                    withCredentials: true
                }
            );
        }

        addContribution(
        id: number,
        amount: number
    ): Observable<SavingsGoal> {
        return this.http.post<SavingsGoal>(
            `${this.apiUrl}/${id}/contributions`,
            {
                amount: amount
            },
            {
                withCredentials: true
            }
        );
    }
}