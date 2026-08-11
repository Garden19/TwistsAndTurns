export interface Payslip {
    id: number;
    employerName: string;
    payDate: string;
    grossPay: number;
    incomeTax: number;
    nationalInsurance: number;
    pensionContribution: number;
    otherDeductions: number;
    netPay: number;
    notes: string | null;
    isActive: boolean;
    createdAt: string;
}

export interface SavePayslipRequest {
    employerName: string;
    payDate: string;
    grossPay: number;
    incomeTax: number;
    nationalInsurance: number;
    pensionContribution: number;
    otherDeductions: number;
    netPay: number;
    notes: string | null;
}