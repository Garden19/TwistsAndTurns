import {
    CurrencyPipe,
    DatePipe,
    
} from '@angular/common';
import {
    Component,
    EventEmitter,
    OnInit,
    Output
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { type Payslip } from '../../models/payslip';
import { PayslipService } from '../../services/payslip.service';

@Component({
    selector: 'app-payslips',
    imports: [
        FormsModule,
        CurrencyPipe,
        DatePipe
    ],
    templateUrl: './payslips.html',
    styleUrl: './payslips.css'
})
export class Payslips implements OnInit {
    @Output()
    managePayslipRequested =
        new EventEmitter<Payslip>();

    payslips: Payslip[] = [];

    selectedTaxYearStart:
        number | null = null;

    isLoading = true;
    loadErrorMessage = '';

    constructor(
        private payslipService: PayslipService
    ) {
    }

    get availableTaxYears(): number[] {
        const years = new Set<number>();

        for (const payslip of this.payslips) {
            years.add(
                this.getTaxYearStart(
                    payslip.payDate
                )
            );
        }

        return Array.from(years)
            .sort(
                (firstYear, secondYear) =>
                    secondYear - firstYear
            );
    }

    get displayedPayslips(): Payslip[] {
        if (
            this.selectedTaxYearStart === null
        ) {
            return this.payslips;
        }

        return this.payslips.filter(
            (payslip) =>
                this.getTaxYearStart(
                    payslip.payDate
                ) ===
                    this.selectedTaxYearStart
        );
    }

    get totalGrossPay(): number {
        return this.displayedPayslips.reduce(
            (total, payslip) =>
                total + payslip.grossPay,
            0
        );
    }

    get totalDeductions(): number {
        return this.displayedPayslips.reduce(
            (total, payslip) =>
                total +
                this.getPayslipDeductions(
                    payslip
                ),
            0
        );
    }

    get totalNetPay(): number {
        return this.displayedPayslips.reduce(
            (total, payslip) =>
                total + payslip.netPay,
            0
        );
    }

    ngOnInit(): void {
        this.loadPayslips();
    }

    loadPayslips(): void {
        this.isLoading = true;
        this.loadErrorMessage = '';

        this.payslipService
            .getPayslips()
            .subscribe({
                next: (payslips) => {
                    this.payslips = payslips;
                    this.selectInitialTaxYear();
                    this.isLoading = false;
                },
                error: (error) => {
                    console.error(error);

                    this.loadErrorMessage =
                        'Your payslips could not be loaded.';

                    this.isLoading = false;
                }
            });
    }

    requestManagePayslip(
        payslip: Payslip
    ): void {
        this.managePayslipRequested.emit(
            payslip
        );
    }

    getPayslipDeductions(
        payslip: Payslip
    ): number {
        return (
            payslip.incomeTax +
            payslip.nationalInsurance +
            payslip.pensionContribution +
            payslip.otherDeductions
        );
    }

    getTaxYearLabel(
        startYear: number
    ): string {
        const endYear =
            (startYear + 1)
                .toString()
                .slice(-2);

        return `${startYear}/${endYear}`;
    }

    private selectInitialTaxYear(): void {
        const availableYears =
            this.availableTaxYears;

        if (availableYears.length === 0) {
            this.selectedTaxYearStart =
                this.getCurrentTaxYearStart();

            return;
        }

        if (
            this.selectedTaxYearStart !== null &&
            availableYears.includes(
                this.selectedTaxYearStart
            )
        ) {
            return;
        }

        const currentTaxYear =
            this.getCurrentTaxYearStart();

        this.selectedTaxYearStart =
            availableYears.includes(
                currentTaxYear
            )
                ? currentTaxYear
                : availableYears[0];
    }

    private getTaxYearStart(
        payDate: string
    ): number {
        const datePart =
            payDate.substring(0, 10);

        const [
            yearText,
            monthText,
            dayText
        ] = datePart.split('-');

        const year = Number(yearText);
        const month = Number(monthText);
        const day = Number(dayText);

        return (
            month > 4 ||
            (
                month === 4 &&
                day >= 6
            )
        )
            ? year
            : year - 1;
    }

    private getCurrentTaxYearStart(): number {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();

        return (
            month > 4 ||
            (
                month === 4 &&
                day >= 6
            )
        )
            ? year
            : year - 1;
    }
}