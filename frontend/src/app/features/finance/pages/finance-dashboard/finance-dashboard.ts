import { Component, OnInit } from '@angular/core';
import { Finance } from '../../services/finance';
import type { FinanceEntry } from '../../models/finance-entry';

@Component({
    selector: 'app-finance-dashboard',
    imports: [],
    templateUrl: './finance-dashboard.html',
    styleUrl: './finance-dashboard.css',
})
export class FinanceDashboard implements OnInit {
    financeEntries: FinanceEntry[] = [];

    constructor(private financeService: Finance) {}

    ngOnInit(): void {
        this.loadFinanceEntries();
    }

    loadFinanceEntries(): void {
        this.financeService.getFinanceEntries().subscribe({
            next: (entries) => {
              this.financeEntries = entries;
              console.log(this.financeEntries);  
            },
            error: (error) => {
              console.error('Failed to load finance entries:', error);
            },
        });
    }
}