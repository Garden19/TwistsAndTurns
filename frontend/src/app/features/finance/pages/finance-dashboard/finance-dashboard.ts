import { Component, OnInit } from '@angular/core';
import { Finance } from '../../services/finance';
import type { FinanceEntry } from '../../models/finance-entry';
import { FinanceOverviewChart } from '../../components/finance-overview-chart/finance-overview-chart';
import { FinanceManager } from "../../components/finance-manager/finance-manager";

@Component({
    selector: 'app-finance-dashboard',
    imports: [FinanceManager],
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