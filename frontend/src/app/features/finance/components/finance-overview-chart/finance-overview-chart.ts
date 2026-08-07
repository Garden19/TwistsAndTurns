import { Component, Input, OnChanges } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { FinanceEntryType, type FinanceEntry } from '../../models/finance-entry';
import { ChartConfiguration, ChartData } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
    selector: 'app-finance-overview-chart',
    imports: [BaseChartDirective],
    templateUrl: './finance-overview-chart.html',
    styleUrl: './finance-overview-chart.css',
})
export class FinanceOverviewChart implements OnChanges {
    @Input() financeEntries: FinanceEntry[] = [];

    chartType: 'bar' = 'bar';

    chartPlugins = [
      ChartDataLabels
    ];

    chartData: ChartData<'bar'> = {
        labels: ['Income', 'Expenses'],
        datasets: [
            {
                label: 'Amount',
                data: [0, 0],
                backgroundColor: ['#198754', '#cc1016'],
                borderRadius: 8,
            },
        ],
    };

    chartOptions: ChartConfiguration<'bar'>['options'] = {
      responsive: true,
      maintainAspectRatio: false,

      indexAxis: 'y',

      plugins: {
          legend: {
              display: false,
          },

          datalabels: {
              color: '#000000',

              anchor: 'center',
              align: 'center',

              font: {
                  weight: 'bold',
              },

              formatter: (value: number) => {
                  return value.toLocaleString('en-GB', {
                      style: 'currency',
                      currency: 'GBP',
                  });
              },
          },
      },

      scales: {
          x: {
              display: false,
              beginAtZero: true,
          },

          y: {
              grid: {
                  display: false,
              },

              border: {
                  display: false,
              },
          },
      },
    };

    calculateTotalIncome(): number {
      return this.financeEntries
        .filter(
            (entry) =>
                entry.entryType === FinanceEntryType.Income
        )
        .reduce(
            (total, entry) => total + entry.amount,
            0
        );
    }

    calculateTotalExpenses(): number {
      return this.financeEntries
        .filter(
            (entry) =>
              entry.entryType === FinanceEntryType.Expense
        )
        .reduce(
            (total, entry) => total + entry.amount,
            0
        );
    }

    ngOnChanges(): void {
      const totalIncome = this.calculateTotalIncome();
      const totalExpenses = this.calculateTotalExpenses();

      this.chartData = {
          labels: ['Income', 'Expenses'],
          datasets: [
              {
                  label: 'Amount',
                  data: [
                      totalIncome,
                      totalExpenses,
                  ],
                  backgroundColor: ['#198754', '#cc1016'],
                  borderRadius: 8,
              },
          ],
      };
    }
}