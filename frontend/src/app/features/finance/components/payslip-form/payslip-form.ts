import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    type Payslip,
    type SavePayslipRequest
} from '../../models/payslip';
import { PayslipService } from '../../services/payslip.service';

@Component({
    selector: 'app-payslip-form',
    imports: [
        FormsModule
    ],
    templateUrl: './payslip-form.html',
    styleUrl: './payslip-form.css'
})
export class PayslipForm implements OnChanges {
    @Input()
    payslip: Payslip | null = null;

    @Output()
    payslipSaved =
        new EventEmitter<Payslip>();

    @Output()
    payslipArchived =
        new EventEmitter<number>();

    @Output()
    cancelRequested =
        new EventEmitter<void>();

    employerName = '';
    payDate = '';
    grossPay: number | null = null;
    incomeTax: number | null = 0;
    nationalInsurance: number | null = 0;
    pensionContribution: number | null = 0;
    otherDeductions: number | null = 0;
    netPay: number | null = null;
    notes = '';

    isSaving = false;
    isArchiving = false;
    showArchiveConfirmation = false;
    errorMessage = '';

    constructor(
        private payslipService: PayslipService
    ) {
    }

    get isEditing(): boolean {
        return this.payslip !== null;
    }

    get totalDeductions(): number {
        return (
            (this.incomeTax ?? 0) +
            (this.nationalInsurance ?? 0) +
            (this.pensionContribution ?? 0) +
            (this.otherDeductions ?? 0)
        );
    }

    ngOnChanges(
        changes: SimpleChanges
    ): void {
        if (changes['payslip']) {
            this.populateForm();
        }
    }

    onSubmit(): void {
        const employerName =
            this.employerName.trim();

        this.errorMessage = '';

        if (employerName === '') {
            this.errorMessage =
                'Please enter the employer name.';

            return;
        }

        if (this.payDate === '') {
            this.errorMessage =
                'Please select the pay date.';

            return;
        }

        if (
            this.grossPay === null ||
            this.grossPay <= 0
        ) {
            this.errorMessage =
                'Gross pay must be greater than £0.';

            return;
        }

        if (this.netPay === null) {
            this.errorMessage =
                'Please enter the net pay.';

            return;
        }

        if (
            this.netPay < 0 ||
            this.hasNegativeDeduction()
        ) {
            this.errorMessage =
                'Payslip amounts cannot be negative.';

            return;
        }

        const request: SavePayslipRequest = {
            employerName: employerName,
            payDate: this.payDate,
            grossPay: this.grossPay,
            incomeTax:
                this.incomeTax ?? 0,
            nationalInsurance:
                this.nationalInsurance ?? 0,
            pensionContribution:
                this.pensionContribution ?? 0,
            otherDeductions:
                this.otherDeductions ?? 0,
            netPay: this.netPay,
            notes:
                this.notes.trim() === ''
                    ? null
                    : this.notes.trim()
        };

        this.isSaving = true;

        if (this.payslip === null) {
            this.createPayslip(request);
            return;
        }

        this.updatePayslip(
            this.payslip.id,
            request
        );
    }

    requestArchive(): void {
        this.errorMessage = '';
        this.showArchiveConfirmation = true;
    }

    cancelArchive(): void {
        this.showArchiveConfirmation = false;
    }

    archivePayslip(): void {
        if (this.payslip === null) {
            return;
        }

        this.errorMessage = '';
        this.isArchiving = true;

        const payslipId =
            this.payslip.id;

        this.payslipService
            .archivePayslip(payslipId)
            .subscribe({
                next: () => {
                    this.isArchiving = false;

                    this.payslipArchived.emit(
                        payslipId
                    );
                },
                error: (error) => {
                    console.error(error);

                    this.errorMessage =
                        'The payslip could not be archived.';

                    this.isArchiving = false;
                }
            });
    }

    cancel(): void {
        if (
            this.isSaving ||
            this.isArchiving
        ) {
            return;
        }

        this.cancelRequested.emit();
    }

    private createPayslip(
        request: SavePayslipRequest
    ): void {
        this.payslipService
            .createPayslip(request)
            .subscribe({
                next: (createdPayslip) => {
                    this.isSaving = false;

                    this.payslipSaved.emit(
                        createdPayslip
                    );
                },
                error: (error) => {
                    console.error(error);

                    this.errorMessage =
                        'The payslip could not be created.';

                    this.isSaving = false;
                }
            });
    }

    private updatePayslip(
        id: number,
        request: SavePayslipRequest
    ): void {
        this.payslipService
            .updatePayslip(
                id,
                request
            )
            .subscribe({
                next: (updatedPayslip) => {
                    this.isSaving = false;

                    this.payslipSaved.emit(
                        updatedPayslip
                    );
                },
                error: (error) => {
                    console.error(error);

                    this.errorMessage =
                        'The payslip could not be updated.';

                    this.isSaving = false;
                }
            });
    }

    private hasNegativeDeduction(): boolean {
        return (
            (this.incomeTax ?? 0) < 0 ||
            (this.nationalInsurance ?? 0) < 0 ||
            (this.pensionContribution ?? 0) < 0 ||
            (this.otherDeductions ?? 0) < 0
        );
    }

    private populateForm(): void {
        this.isSaving = false;
        this.isArchiving = false;
        this.showArchiveConfirmation = false;
        this.errorMessage = '';

        if (this.payslip === null) {
            this.employerName = '';
            this.payDate = '';
            this.grossPay = null;
            this.incomeTax = 0;
            this.nationalInsurance = 0;
            this.pensionContribution = 0;
            this.otherDeductions = 0;
            this.netPay = null;
            this.notes = '';
            return;
        }

        this.employerName =
            this.payslip.employerName;

        this.payDate =
            this.payslip.payDate.substring(
                0,
                10
            );

        this.grossPay =
            this.payslip.grossPay;

        this.incomeTax =
            this.payslip.incomeTax;

        this.nationalInsurance =
            this.payslip.nationalInsurance;

        this.pensionContribution =
            this.payslip.pensionContribution;

        this.otherDeductions =
            this.payslip.otherDeductions;

        this.netPay =
            this.payslip.netPay;

        this.notes =
            this.payslip.notes ?? '';
    }
}